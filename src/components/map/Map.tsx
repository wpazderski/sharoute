"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useCallback, useMemo, useRef } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import type { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import type { LatLon } from "@/units";
import { Env } from "@/utils/Env";
import { MapboxMapManager, type OnMapClickEventData, type OnPointMarkerClickEventData } from "./MapboxMapManager";

mapboxgl.accessToken = Env.mapboxAccessToken;

export interface MapProps {
    routeAnalyzer: RouteAnalyzer;
    onMapClick?: (data: OnMapClickEventData) => void;
    onPointMarkerClick?: (data: OnPointMarkerClickEventData) => void;
    highlightLatLon?: LatLon | undefined;
    onMapboxMapManagerChange?: (mapboxMapManager: MapboxMapManager) => void;
}

export function Map(props: MapProps) {
    const onMapClickRef = useRef<MapProps["onMapClick"]>();
    const onPointMarkerClickRef = useRef<MapProps["onPointMarkerClick"]>();
    onMapClickRef.current = props.onMapClick;
    onPointMarkerClickRef.current = props.onPointMarkerClick;
    const propsOnMapboxMapManagerChange = props.onMapboxMapManagerChange;
    const mapboxMapManagerRef = useRef<MapboxMapManager | null>(null);
    const mapboxMapManager = useMemo(() => {
        if (mapboxMapManagerRef.current !== null) {
            return mapboxMapManagerRef.current;
        }
        const newMapboxMapManager = new MapboxMapManager({
            onMapClick: (data) => {
                onMapClickRef.current?.(data);
            },
            onPointMarkerClick: (data) => {
                onPointMarkerClickRef.current?.(data);
            },
        });
        mapboxMapManagerRef.current = newMapboxMapManager;
        propsOnMapboxMapManagerChange?.(newMapboxMapManager);
        return newMapboxMapManager;
    }, [propsOnMapboxMapManagerChange]);
    const { userPreferences } = useUserPreferences();

    // These won't re-render if arg object (e.g. props.routeTrackPoints) haven't changed
    mapboxMapManager.setMapData(props.routeAnalyzer);
    mapboxMapManager.setMapPreferences(userPreferences.negativeGradeColoring);
    mapboxMapManager.setMeasurementSystem(userPreferences.measurementSystem);

    const handleMapElementChange = useCallback((element: HTMLDivElement | null) => {
        if (mapboxMapManagerRef.current === null) {
            return;
        }
        mapboxMapManagerRef.current.mapContainer = element;
    }, []);

    return <div ref={handleMapElementChange} style={{ width: "100%", height: 600 }} />;
}
