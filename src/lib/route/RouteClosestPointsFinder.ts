import type { DistanceMeters, LatLon } from "@/units";
import { GeoComputations } from "./GeoComputations";
import type { RouteSegment } from "./types";

export class RouteClosestPointsFinder {
    constructor(private readonly routeSegments: RouteSegment[]) {}

    getClosestPointsOnRoute(latLon: LatLon): ClosestPointOnRoute[] {
        let nearestPointsOnAllSegmentsWithDistances = this.getNearestPointsOnAllSegmentsWithDistances(latLon);

        nearestPointsOnAllSegmentsWithDistances = this.excludePointsTooFarFromClosestSegment(nearestPointsOnAllSegmentsWithDistances);
        nearestPointsOnAllSegmentsWithDistances.sort((a, b) => a.nearestPointOnSegmentDistanceFromRouteStart - b.nearestPointOnSegmentDistanceFromRouteStart);

        const monotonicBuckets = this.createAllMonotonicBuckets(nearestPointsOnAllSegmentsWithDistances);
        this.mergeIrrelevantMonotonicBuckets(monotonicBuckets);

        const res: ClosestPointOnRoute[] = [];
        const addPointToRes = (point: NearestPointOnSegmentWithDistances): void => {
            res.push({
                latLon: point.nearestPointOnSegment,
                distanceFromRouteStart: point.nearestPointOnSegmentDistanceFromRouteStart,
                targetPointDistanceFromSegment: point.targetPointDistanceFromSegment,
                segment: point.segment,
            });
        };

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let prevBucket = monotonicBuckets[0]!;
        for (let i = 1; i < monotonicBuckets.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const bucket = monotonicBuckets[i]!;
            if (prevBucket.monotonicity === "decreasing" && bucket.monotonicity === "increasing") {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const prevBucketLastPoint = prevBucket.points[prevBucket.points.length - 1]!;
                addPointToRes(prevBucketLastPoint);
            }
            prevBucket = bucket;
        }

        // Handle last bucket that is decreasing
        const lastBucket = monotonicBuckets[monotonicBuckets.length - 1];
        const lastBucketLastPoint = lastBucket?.points[lastBucket.points.length - 1];
        if (lastBucket?.monotonicity === "decreasing" && lastBucketLastPoint !== undefined) {
            addPointToRes(lastBucketLastPoint);
        }

        // Handle first point in the first bucket that is increasing
        const firstBucket = monotonicBuckets[0];
        const firstBucketFirstPoint = firstBucket?.points[0];
        if (firstBucket?.monotonicity === "increasing" && firstBucketFirstPoint !== undefined) {
            addPointToRes(firstBucketFirstPoint);
        }

        res.sort((a, b) => a.targetPointDistanceFromSegment - b.targetPointDistanceFromSegment);

        return res;
    }

    private getNearestPointsOnAllSegmentsWithDistances(targetLatLon: LatLon): NearestPointOnSegmentWithDistances[] {
        const res: NearestPointOnSegmentWithDistances[] = [];
        let segmentIdx = 0;

        for (const segment of this.routeSegments) {
            const {
                targetPointDistanceFromSegment,
                nearestPointDistanceFromSegmentStart: closestPointOnRouteDistanceFromSegmentStart,
                latLon: nearestPointOnSegment,
            } = GeoComputations.getNearestPointOnSegmentWithDistances(targetLatLon, segment);
            const nearestPointOnSegmentDistanceFromRouteStart = (segment.start + closestPointOnRouteDistanceFromSegmentStart) as DistanceMeters;
            res.push({ segment, targetPointDistanceFromSegment, nearestPointOnSegmentDistanceFromRouteStart, nearestPointOnSegment, segmentIdx });
            ++segmentIdx;
        }
        return res;
    }

    private excludePointsTooFarFromClosestSegment(
        nearestPointsOnAllSegmentsWithDistances: NearestPointOnSegmentWithDistances[],
    ): NearestPointOnSegmentWithDistances[] {
        const closestNearestPointOnSegmentWithDistances = this.closestNearestPointOnSegmentWithDistances(nearestPointsOnAllSegmentsWithDistances);
        if (closestNearestPointOnSegmentWithDistances === null) {
            return [];
        }

        // Ignore points that are too far from the closest segment (3x minimum distance, but at least 100m)
        const minIncludedTargetPointDistanceFromSegment = Math.max(
            100,
            closestNearestPointOnSegmentWithDistances.targetPointDistanceFromSegment * 3,
        ) as DistanceMeters;
        return nearestPointsOnAllSegmentsWithDistances.filter((point) => point.targetPointDistanceFromSegment <= minIncludedTargetPointDistanceFromSegment);
    }

