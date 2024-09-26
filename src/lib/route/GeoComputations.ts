import LatLonEllipsoidal from "geodesy/latlon-ellipsoidal";
import LatLonNvectorSpherical from "geodesy/latlon-nvector-spherical";
import type { RouteTrackPoint } from "@/lib/db/collections/routes/types";
import type { DistanceMeters, GradeFrac, LatLon, Latitude, Longitude } from "@/units";
import type { RouteSegment, RouteSegments } from "./types";

export class GeoComputations {
    static getDistanceBetweenPoints(pt1: RouteTrackPoint, pt2: RouteTrackPoint): DistanceMeters {
        const cartesianPt1 = new LatLonEllipsoidal(pt1.lat, pt1.lon, pt1.ele).toCartesian();
        const cartesianPt2 = new LatLonEllipsoidal(pt2.lat, pt2.lon, pt2.ele).toCartesian();
        const cartesianDistance = Math.sqrt(
            (cartesianPt2.x - cartesianPt1.x) ** 2 + (cartesianPt2.y - cartesianPt1.y) ** 2 + (cartesianPt2.z - cartesianPt1.z) ** 2,
        );
        return cartesianDistance as DistanceMeters;
    }

    static getDistanceAlongPoints(points: RouteTrackPoint[]): DistanceMeters {
        let distance = 0;
        for (let i = 1; i < points.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            distance += this.getDistanceBetweenPoints(points[i - 1]!, points[i]!);
        }
        return distance as DistanceMeters;
    }

    static getDistanceBetweenPointsFlat(pt1: RouteTrackPoint, pt2: RouteTrackPoint): DistanceMeters {
        const cartesianPt1 = new LatLonEllipsoidal(pt1.lat, pt1.lon).toCartesian();
        const cartesianPt2 = new LatLonEllipsoidal(pt2.lat, pt2.lon).toCartesian();
        const cartesianDistance = Math.sqrt(
            (cartesianPt2.x - cartesianPt1.x) ** 2 + (cartesianPt2.y - cartesianPt1.y) ** 2 + (cartesianPt2.z - cartesianPt1.z) ** 2,
        );
        return cartesianDistance as DistanceMeters;
    }

    static getGradeBetweenPoints(pt1: RouteTrackPoint, pt2: RouteTrackPoint): GradeFrac {
        const distance = this.getDistanceBetweenPointsFlat(pt1, pt2);
        return ((pt2.ele - pt1.ele) / distance) as GradeFrac;
    }

    static getGradesAlongPoints(points: RouteTrackPoint[]): GradeFrac[] {
        const grades: GradeFrac[] = [];
        for (let i = 1; i < points.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            grades.push(this.getGradeBetweenPoints(points[i - 1]!, points[i]!));
        }
        return grades;
    }

    static getRouteSegments(points: RouteTrackPoint[]): RouteSegments {
        const segments: RouteSegments = [];
        let distance = 0 as DistanceMeters;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        let prevPoint = points[0]!;
        for (let i = 1; i < points.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const point = points[i]!;
            const grade = this.getGradeBetweenPoints(prevPoint, point);
            const distanceStart = distance;
            const segmentLength = this.getDistanceBetweenPoints(prevPoint, point);
            const deltaElevation = (point.ele - prevPoint.ele) as DistanceMeters;
            distance = (distance + segmentLength) as DistanceMeters;
            segments.push({
                start: distanceStart,
                length: segmentLength,
                startElevation: prevPoint.ele,
                deltaElevation: deltaElevation,
                grade: grade,
                lat0: prevPoint.lat,
                lon0: prevPoint.lon,
                lat1: point.lat,
                lon1: point.lon,
            });
            prevPoint = point;
        }
        return segments;
    }

    static getLatLonWithinSegment(segment: RouteSegment, distanceFromRouteStart: DistanceMeters): LatLon {
        const d = Math.min(Math.max(distanceFromRouteStart, segment.start), segment.start + segment.length);
        const lat0 = segment.lat0;
        const lon0 = segment.lon0;
        const lat1 = segment.lat1;
        const lon1 = segment.lon1;
        const lat = (lat0 + ((lat1 - lat0) * (d - segment.start)) / segment.length) as Latitude;
        const lon = (lon0 + ((lon1 - lon0) * (d - segment.start)) / segment.length) as Longitude;
        return { lat, lon };
    }

    static getElevationWithinSegment(segment: RouteSegment, distanceFromRouteStart: DistanceMeters): DistanceMeters {
        const d = Math.min(Math.max(distanceFromRouteStart, segment.start), segment.start + segment.length);
        const d0 = segment.start;
        const d1 = segment.start + segment.length;
        const e0 = segment.startElevation;
        const e1 = segment.startElevation + segment.deltaElevation;
        const elevation = (e0 + ((e1 - e0) * (d - d0)) / (d1 - d0)) as DistanceMeters;
        return elevation;
    }

    static getNearestPointOnSegmentWithDistances(targetLatLon: LatLon, segment: RouteSegment): PointOnSegmentWithDistances {
        const pSegmentStart = new LatLonNvectorSpherical(segment.lat0, segment.lon0);
        const pSegmentEnd = new LatLonNvectorSpherical(segment.lat1, segment.lon1);
        const pTarget = new LatLonNvectorSpherical(targetLatLon.lat, targetLatLon.lon);
        const pNearest = pTarget.nearestPointOnSegment(pSegmentStart, pSegmentEnd);
        const nearestLatLon = { lat: pNearest.lat as Latitude, lon: pNearest.lon as Longitude };
        const targetPointDistanceFromSegment = pNearest.distanceTo(pTarget) as DistanceMeters;
        const nearestPointDistanceFromSegmentStart = pNearest.distanceTo(pSegmentStart) as DistanceMeters;
        return { latLon: nearestLatLon, targetPointDistanceFromSegment, nearestPointDistanceFromSegmentStart };
    }

    static x(p0: LatLon, p1: LatLon): number {
        const pz0 = new LatLonNvectorSpherical(p0.lat, p0.lon);
        const pz1 = new LatLonNvectorSpherical(p1.lat, p1.lon);
        return pz0.distanceTo(pz1);
    }
}

export interface PointOnSegmentWithDistances {
    latLon: LatLon;
    targetPointDistanceFromSegment: DistanceMeters;
    nearestPointDistanceFromSegmentStart: DistanceMeters;
}
