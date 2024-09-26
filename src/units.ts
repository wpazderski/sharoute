import type { Opaque } from "./types";

declare const _DistanceMeters: unique symbol;
export type DistanceMeters = Opaque<number, typeof _DistanceMeters>;

declare const _DistanceKiloMeters: unique symbol;
export type DistanceKiloMeters = Opaque<number, typeof _DistanceKiloMeters>;

declare const _DistanceFeet: unique symbol;
export type DistanceFeet = Opaque<number, typeof _DistanceFeet>;

declare const _DistanceMiles: unique symbol;
export type DistanceMiles = Opaque<number, typeof _DistanceMiles>;

declare const _GradeFrac: unique symbol;
export type GradeFrac = Opaque<number, typeof _GradeFrac>;

declare const _Latitude: unique symbol;
export type Latitude = Opaque<number, typeof _Latitude>;

declare const _Longitude: unique symbol;
export type Longitude = Opaque<number, typeof _Longitude>;

export interface LatLon {
    lat: Latitude;
    lon: Longitude;
}
