import type { RoutePoint } from "@/lib/db/collections/routes/types";
import type { RouteTrackPoint } from "@/lib/db/collections/routes/types";
import type { DistanceMeters, LatLon } from "@/units";
import { GeoComputations } from "./GeoComputations";
import { type ClosestPointOnRoute, RouteClosestPointsFinder } from "./RouteClosestPointsFinder";
import type { RouteSegments } from "./types";

export class RouteAnalyzer {
    private routeSegments: RouteSegments | null = null;
    private totalDistance: DistanceMeters | null = null;
    private elevationGain: DistanceMeters | null = null;
    private elevationLoss: DistanceMeters | null = null;
    private elevationMax: DistanceMeters | null = null;
    private elevationMin: DistanceMeters | null = null;

    constructor(
        public trackPoints: RouteTrackPoint[],
        public points: RoutePoint[],
    ) {
        this.trackPoints = trackPoints;
    }

    setPoints(points: RoutePoint[]): void {
        this.points = points;
        this.resetCache("points");
    }

    setTrackPoints(trackPoints: RouteTrackPoint[]): void {
        this.trackPoints = trackPoints;
        this.resetCache("trackPoints");
    }

    setData(trackPoints: RouteTrackPoint[], points: RoutePoint[]): void {
        this.trackPoints = trackPoints;
        this.points = points;
        this.resetCache("all");
    }

    getRouteSegments(): RouteSegments {
        if (this.routeSegments === null) {
            this.routeSegments = GeoComputations.getRouteSegments(this.trackPoints);
        }
        return this.routeSegments;
    }

    getTotalDistance(): DistanceMeters {
        if (this.totalDistance === null) {
            const segments = this.getRouteSegments();
            const lastSegment = segments[segments.length - 1];
            if (lastSegment === undefined) {
                return 0 as DistanceMeters;
            }
            this.totalDistance = (lastSegment.start + lastSegment.length) as DistanceMeters;
        }
        return this.totalDistance;
    }

    getElevationGain(): DistanceMeters {
        if (this.elevationGain === null) {
            const segments = this.getRouteSegments();
            this.elevationGain = segments.reduce((sum, segment) => sum + Math.max(0, segment.deltaElevation), 0) as DistanceMeters;
        }
        return this.elevationGain;
    }

    getElevationLoss(): DistanceMeters {
        if (this.elevationLoss === null) {
            const segments = this.getRouteSegments();
            this.elevationLoss = segments.reduce((sum, segment) => sum + Math.max(0, -(segment.deltaElevation as number)), 0) as DistanceMeters;
        }
        return this.elevationLoss;
    }

    getElevationMax(): DistanceMeters {
        if (this.elevationMax === null) {
            this.elevationMax = Math.max(...this.trackPoints.map((point) => point.ele)) as DistanceMeters;
        }
        return this.elevationMax;
    }

    getElevationMin(): DistanceMeters {
        if (this.elevationMin === null) {
            this.elevationMin = Math.min(...this.trackPoints.map((point) => point.ele)) as DistanceMeters;
        }
        return this.elevationMin;
    }

    getClosestPointsOnRoute(latLon: LatLon): ClosestPointOnRoute[] {
        return new RouteClosestPointsFinder(this.getRouteSegments()).getClosestPointsOnRoute(latLon);
    }

    private resetCache(scope: "points" | "trackPoints" | "all"): void {
        if (scope === "trackPoints" || scope === "all") {
            this.routeSegments = null;
            this.totalDistance = null;
            this.elevationGain = null;
            this.elevationLoss = null;
            this.elevationMax = null;
            this.elevationMin = null;
        }
    }
}
