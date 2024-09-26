import { LineChart } from "@mantine/charts";
import { Stack, Title } from "@mantine/core";
import { useResizeObserver, useThrottledValue } from "@mantine/hooks";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";
import { GeoComputations } from "@/lib/route/GeoComputations";
import type { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import type { DistanceMeters, LatLon } from "@/units";
import { MeasurementSystemsConverter } from "@/utils/MeasurementSystemsConverter";

export interface ElevationChartProps {
    routeAnalyzer: RouteAnalyzer;
    chartsSyncId: string;
    onHighlightLatLon?: ((latLon: LatLon | null) => void) | undefined;
}

export function ElevationChart(props: ElevationChartProps) {
    const t = useTranslations("components.routeCharts.elevationChart");
    const [resizeObserverRef, rectUnthrottled] = useResizeObserver();
    const rect = useThrottledValue(rectUnthrottled, 500);
    const { userPreferences } = useUserPreferences();
    const isMetricSystem = userPreferences.measurementSystem === "metric";
    const { number: numberFormatter } = useFormatter();

    const { data, minElevation, maxElevation, avgElevation } = useMemo(
        () => computeDataEx(rect.width, props.routeAnalyzer, isMetricSystem),
        [props.routeAnalyzer, rect.width, isMetricSystem],
    );

    const formatElevation = useCallback(
        (grade: number) => {
            return numberFormatter(grade, isMetricSystem ? I18nNumberFormatName.MetersRough : I18nNumberFormatName.FeetRough);
        },
        [numberFormatter, isMetricSystem],
    );

    return (
        <Stack gap="md" p="md" ref={resizeObserverRef}>
            <Title order={5} fw="normal">
                {t("header")}
            </Title>
            <LineChart
                h={300}
                data={data}
                series={[{ name: "e", label: t("chart.yAxis.label") }]}
                xAxisLabel={`${t("chart.xAxis.label")} [${isMetricSystem ? "km" : "mi"}]`}
                yAxisLabel={t("chart.yAxis.label")}
                dataKey="d"
                type="default"
                withDots={false}
                strokeWidth={5}
                yAxisProps={{ domain: [minElevation - 0.03, maxElevation + 0.03] }}
                curveType="natural"
                valueFormatter={formatElevation}
                referenceLines={[{ y: avgElevation, label: t("chart.yAxis.avgElevation"), color: "gray.5" }]}
                lineChartProps={{
                    syncId: props.chartsSyncId,
                    onMouseMove: (e) => {
                        if (e.activeTooltipIndex === undefined || props.onHighlightLatLon === undefined) {
                            return;
                        }
                        const entry = data[e.activeTooltipIndex];
                        if (entry === undefined) {
                            return;
                        }
                        props.onHighlightLatLon(entry.latLon);
                    },
                    onMouseLeave: () => {
                        props.onHighlightLatLon?.(null);
                    },
                }}
            />
        </Stack>
    );
}

interface DataEx {
    data: Array<{ d: string; e: number; latLon: LatLon | null }>;
    minElevation: number;
    maxElevation: number;
    avgElevation: number;
}

function computeDataEx(chartWidth: number, routeAnalyzer: RouteAnalyzer, isMetricSystem: boolean): DataEx {
    const numEntries = chartWidth / 8 + 1;
    const segments = routeAnalyzer.getRouteSegments();
    const totalDistance = routeAnalyzer.getTotalDistance();
    const distanceBetweenEntries = totalDistance / (numEntries - 1);
    let segmentIdx = 0;
    const data: DataEx["data"] = [];
    let minElevation = Number.MAX_SAFE_INTEGER;
    let maxElevation = Number.MIN_SAFE_INTEGER;
    for (let entryId = 0; entryId < numEntries; ++entryId) {
        const distance = (entryId * distanceBetweenEntries) as DistanceMeters;
        while ((segments[segmentIdx + 1]?.start ?? Number.MAX_SAFE_INTEGER) < distance) {
            segmentIdx++;
        }
        const segment = segments[segmentIdx] ?? segments[segments.length - 1];
        const elevation = segment === undefined ? (0 as DistanceMeters) : GeoComputations.getElevationWithinSegment(segment, distance);
        const latLon = segment === undefined ? null : GeoComputations.getLatLonWithinSegment(segment, distance);
        const distanceConverted = isMetricSystem
            ? MeasurementSystemsConverter.convertMetersToKilometers(distance)
            : MeasurementSystemsConverter.convertMetersToMiles(distance);
        const elevationConverted = isMetricSystem ? elevation : MeasurementSystemsConverter.convertMetersToFeet(elevation);
        data.push({ d: distanceConverted.toFixed(2), e: elevationConverted, latLon });
        minElevation = Math.min(minElevation, elevation);
        maxElevation = Math.max(maxElevation, elevation);
    }

    const avgElevation =
        segments.reduce((acc, { length, startElevation, deltaElevation }) => {
            const elevation = (startElevation + deltaElevation / 2) * length;
            return acc + elevation;
        }, 0) / totalDistance;

    const minElevationConverted = isMetricSystem ? minElevation : MeasurementSystemsConverter.convertMetersToFeet(minElevation as DistanceMeters);
    const maxElevationConverted = isMetricSystem ? maxElevation : MeasurementSystemsConverter.convertMetersToFeet(maxElevation as DistanceMeters);
    const avgElevationConverted = isMetricSystem ? avgElevation : MeasurementSystemsConverter.convertMetersToFeet(avgElevation as DistanceMeters);

    return { data, minElevation: minElevationConverted, maxElevation: maxElevationConverted, avgElevation: avgElevationConverted };
}
