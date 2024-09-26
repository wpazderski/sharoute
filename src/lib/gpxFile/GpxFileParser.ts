import { XMLParser } from "fast-xml-parser";
import { InvalidGpxFileError } from "./errors/InvalidGpxFileError";
import { MultipleTrkElementsError } from "./errors/MultipleTrkElementsError";
import { MultipleTrkSegElementsError } from "./errors/MultipleTrkSegElementsError";
import type * as gpxRouteTypes from "./gpxRouteTypes";
import type * as rawGpxFileTypes from "./rawGpxFileTypes";

export class GpxFileParser {
    static async parseGpxFile(file: File): Promise<gpxRouteTypes.GpxRoute> {
        const text = await file.text();
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "@",
        });
        const rawGpxfile = parser.parse(text) as rawGpxFileTypes.RawGpxFile;

        const routeName = rawGpxfile.gpx.metadata?.name;
        if (typeof routeName !== "undefined" && typeof routeName !== "string") {
            throw new InvalidGpxFileError();
        }

        const gpxRoute: gpxRouteTypes.GpxRoute = {
            name: rawGpxfile.gpx.metadata?.name,
            points: this.readGpxRoutePoints(rawGpxfile.gpx.trk),
        };

        return gpxRoute;
    }

    private static readGpxRoutePoints(trk: rawGpxFileTypes.RawGpxFile["gpx"]["trk"]): gpxRouteTypes.GpxRoutePoint[] {
        if (Array.isArray(trk)) {
            throw new MultipleTrkElementsError();
        }
        const trkseg = trk.trkseg;
        if (Array.isArray(trkseg)) {
            throw new MultipleTrkSegElementsError();
        }
        const rawPoints = Array.isArray(trkseg.trkpt) ? trkseg.trkpt : [trkseg.trkpt];
        return rawPoints.map((rawPoint) => {
            const lat = parseFloat(rawPoint["@lat"]);
            const lon = parseFloat(rawPoint["@lon"]);
            const ele = typeof rawPoint.ele === "string" ? parseFloat(rawPoint.ele) : (rawPoint.ele ?? 0);
            if (typeof lat !== "number" || typeof lon !== "number" || typeof ele !== "number" || isNaN(lat) || isNaN(lon) || isNaN(ele)) {
                throw new InvalidGpxFileError();
            }
            return {
                lat,
                lon,
                ele,
            };
        });
    }
}
