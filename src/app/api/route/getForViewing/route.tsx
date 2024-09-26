import { type NextRequest, NextResponse } from "next/server";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RoutePublicId } from "@/lib/db/collections/routes/types";
import { Logger } from "@/utils/Logger";
import { getRouteForViewingRequestValidationSchema } from "./getRouteForViewingRequestValidationSchema";
import type { GetRouteForViewingRequest, GetRouteForViewingResponse } from "./types";

export async function GET(request: NextRequest) {
    const requestData: GetRouteForViewingRequest = {
        routePublicId: request.nextUrl.searchParams.get("routePublicId") as RoutePublicId,
    };
    const validationResult = getRouteForViewingRequestValidationSchema.safeParse(requestData);
    if (!validationResult.success) {
        Logger.errorDev("Validation errors:", validationResult.error.errors);
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const { routePublicId } = validationResult.data;
    const route = await RoutesCollection.getInstance().getPublicRoute(routePublicId as RoutePublicId);
    if (route === null) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const responseData: GetRouteForViewingResponse = {
        route: route,
    };
    return Response.json(responseData);
}
