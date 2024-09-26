import type { DistanceMeters, GradeFrac } from "@/units";
import type { RouteTrackPointLatitude, RouteTrackPointLongitude } from "../db/collections/routes/types";

export interface RouteSegment {
    start: DistanceMeters;
    length: DistanceMeters;
    startElevation: DistanceMeters;
    deltaElevation: DistanceMeters;
    grade: GradeFrac;
    lat0: RouteTrackPointLatitude;
    lon0: RouteTrackPointLongitude;
    lat1: RouteTrackPointLatitude;
    lon1: RouteTrackPointLongitude;
}

export type RouteSegments = RouteSegment[];
