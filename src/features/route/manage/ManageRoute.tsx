"use client";

import { Box, Group, Loader, LoadingOverlay, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthGuardClient } from "@/components/authGuard/AuthGuardClient";
import { GradeLegend } from "@/components/gradeLegend/GradeLegend";
import { Map } from "@/components/map/Map";
import type { MapboxMapManager, OnMapClickEventData, OnPointMarkerClickEventData } from "@/components/map/MapboxMapManager";
import { MeasurementSystemSwitch } from "@/components/measurementSystemSwitch/MeasurementSystemSwitch";
import { PageWrapper } from "@/components/PageWrapper";
import { RouteCharts } from "@/components/routeCharts/RouteCharts";
import { RouteStats } from "@/components/routeStats/RouteStats";
import { useProcessing } from "@/hooks/useProcessing";
import type {
    Route,
    RoutePoint,
    RoutePointDescription,
    RoutePointDistanceFromRouteStartMeters,
    RoutePointElevationMeters,
    RoutePointId,
    RoutePointLatitude,
    RoutePointLongitude,
    RoutePointName,
} from "@/lib/db/collections/routes/types";
import { GeoComputations } from "@/lib/route/GeoComputations";
import { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import { useViewRoutePointDetailsModal } from "@/modals/viewRoutePointDetailsModal/useViewRoutePointDetailsModal";
import type { LatLon } from "@/units";
import { Notifications } from "@/utils/Notifications";
import { ManageRouteHeader } from "./ManageRouteHeader";
import { RoutePropsForm } from "./RoutePropsForm";

export interface ManageRouteProps {
    route: Route;
}

export function ManageRoute(props: ManageRouteProps) {
    return (
        <AuthGuardClient unauthenticatedAction="signIn">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <ManageRouteCore {...props} />
        </AuthGuardClient>
    );
}

function ManageRouteCore(props: ManageRouteProps) {
    const [savedRoute, setSavedRoute] = useState<Route>(props.route);
    const [unsavedRoute, setUnsavedRoute] = useState<Route>(props.route);
    const t = useTranslations("features.route.manage");
    const { isProcessing: isSaving, withProcessing } = useProcessing<Route>();
    const mapboxMapManagerRef = useRef<MapboxMapManager | null>(null);
    const { open: openViewRoutePointDetailsModal } = useViewRoutePointDetailsModal();

    const routeAnalyzer = useMemo(() => {
        // Use savedRoute in this case: trackPoints are constant, points modifications are handled differently
        return new RouteAnalyzer(savedRoute.trackPoints, savedRoute.points);
    }, [savedRoute.trackPoints, savedRoute.points]);
    const routeAnalyzerRef = useRef(routeAnalyzer);
    routeAnalyzerRef.current = routeAnalyzer;

    const handleHighligtLatLon = useCallback((latLon: LatLon | null) => {
        mapboxMapManagerRef.current?.highlightLatLon(latLon);
    }, []);

    const handleMapboxMapManagerChange = useCallback((mapboxMapManager: MapboxMapManager) => {
        mapboxMapManagerRef.current = mapboxMapManager;
    }, []);

    const handleMapClick = useCallback(
        (data: OnMapClickEventData) => {
            const closestPointsOnRoute = routeAnalyzerRef.current.getClosestPointsOnRoute({ lat: data.lat, lon: data.lon });

            // Pick the first point - in the future, we can show a modal to choose one (probably with a map and preliminary markers)
            const closestPointOnRoute = closestPointsOnRoute[0];
            if (closestPointOnRoute === undefined) {
                Notifications.showError({ message: t("errors.noClosestPoint") });
                return;
            }
            const elevation = GeoComputations.getElevationWithinSegment(
                closestPointOnRoute.segment,
                closestPointOnRoute.distanceFromRouteStart,
            ) as RoutePointElevationMeters;

            const newRoutePoint: RoutePoint = {
                id: crypto.randomUUID() as RoutePointId,
                type: "other",
                name: "" as RoutePointName,
                description: "" as RoutePointDescription,
                photoIds: [],
                distanceFromRouteStartMeters: closestPointOnRoute.distanceFromRouteStart as RoutePointDistanceFromRouteStartMeters,
                lat: closestPointOnRoute.latLon.lat as RoutePointLatitude,
                lon: closestPointOnRoute.latLon.lon as RoutePointLongitude,
                ele: elevation,
            };
            setUnsavedRoute((prev) => {
                return {
                    ...prev,
                    points: [...prev.points, newRoutePoint].sort((a, b) => a.distanceFromRouteStartMeters - b.distanceFromRouteStartMeters),
                };
            });
        },
        [t],
    );

    const handlePointMarkerClick = useCallback(
        (data: OnPointMarkerClickEventData) => {
            openViewRoutePointDetailsModal(data.routePoint);
        },
        [openViewRoutePointDetailsModal],
    );

    const goToMapLatLon = useCallback((latLon: LatLon) => {
        mapboxMapManagerRef.current?.goToLatLon(latLon);
    }, []);

    useEffect(() => {
        mapboxMapManagerRef.current?.setRoutePoints(unsavedRoute.points);
    }, [unsavedRoute.points]);

    return (
        <PageWrapper title={<ManageRouteHeader route={savedRoute} />} size="full">
            <Stack gap="xl" pb={100}>
                <RoutePropsForm
                    savedRoute={savedRoute}
                    setSavedRoute={setSavedRoute}
                    unsavedRoute={unsavedRoute}
                    setUnsavedRoute={setUnsavedRoute}
                    withProcessing={withProcessing}
                    goToMapLatLon={goToMapLatLon}
                />
                <Group align="flex-start" wrap="nowrap" mt="md" mb="md">
                    <Box style={{ flex: "1 1 auto", borderRadius: 5, overflow: "hidden" }} bg="gray.1">
                        <Map
                            routeAnalyzer={routeAnalyzer}
                            onMapboxMapManagerChange={handleMapboxMapManagerChange}
                            onMapClick={handleMapClick}
                            onPointMarkerClick={handlePointMarkerClick}
                        />
                        <RouteCharts routeAnalyzer={routeAnalyzer} hasElevation={unsavedRoute.hasElevation} onHighlightLatLon={handleHighligtLatLon} />
                    </Box>
                    <Stack gap="xl" bg="gray.1" w={225} p="md" style={{ borderRadius: 5 }}>
                        <MeasurementSystemSwitch />
                        <RouteStats routeAnalyzer={routeAnalyzer} hasElevation={unsavedRoute.hasElevation} />
                        {unsavedRoute.hasElevation ? <GradeLegend /> : null}
                    </Stack>
                </Group>
            </Stack>
            <LoadingOverlay
                visible={isSaving}
                overlayProps={{ blur: 3, bg: "rgba(0, 0, 0, 0.5)" }}
                loaderProps={{
                    children: (
                        <Stack align="center" bg="white" w={300} py={50} gap="xl" style={{ borderRadius: 5 }}>
                            <Loader />
                            <Text size="xl">{t("saving")}</Text>
                        </Stack>
                    ),
                }}
            />
        </PageWrapper>
    );
}
