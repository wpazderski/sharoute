import mapboxgl from "mapbox-gl";
import type { MeasurementSystem, NegativeGradeColoring } from "@/contexts/UserPreferencesContext";
import type { RoutePoint, RouteTrackPoint } from "@/lib/db/collections/routes/types";
import { GradeColors } from "@/lib/route/GradeColors";
import type { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import type { LatLon, Latitude, Longitude } from "@/units";
import { assertVarIsSet } from "@/utils/assertVarIsSet";
import { PointMarkerUtils } from "./PointMarkerUtils";

interface MapPreferences {
    negativeGradeColoring: NegativeGradeColoring;
}

interface MapData {
    routeTrackPoints: RouteTrackPoint[];
    routePoints: RoutePoint[];
    routeTrackCoordinates: Array<[number, number]>;
    routeTrackGeoJson: GeoJSON.FeatureCollection<GeoJSON.LineString>;
    routeAnalyzer: RouteAnalyzer;
    pointMarkers: mapboxgl.Marker[];
}

export interface OnMapClickEventData {
    x: number;
    y: number;
    lat: Latitude;
    lon: Longitude;
}
export type OnMapClickCallback = (data: OnMapClickEventData) => void;

export interface OnPointMarkerClickEventData {
    routePoint: RoutePoint;
}
export type OnPointMarkerClickCallback = (data: OnPointMarkerClickEventData) => void;

export interface MapboxMapManagerProps {
    onMapClick?: OnMapClickCallback | undefined;
    onPointMarkerClick?: OnPointMarkerClickCallback | undefined;
}

export class MapboxMapManager {
    static readonly routeTrackSourceName = "routeTrack";
    static readonly routeTrackLayerId = "routeTrack";
    static readonly highlightLatLonSourceName = "highlightLatLon";
    static readonly highlightLatLonLayerId = "highlightLatLon";

    protected _hasMapBeenLoaded = false;
    protected _map: mapboxgl.Map | null = null;
    protected _mapContainer: HTMLDivElement | null = null;
    protected _mapPreferences: MapPreferences | null = null;
    protected _mapData: MapData | null = null;
    protected _highlightedLatLon: LatLon | null = null;
    protected _measurementSystem: MeasurementSystem = "metric";
    protected _mapScaleControl: mapboxgl.ScaleControl | null = null;

    get hasMapBeenLoaded(): boolean {
        return this._hasMapBeenLoaded;
    }
    protected set hasMapBeenLoaded(value: boolean) {
        this._hasMapBeenLoaded = value;
    }

    get map(): mapboxgl.Map | null {
        return this._map;
    }
    protected set map(value: mapboxgl.Map | null) {
        this._map = value;
    }

    get mapContainer(): HTMLDivElement | null {
        return this._mapContainer;
    }
    set mapContainer(value: HTMLDivElement | null) {
        this._mapContainer = value;
        if (value === null) {
            this.destroyMap();
        } else {
            this.renderNewMap();
        }
    }

    get mapPreferences(): MapPreferences | null {
        return this._mapPreferences;
    }
    protected set mapPreferences(value: MapPreferences | null) {
        this._mapPreferences = value;
    }

    get mapData(): MapData | null {
        return this._mapData;
    }
    protected set mapData(value: MapData | null) {
        this._mapData = value;
    }

    get highlightedLatLon(): LatLon | null {
        return this._highlightedLatLon;
    }
    protected set highlightedLatLon(value: LatLon | null) {
        this._highlightedLatLon = value;
    }

    get measurementSystem(): MeasurementSystem {
        return this._measurementSystem;
    }
    protected set measurementSystem(value: MeasurementSystem) {
        this._measurementSystem = value;
    }

    protected get mapScaleControl(): mapboxgl.ScaleControl | null {
        return this._mapScaleControl;
    }
    protected set mapScaleControl(value: mapboxgl.ScaleControl | null) {
        this._mapScaleControl = value;
    }

    constructor(protected props: MapboxMapManagerProps) {}

    setMapData(routeAnalyzer: RouteAnalyzer): void {
        const routeTrackPoints = routeAnalyzer.trackPoints;
        const routePoints = routeAnalyzer.points;
        if (this.mapData !== null && this.mapData.routeTrackPoints === routeTrackPoints && this.mapData.routePoints === routePoints) {
            return;
        }

        const routeTrackCoordinates = routeTrackPoints.map((point) => [point.lon, point.lat]) as Array<[number, number]>;
        const routeTrackGeoJson: GeoJSON.FeatureCollection<GeoJSON.LineString> = {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {},
                    geometry: { type: "LineString", coordinates: routeTrackCoordinates },
                },
            ],
        };

        const haveRoutePointsChanged = this.mapData === null || this.mapData.routePoints !== routePoints;

        this.mapData = {
            routeTrackPoints,
            routePoints,
            routeTrackCoordinates,
            routeTrackGeoJson,
            routeAnalyzer,
            pointMarkers: this.mapData?.pointMarkers ?? [],
        };

        this.updateRouteTrackIfAllLoaded();
        if (haveRoutePointsChanged) {
            this.updatePointMarkers();
        }
    }

    setRoutePoints(routePoints: RoutePoint[]): void {
        if (this.mapData === null || this.mapData.routePoints === routePoints) {
            return;
        }

        this.mapData.routePoints = routePoints;
        this.mapData.routeAnalyzer.setPoints(routePoints);
        this.updatePointMarkers();
    }

    setMapPreferences(negativeGradeColoring: NegativeGradeColoring): void {
        if (this.mapPreferences !== null && this.mapPreferences.negativeGradeColoring === negativeGradeColoring) {
            return;
        }

        this.mapPreferences = {
            negativeGradeColoring,
        };

        this.updateRouteTrackIfAllLoaded();
    }

    highlightLatLon(latLon: LatLon | null): void {
        this._highlightedLatLon = latLon;
        if (this.map === null || !this.hasMapBeenLoaded) {
            // Data will be added when the map is loaded
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const routeTrackSource = this.map.getSource(MapboxMapManager.highlightLatLonSourceName) as mapboxgl.GeoJSONSource | undefined;
        if (routeTrackSource === undefined) {
            // Source has not been added yet - data will be added when the source is added
            return;
        }

        routeTrackSource.setData(this.getHighlightedLatLonGeoJsonData());
    }

    setMeasurementSystem(measurementSystem: MeasurementSystem): void {
        if (this._measurementSystem === measurementSystem) {
            return;
        }
        this.measurementSystem = measurementSystem;
        if (this.map === null || this.mapScaleControl === null) {
            // Data will be added when the map is loaded
            return;
        }
        this.map.removeControl(this.mapScaleControl);
        this.mapScaleControl = new mapboxgl.ScaleControl({ unit: this.measurementSystem === "metric" ? "metric" : "imperial" });
        this.map.addControl(this.mapScaleControl);
    }

    goToLatLon(latLon: LatLon, scrollIntoView = true): void {
        if (this.map === null || !this.hasMapBeenLoaded) {
            // This function is expected to be called after the map is loaded, so we don't need to handle this case
            return;
        }
        this.map.flyTo({ center: [latLon.lon, latLon.lat], zoom: 18 });
        if (scrollIntoView) {
            this.mapContainer?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    protected destroyMap(): void {
        if (this.map) {
            this.map.remove();
            this.hasMapBeenLoaded = false;
            this.map = null;
            this.mapScaleControl = null;
        }
    }

    protected renderNewMap(): void {
        assertVarIsSet(this.mapContainer, "mapContainer");

        this.destroyMap();

        const { bounds, paddingX, paddingY } = this.getInitialBounds();
        this.hasMapBeenLoaded = false;
        const map = new mapboxgl.Map({
            container: this.mapContainer,
            style: "mapbox://styles/mapbox/satellite-streets-v12",
            bounds: bounds,
            fitBoundsOptions: {
                padding: {
                    top: paddingY,
                    right: paddingX,
                    bottom: paddingY,
                    left: paddingX,
                },
            },
            performanceMetricsCollection: false,
        });
        this.map = map;
        this.addControls(map);
        this.bindEvents(map);
    }

    protected getInitialBounds(): { bounds: mapboxgl.LngLatBounds; paddingX: number; paddingY: number } {
        assertVarIsSet(this.mapData, "mapData");
        assertVarIsSet(this.mapContainer, "mapContainer");

        const first = this.mapData.routeTrackCoordinates[0];
        const bounds = new mapboxgl.LngLatBounds(first, first);
        for (const coord of this.mapData.routeTrackCoordinates) {
            bounds.extend(coord);
        }
        const minPadding = 50;
        const maxPadding = 200;
        const clientWidth = this.mapContainer.clientWidth;
        const clientHeight = this.mapContainer.clientHeight;
        const paddingX = Math.min(maxPadding, Math.max(minPadding, clientWidth / 10));
        const paddingY = Math.min(maxPadding, Math.max(minPadding, clientHeight / 10));
        return { bounds, paddingX, paddingY };
    }

    protected addControls(map: mapboxgl.Map): void {
        this.mapScaleControl = new mapboxgl.ScaleControl({ unit: this.measurementSystem === "metric" ? "metric" : "imperial" });
        map.addControl(this.mapScaleControl);
        map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));
    }

    protected bindEvents(map: mapboxgl.Map): void {
        map.on("click", this.onMapClick.bind(this));
        map.on("load", this.onMapLoad.bind(this));
    }

    protected onMapClick(event: mapboxgl.MapMouseEvent): void {
        if (event.target !== this.map) {
            return;
        }
        this.props.onMapClick?.({
            x: event.point.x,
            y: event.point.y,
            lat: event.lngLat.lat as Latitude,
            lon: event.lngLat.lng as Longitude,
        });
    }

    protected onMapLoad(event: mapboxgl.MapEventOf<"load">): void {
        if (event.target !== this.map) {
            return;
        }
        this.hasMapBeenLoaded = true;
        this.addData();
    }

    protected addData(): void {
        this.addRouteTrackData();
        this.addHighlightLatLonData();
        this.addPointMarkers();
    }

    protected addRouteTrackData(): void {
        assertVarIsSet(this.map, "map");
        assertVarIsSet(this.mapData, "mapData");
        assertVarIsSet(this.mapPreferences, "mapPreferences");

        /* eslint-disable @typescript-eslint/naming-convention */
        this.map.addSource(MapboxMapManager.routeTrackSourceName, {
            type: "geojson",
            lineMetrics: true,
            data: this.mapData.routeTrackGeoJson,
        });
        this.map.addLayer({
            id: MapboxMapManager.routeTrackLayerId,
            type: "line",
            source: MapboxMapManager.routeTrackSourceName,
            layout: {
                "line-join": "round",
                "line-cap": "round",
            },
            paint: {
                "line-width": 5,
                "line-gradient": [
                    "interpolate",
                    ["linear"],
                    ["line-progress"],
                    ...this.getRouteTrackLineGradientArray(this.mapData.routeAnalyzer, this.mapPreferences.negativeGradeColoring),
                ],
            },
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    protected addHighlightLatLonData(): void {
        assertVarIsSet(this.map, "map");
        /* eslint-disable @typescript-eslint/naming-convention */
        this.map.addSource(MapboxMapManager.highlightLatLonSourceName, {
            type: "geojson",
            data: this.getHighlightedLatLonGeoJsonData(),
        });
        this.map.addLayer({
            id: MapboxMapManager.highlightLatLonLayerId,
            type: "circle",
            source: MapboxMapManager.highlightLatLonSourceName,
            paint: {
                "circle-radius": 10,
                "circle-color": "#ff0000",
            },
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    }

    protected getHighlightedLatLonGeoJsonData(): GeoJSON.Feature<GeoJSON.Point> {
        const latLon = this.highlightedLatLon;
        if (latLon === null) {
            return {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [0, 0],
                },
                properties: {},
            };
        }
        return {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [latLon.lon, latLon.lat],
            },
            properties: {},
        };
    }

    protected getRouteTrackLineGradientArray(routeAnalyzer: RouteAnalyzer, negativeGradeColoring: NegativeGradeColoring): Array<number | string> {
        const gradesWithDistances = routeAnalyzer.getRouteSegments();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const lastSegment = gradesWithDistances[gradesWithDistances.length - 1]!;
        const distance = lastSegment.start + lastSegment.length;
        const arr: Array<number | string> = [];
        for (const gradeWithDistance of gradesWithDistances) {
            const grade = gradeWithDistance.grade;
            const colorStr = GradeColors.getColorForGrade(grade, negativeGradeColoring);
            arr.push(
                gradesWithDistances[gradesWithDistances.length - 1] === gradeWithDistance
                    ? (gradeWithDistance.start + gradeWithDistance.length) / distance
                    : gradeWithDistance.start / distance,
                colorStr,
            );
        }
        return arr;
    }

    protected updatePointMarkers(): void {
        if (this.map === null || !this.hasMapBeenLoaded) {
            // Data will be added when the map is loaded
            return;
        }
        if (this.mapData === null) {
            // Some data is still missing - update will be performed when all data is set
            return;
        }
        this.removePointMarkers();
        this.addPointMarkers();
    }

    protected removePointMarkers(): void {
        if (this.mapData === null) {
            // No markers to remove
            return;
        }

        for (const marker of this.mapData.pointMarkers) {
            marker.remove();
        }
        this.mapData.pointMarkers = [];
    }

    protected addPointMarkers(): void {
        assertVarIsSet(this.map, "map");
        assertVarIsSet(this.mapData, "mapData");
        for (const routePoint of this.mapData.routePoints) {
            const marker = this.createPointMarker(routePoint);
            marker.addTo(this.map);
            this.mapData.pointMarkers.push(marker);
        }
    }

    protected createPointMarker(routePoint: RoutePoint): mapboxgl.Marker {
        const marker = new mapboxgl.Marker({ color: PointMarkerUtils.getPointMarkerColor(routePoint) });
        marker.setLngLat([routePoint.lon, routePoint.lat]);

        const markerElement = marker.getElement();
        markerElement.querySelector("circle")?.remove();
        markerElement.innerHTML += PointMarkerUtils.getPointMarkerIconHtml(routePoint);

        markerElement.addEventListener("click", (event) => {
            event.stopPropagation();
            this.props.onPointMarkerClick?.({
                routePoint,
            });
        });

        return marker;
    }

    protected updateRouteTrackIfAllLoaded(): void {
        if (this.map === null || !this.hasMapBeenLoaded) {
            // Data will be added when the map is loaded
            return;
        }
        if (this.mapData === null || this.mapPreferences === null) {
            // Some data is still missing - update will be performed when all data is set
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const routeTrackSource = this.map.getSource(MapboxMapManager.routeTrackSourceName) as mapboxgl.GeoJSONSource | undefined;
        if (routeTrackSource === undefined) {
            // Source has not been added yet - data will be added when the source is added
            return;
        }

        routeTrackSource.setData(this.mapData.routeTrackGeoJson);
        this.map.setPaintProperty(MapboxMapManager.routeTrackLayerId, "line-gradient", [
            "interpolate",
            ["linear"],
            ["line-progress"],
            ...this.getRouteTrackLineGradientArray(this.mapData.routeAnalyzer, this.mapPreferences.negativeGradeColoring),
        ]);
    }
}
