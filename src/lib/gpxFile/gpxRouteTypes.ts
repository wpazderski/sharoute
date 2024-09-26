export interface GpxRoute {
    points: GpxRoutePoint[];
    name?: string | undefined;
}

export interface GpxRoutePoint {
    lat: number;
    lon: number;
    ele: number;
}
