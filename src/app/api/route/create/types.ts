import type { Route } from "@/lib/db/collections/routes/types";
import type * as gpxRouteTypes from "@/lib/gpxFile/gpxRouteTypes";

export interface CreateRouteRequest {
    gpxRoute: gpxRouteTypes.GpxRoute;
}

export interface CreateRouteResponse {
    route: Route;
}
