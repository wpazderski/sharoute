import type { Route, RoutePublicId } from "@/lib/db/collections/routes/types";

export interface GetRouteForManagementRequest {
    routePublicId: RoutePublicId;
}

export interface GetRouteForManagementResponse {
    route: Route;
}
