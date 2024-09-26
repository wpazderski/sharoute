import { NextResponse } from "next/server";
import { AppRoutesRevalidator } from "@/app/AppRoutesRevalidator";
import { auth } from "@/auth";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RouteId, RouteOwnerId } from "@/lib/db/collections/routes/types";
import { Logger } from "@/utils/Logger";
import { deleteRouteRequestValidationSchema } from "./deleteRouteRequestValidationSchema";
import type { DeleteRouteRequest, DeleteRouteResponse } from "./types";

export async function POST(request: Request) {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = (await request.json()) as DeleteRouteRequest;
    const validationResult = deleteRouteRequestValidationSchema.safeParse(requestData);
    if (!validationResult.success) {
        Logger.errorDev("Validation errors:", validationResult.error.errors);
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const routeId = validationResult.data.routeId as RouteId;

    const route = await RoutesCollection.getInstance().getById(routeId);
    if (route === null || route.ownerId !== userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await RoutesCollection.getInstance().deleteById(routeId);
    AppRoutesRevalidator.onRouteChange(route.publicId);

    const responseData: DeleteRouteResponse = {};
    return Response.json(responseData);
}
