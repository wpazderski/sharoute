import type { Opaque, Timestamp } from "@/types";
import type { DistanceMeters, Latitude, Longitude } from "@/units";
import type { routePointTypes } from "./routePointTypes";

// Route primitive types
declare const _RouteId: unique symbol;
export type RouteId = Opaque<string, typeof _RouteId>;

declare const _RouteCreatedAtTimestamp: unique symbol;
export type RouteCreatedAtTimestamp = Opaque<Timestamp, typeof _RouteCreatedAtTimestamp>;

declare const _RouteUpdatedAtTimestamp: unique symbol;
export type RouteUpdatedAtTimestamp = Opaque<Timestamp, typeof _RouteUpdatedAtTimestamp>;

declare const _RoutePublicId: unique symbol;
export type RoutePublicId = Opaque<string, typeof _RoutePublicId>;

declare const _RouteOwnerId: unique symbol;
export type RouteOwnerId = Opaque<string, typeof _RouteOwnerId>;

declare const _RouteName: unique symbol;
export type RouteName = Opaque<string, typeof _RouteName>;

declare const _RouteDescription: unique symbol;
export type RouteDescription = Opaque<string, typeof _RouteDescription>;

declare const _RouteHasElevation: unique symbol;
export type RouteHasElevation = Opaque<boolean, typeof _RouteHasElevation>;

declare const _RoutePhotoId: unique symbol;
export type RoutePhotoId = Opaque<string, typeof _RoutePhotoId>;

// RouteTrackPoint primitive types
declare const _RouteTrackPointLatitude: unique symbol;
export type RouteTrackPointLatitude = Opaque<Latitude, typeof _RouteTrackPointLatitude>;

declare const _RouteTrackPointLongitude: unique symbol;
export type RouteTrackPointLongitude = Opaque<Longitude, typeof _RouteTrackPointLongitude>;

declare const _RouteTrackPointElevationMeters: unique symbol;
export type RouteTrackPointElevationMeters = Opaque<DistanceMeters, typeof _RouteTrackPointElevationMeters>;

// RoutePoint primitive types
declare const _RoutePointId: unique symbol;
export type RoutePointId = Opaque<string, typeof _RoutePointId>;

export type RoutePointType = (typeof routePointTypes)[number];

declare const _RoutePointName: unique symbol;
export type RoutePointName = Opaque<string, typeof _RoutePointName>;

declare const _RoutePointDescription: unique symbol;
export type RoutePointDescription = Opaque<string, typeof _RoutePointDescription>;

declare const _RoutePointPhotoId: unique symbol;
export type RoutePointPhotoId = Opaque<string, typeof _RoutePointPhotoId>;

declare const _RoutePointDistanceFromRouteStartMeters: unique symbol;
export type RoutePointDistanceFromRouteStartMeters = Opaque<DistanceMeters, typeof _RoutePointDistanceFromRouteStartMeters>;

declare const _RoutePointLatitude: unique symbol;
export type RoutePointLatitude = Opaque<Latitude, typeof _RoutePointLatitude>;

declare const _RoutePointLongitude: unique symbol;
export type RoutePointLongitude = Opaque<Longitude, typeof _RoutePointLongitude>;

declare const _RoutePointElevationMeters: unique symbol;
export type RoutePointElevationMeters = Opaque<DistanceMeters, typeof _RoutePointElevationMeters>;

// RouteTrackPoint object type
export interface RouteTrackPoint {
    lat: RouteTrackPointLatitude;
    lon: RouteTrackPointLongitude;
    ele: RouteTrackPointElevationMeters;
}

// RoutePoint object type
export interface RoutePoint {
    id: RoutePointId;
    type: RoutePointType;
    name: RoutePointName;
    description: RoutePointDescription;
    photoIds: RoutePointPhotoId[];
    distanceFromRouteStartMeters: RoutePointDistanceFromRouteStartMeters;
    lat: RoutePointLatitude;
    lon: RoutePointLongitude;
    ele: RoutePointElevationMeters;
}

// Basic Route Data object type
export interface BasicRouteData {
    id: RouteId;
    createdAtTimestamp: RouteCreatedAtTimestamp;
    updatedAtTimestamp: RouteUpdatedAtTimestamp;
    publicId: RoutePublicId;
    ownerId: RouteOwnerId;
    name: RouteName;
    description: RouteDescription;
    hasElevation: RouteHasElevation;
}

// Route object type
export interface Route extends BasicRouteData {
    trackPoints: RouteTrackPoint[];
    points: RoutePoint[];
    photoIds: RoutePhotoId[];
}

// Public Route object type
export type PublicRoute = Omit<Route, "ownerId">;
