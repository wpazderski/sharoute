"use client";

import { Box, Group, ScrollArea, Stack } from "@mantine/core";
import { useCallback, useMemo, useRef } from "react";
import { GradeLegend } from "@/components/gradeLegend/GradeLegend";
import { HtmlContent } from "@/components/HtmlContent";
import { Map } from "@/components/map/Map";
import type { MapboxMapManager, OnPointMarkerClickEventData } from "@/components/map/MapboxMapManager";
import { MeasurementSystemSwitch } from "@/components/measurementSystemSwitch/MeasurementSystemSwitch";
import { PageWrapper } from "@/components/PageWrapper";
import { RouteCharts } from "@/components/routeCharts/RouteCharts";
import { RoutePointsTable } from "@/components/routePointsTable/RoutePointsTable";
import { RouteStats } from "@/components/routeStats/RouteStats";
import type { PublicRoute } from "@/lib/db/collections/routes/types";
import { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import { useViewRoutePointDetailsModal } from "@/modals/viewRoutePointDetailsModal/useViewRoutePointDetailsModal";
import type { LatLon } from "@/units";
import { ViewRouteHeader } from "./ViewRouteHeader";

export interface ViewRouteProps {
    route: PublicRoute;
}

export function ViewRoute(props: ViewRouteProps) {
    const mapboxMapManagerRef = useRef<MapboxMapManager | null>(null);
    const { open: openViewRoutePointDetailsModal } = useViewRoutePointDetailsModal();

    const routeAnalyzer = useMemo(() => {
        // Use savedRoute in this case: trackPoints are constant, points modifications are handled differently
        return new RouteAnalyzer(props.route.trackPoints, props.route.points);
    }, [props.route.trackPoints, props.route.points]);
    const routeAnalyzerRef = useRef(routeAnalyzer);
    routeAnalyzerRef.current = routeAnalyzer;

    const handleHighligtLatLon = useCallback((latLon: LatLon | null) => {
        mapboxMapManagerRef.current?.highlightLatLon(latLon);
    }, []);

    const goToMapLatLon = useCallback((latLon: LatLon) => {
        mapboxMapManagerRef.current?.goToLatLon(latLon);
    }, []);

    const handleMapboxMapManagerChange = useCallback((mapboxMapManager: MapboxMapManager) => {
        mapboxMapManagerRef.current = mapboxMapManager;
    }, []);

    const handlePointMarkerClick = useCallback(
        (data: OnPointMarkerClickEventData) => {
            openViewRoutePointDetailsModal(data.routePoint);
        },
        [openViewRoutePointDetailsModal],
    );

    return (
        <PageWrapper title={<ViewRouteHeader route={props.route} />} size="full">
            <Stack gap="xl" pb={100}>
                {props.route.description.trim().length > 0 ? (
                    <Box my="lg">
                        <ScrollArea.Autosize mah={500} type="auto">
                            <Box px={30}>
                                <HtmlContent html={props.route.description} />
                            </Box>
                        </ScrollArea.Autosize>
                    </Box>
                ) : null}
                <Group align="flex-start" wrap="nowrap" mt="md" mb="md">
                    <Box style={{ flex: "1 1 auto", borderRadius: 5, overflow: "hidden" }} bg="gray.1">
                        <Map
                            routeAnalyzer={routeAnalyzer}
                            onMapboxMapManagerChange={handleMapboxMapManagerChange}
                            onPointMarkerClick={handlePointMarkerClick}
                        />
                        <RouteCharts routeAnalyzer={routeAnalyzer} hasElevation={props.route.hasElevation} onHighlightLatLon={handleHighligtLatLon} />
                    </Box>
                    <Stack gap="xl" bg="gray.1" w={225} p="md" style={{ borderRadius: 5 }}>
                        <MeasurementSystemSwitch />
                        <RouteStats routeAnalyzer={routeAnalyzer} hasElevation={props.route.hasElevation} />
                        {props.route.hasElevation ? <GradeLegend /> : null}
                    </Stack>
                </Group>
                <RoutePointsTable routePoints={props.route.points} goToMapLatLon={goToMapLatLon} />
            </Stack>
        </PageWrapper>
    );
}
