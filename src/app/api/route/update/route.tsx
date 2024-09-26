import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RouteId, RouteOwnerId, RouteUpdatedAtTimestamp } from "@/lib/db/collections/routes/types";
import { Logger } from "@/utils/Logger";
import { sanitizeRichTextHtml } from "@/utils/sanitizeRichTextHtml";
import type { UpdateRouteRequest, UpdateRouteResponse } from "./types";
import { updateRouteRequestValidationSchema } from "./updateRouteRequestValidationSchema";

export async function POST(request: NextRequest) {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData = (await request.json()) as UpdateRouteRequest;
    const validationResult = updateRouteRequestValidationSchema.safeParse(requestData);
    if (!validationResult.success) {
        Logger.errorDev("Validation errors:", validationResult.error.errors);
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const routesCollection = RoutesCollection.getInstance();
    const routePropsToUpdate = validationResult.data.routePropsToUpdate as UpdateRouteRequest["routePropsToUpdate"];
    const routeId = validationResult.data.routeId as RouteId;
    const oldRoute = await routesCollection.getById(routeId);
    if (oldRoute === null || oldRoute.ownerId !== userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const now = Date.now();
    const dbPropsToUpdate: Parameters<RoutesCollection["updateOne"]>[1] = {
        updatedAtTimestamp: now as RouteUpdatedAtTimestamp,
    };
    if (routePropsToUpdate.name !== undefined) {
        dbPropsToUpdate.name = routePropsToUpdate.name;
    }
    if (routePropsToUpdate.description !== undefined) {
        dbPropsToUpdate.description = sanitizeRichTextHtml(routePropsToUpdate.description);
    }
    if (routePropsToUpdate.hasElevation !== undefined) {
        dbPropsToUpdate.hasElevation = routePropsToUpdate.hasElevation;
    }
    if (routePropsToUpdate.points !== undefined) {
        dbPropsToUpdate.points = routePropsToUpdate.points.map((point) => ({
            id: point.id,
            type: point.type,
            name: point.name,
            description: sanitizeRichTextHtml(point.description),
            photoIds: point.photoIds,
            distanceFromRouteStartMeters: point.distanceFromRouteStartMeters,
            lat: point.lat,
            lon: point.lon,
            ele: point.ele,
        }));
    }
    if (routePropsToUpdate.photoIds !== undefined) {
        dbPropsToUpdate.photoIds = routePropsToUpdate.photoIds;
    }

    await routesCollection.updateOne(routeId, dbPropsToUpdate);
    const newRoute = await routesCollection.getById(routeId);
    if (newRoute === null) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const responseData: UpdateRouteResponse = {
        route: newRoute,
    };
    return Response.json(responseData);
}
