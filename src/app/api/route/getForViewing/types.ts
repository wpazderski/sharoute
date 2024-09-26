import type { PublicRoute, RoutePublicId } from "@/lib/db/collections/routes/types";

export interface GetRouteForViewingRequest {
    routePublicId: RoutePublicId;
}

export interface GetRouteForViewingResponse {
    route: PublicRoute;
}
