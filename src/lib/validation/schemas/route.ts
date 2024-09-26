import { z } from "zod";
import { routePointTypes } from "@/lib/db/collections/routes/routePointTypes";
import { elevation, latitude, longitude } from "./geo";

export const maxRoutePoints = 100;
export const maxRoutePhotos = 0; // Photos haven't been implemented yet
export const maxRoutePointPhotos = 0; // Photos haven't been implemented yet
export const maxRouteNameLength = 256;
export const maxRouteDescriptionLength = 10 * 1024;
export const maxRoutePointNameLength = 256;
export const maxRoutePointDescriptionLength = 10 * 1024;

// Route primitive props
export const routeId = z.string().length(24);
export const routePublicId = z.string().length(16);
export const routeName = z.string().max(maxRouteNameLength);
export const routeDescription = z.string().max(maxRouteDescriptionLength);
export const routeHasElevation = z.boolean();
export const routePhotoId = z.string().length(24);
export const routePhotoIds = z.array(routePhotoId).max(maxRoutePhotos);

// RouteTrackPoint primitive props
export const routeTrackPointLat = latitude;
export const routeTrackPointLon = longitude;
export const routeTrackPointEle = elevation;

// RoutePoint primitive props
export const routePointId = z.string().length(36);
export const routePointType = z.enum(routePointTypes);
export const routePointName = z.string().max(maxRoutePointNameLength);
export const routePointDescription = z.string().max(maxRoutePointDescriptionLength);
export const routePointPhotoId = z.string().length(24);
export const routePointPhotoIds = z.array(routePointPhotoId).max(maxRoutePointPhotos);
export const routePointDistanceFromRouteStartMeters = z
    .number()
    .min(0)
    .max(10 * 1000 * 1000);
export const routePointLat = latitude;
export const routePointLon = longitude;
export const routePointEle = elevation;

// RouteTrackPoint object and array
export const routeTrackPoint = z.object({
    lat: routeTrackPointLat,
    lon: routeTrackPointLon,
    ele: routeTrackPointEle,
});
export const routeTrackPoints = z
    .array(routeTrackPoint)
    .min(2)
    .max(1000 * 1000);

// RoutePoint object
export const routePoint = z.object({
    id: routePointId,
    type: routePointType,
    name: routePointName,
    description: routePointDescription,
    photoIds: routePointPhotoIds,
    distanceFromRouteStartMeters: routePointDistanceFromRouteStartMeters,
    lat: routePointLat,
    lon: routePointLon,
    ele: routePointEle,
});
export const routePoints = z.array(routePoint).max(maxRoutePoints);

// Route object
export const route = z.object({
    id: routeId,
    publicId: routePublicId,
    name: routeName,
    description: routeDescription,
    hasElevation: routeHasElevation,
    trackPoints: routeTrackPoints,
    points: routePoints,
    photoIds: routePhotoIds,
});
