import type { RouteId } from "@/lib/db/collections/routes/types";

export interface DeleteRouteRequest {
    routeId: RouteId;
}

export interface DeleteRouteResponse {}
