import type {
    Route,
    RouteDescription,
    RouteHasElevation,
    RouteId,
    RouteName,
    RoutePhotoId,
    RoutePointDescription,
    RoutePointDistanceFromRouteStartMeters,
    RoutePointElevationMeters,
    RoutePointId,
    RoutePointLatitude,
    RoutePointLongitude,
    RoutePointName,
    RoutePointPhotoId,
    RoutePointType,
} from "@/lib/db/collections/routes/types";

export interface UpdateRouteRequest {
    routeId: RouteId;
    routePropsToUpdate: {
        name?: RouteName | undefined;
        description?: RouteDescription | undefined;
        hasElevation?: RouteHasElevation | undefined;
        points?:
            | Array<{
                  id: RoutePointId;
                  type: RoutePointType;
                  name: RoutePointName;
                  description: RoutePointDescription;
                  photoIds: RoutePointPhotoId[];
                  distanceFromRouteStartMeters: RoutePointDistanceFromRouteStartMeters;
                  lat: RoutePointLatitude;
                  lon: RoutePointLongitude;
                  ele: RoutePointElevationMeters;
              }>
            | undefined;
        photoIds?: RoutePhotoId[] | undefined;
    };
}

export interface UpdateRouteResponse {
    route: Route;
}
