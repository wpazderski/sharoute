import { NextResponse } from "next/server";
import { AppRoutesRevalidator } from "@/app/AppRoutesRevalidator";
import { auth } from "@/auth";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type {
    RouteName,
    RouteOwnerId,
    RouteTrackPointElevationMeters,
    RouteTrackPointLatitude,
    RouteTrackPointLongitude,
} from "@/lib/db/collections/routes/types";
import { Logger } from "@/utils/Logger";
import { createRouteRequestValidationSchema } from "./createRouteRequestValidationSchema";
import type { CreateRouteRequest, CreateRouteResponse } from "./types";

export async function POST(request: Request) {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = (await request.json()) as CreateRouteRequest;
    const validationResult = createRouteRequestValidationSchema.safeParse(requestData);
    if (!validationResult.success) {
        Logger.errorDev("Validation errors:", validationResult.error.errors);
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const gpxRoute = validationResult.data.gpxRoute;
    const route = await RoutesCollection.getInstance().createRouteFromMinimalData({
        name: (gpxRoute.name ?? "") as RouteName,
        trackPoints: gpxRoute.points.map((gpxRoutePoint) => ({
            lat: gpxRoutePoint.lat as RouteTrackPointLatitude,
            lon: gpxRoutePoint.lon as RouteTrackPointLongitude,
            ele: (gpxRoutePoint.ele ?? 0) as RouteTrackPointElevationMeters,
        })),
        ownerId: userId,
    });
    AppRoutesRevalidator.onRouteChange(route.publicId);

    const responseData: CreateRouteResponse = {
        route: route,
    };
    return Response.json(responseData);
}