    private closestNearestPointOnSegmentWithDistances(
        nearestPointsOnAllSegmentsWithDistances: NearestPointOnSegmentWithDistances[],
    ): NearestPointOnSegmentWithDistances | null {
        return nearestPointsOnAllSegmentsWithDistances.reduce<NearestPointOnSegmentWithDistances | null>((prev, curr) => {
            if (prev === null || curr.targetPointDistanceFromSegment < prev.targetPointDistanceFromSegment) {
                return curr;
            }
            return prev;
        }, null);
    }

    private getPointsInitialMonotonicity(points: NearestPointOnSegmentWithDistances[]): MonotonicBucket["monotonicity"] | null {
        let monotonicity: MonotonicBucket["monotonicity"] = "increasing";
        const first = points[0];
        if (first === undefined) {
            return null;
        }
        for (let i = 1; i < points.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const curr = points[i]!;
            if (curr.targetPointDistanceFromSegment === first.targetPointDistanceFromSegment) {
                continue;
            }
            monotonicity = first.targetPointDistanceFromSegment < curr.targetPointDistanceFromSegment ? "increasing" : "decreasing";
            break;
        }
        return monotonicity;
    }

    private createAllMonotonicBuckets(nearestPointsOnAllSegmentsWithDistances: NearestPointOnSegmentWithDistances[]): MonotonicBucket[] {
        const monotonicBuckets: MonotonicBucket[] = [];
        const firstBucketMonotonicity = this.getPointsInitialMonotonicity(nearestPointsOnAllSegmentsWithDistances);
        const firstPoint = nearestPointsOnAllSegmentsWithDistances[0];
        if (firstBucketMonotonicity === null || firstPoint === undefined) {
            return [];
        }

        let currentBucket: MonotonicBucket = {
            monotonicity: firstBucketMonotonicity,
            points: [firstPoint],
        };
        monotonicBuckets.push(currentBucket);
        for (const point of nearestPointsOnAllSegmentsWithDistances) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const lastPoint = currentBucket.points[currentBucket.points.length - 1]!;
            if (point.targetPointDistanceFromSegment === lastPoint.targetPointDistanceFromSegment) {
                currentBucket.points.push(point);
                continue;
            }
            const monotonicity = point.targetPointDistanceFromSegment < lastPoint.targetPointDistanceFromSegment ? "decreasing" : "increasing";
            if (monotonicity === currentBucket.monotonicity) {
                currentBucket.points.push(point);
            } else {
                currentBucket = {
                    monotonicity,
                    points: [point],
                };
                monotonicBuckets.push(currentBucket);
            }
        }
        return monotonicBuckets;
    }

    private mergeIrrelevantMonotonicBuckets(monotonicBuckets: MonotonicBucket[]): void {
        for (let i = 0; i < monotonicBuckets.length - 2; i++) {
            /* eslint-disable @typescript-eslint/no-non-null-assertion */
            // Ignoring no-non-null-assertion: 1. for-loop condition ensures that these exist; 2. buckets always have at least one point
            const b1 = monotonicBuckets[i]!;
            const b2 = monotonicBuckets[i + 1]!;
            const b3 = monotonicBuckets[i + 2]!;
            const b2DeltaAbs = Math.abs(b2.points[b2.points.length - 1]!.targetPointDistanceFromSegment - b2.points[0]!.targetPointDistanceFromSegment);
            /* eslint-enable @typescript-eslint/no-non-null-assertion */
            if (b2DeltaAbs < 1) {
                b1.points.push(...b2.points, ...b3.points);
                monotonicBuckets.splice(i + 1, 2);

                // Keep same b1 for the next iteration to check if it can be merged again with the next two buckets
                --i;
            }
        }
    }
}

export interface NearestPointOnSegmentWithDistances {
    nearestPointOnSegment: LatLon;
    segment: RouteSegment;
    segmentIdx: number;
    targetPointDistanceFromSegment: DistanceMeters;
    nearestPointOnSegmentDistanceFromRouteStart: DistanceMeters;
}

export interface ClosestPointOnRoute {
    latLon: LatLon;
    distanceFromRouteStart: DistanceMeters;
    targetPointDistanceFromSegment: DistanceMeters;
    segment: RouteSegment;
}

interface MonotonicBucket {
    monotonicity: "increasing" | "decreasing";
    points: NearestPointOnSegmentWithDistances[];
}
