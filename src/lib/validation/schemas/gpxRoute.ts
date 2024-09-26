import { z } from "zod";
import { elevation, latitude, longitude } from "./geo";
import { routeName } from "./route";

export const gpxRouteName = routeName;

export const gpxRoutePoint = z.object({
    lat: latitude,
    lon: longitude,
    ele: elevation.optional(),
});

export const gpxRoutePoints = z
    .array(gpxRoutePoint)
    .min(2)
    .max(1000 * 1000);

export const gpxRoute = z.object({
    points: gpxRoutePoints,
    name: gpxRouteName.optional(),
});
