import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RouteOwnerId, RoutePublicId } from "@/lib/db/collections/routes/types";
import { Logger } from "@/utils/Logger";
import { getRouteForManagementRequestValidationSchema } from "./getRouteForManagementRequestValidationSchema";
import type { GetRouteForManagementRequest, GetRouteForManagementResponse } from "./types";

export async function GET(request: NextRequest) {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestData: GetRouteForManagementRequest = {
        routePublicId: request.nextUrl.searchParams.get("routePublicId") as RoutePublicId,
    };
    const validationResult = getRouteForManagementRequestValidationSchema.safeParse(requestData);
    if (!validationResult.success) {
        Logger.errorDev("Validation errors:", validationResult.error.errors);
        return NextResponse.json({ error: "Bad request" }, { status: 400 });
    }
    const { routePublicId } = validationResult.data;
    const route = await RoutesCollection.getInstance().getRoute(routePublicId as RoutePublicId);
    if (route === null || route.ownerId !== userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const responseData: GetRouteForManagementResponse = {
        route: route,
    };
    return Response.json(responseData);
}
