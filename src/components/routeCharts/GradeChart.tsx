import { LineChart } from "@mantine/charts";
import { Stack, Title } from "@mantine/core";
import { useResizeObserver, useThrottledValue } from "@mantine/hooks";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";
import { GeoComputations } from "@/lib/route/GeoComputations";
import type { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import type { DistanceMeters, GradeFrac, LatLon } from "@/units";
import { MeasurementSystemsConverter } from "@/utils/MeasurementSystemsConverter";

export interface GradeChartProps {
    routeAnalyzer: RouteAnalyzer;
    chartsSyncId: string;
    onHighlightLatLon?: ((latLon: LatLon | null) => void) | undefined;
}

export function GradeChart(props: GradeChartProps) {
    const t = useTranslations("components.routeCharts.gradeChart");
    const [resizeObserverRef, rectUnthrottled] = useResizeObserver();
    const rect = useThrottledValue(rectUnthrottled, 500);
    const { userPreferences } = useUserPreferences();
    const isMetricSystem = userPreferences.measurementSystem === "metric";
    const { number: numberFormatter } = useFormatter();

    const { data, minGrade, maxGrade } = useMemo(
        () => computeDataEx(rect.width, props.routeAnalyzer, isMetricSystem),
        [props.routeAnalyzer, rect.width, isMetricSystem],
    );

    const formatGrade = useCallback(
        (grade: number) => {
            return numberFormatter(grade, I18nNumberFormatName.PercentageSemiPrecise);
        },
        [numberFormatter],
    );

    return (
        <Stack gap="md" p="md" ref={resizeObserverRef}>
            <Title order={5} fw="normal">
                {t("header")}
            </Title>
            <LineChart
                h={300}
                data={data}
                series={[{ name: "g", label: t("chart.yAxis.label") }]}
                xAxisLabel={`${t("chart.xAxis.label")} [${isMetricSystem ? "km" : "mi"}]`}
                yAxisLabel={t("chart.yAxis.label")}
                dataKey="d"
                type="default"
                withDots={false}
                strokeWidth={5}
                yAxisProps={{ domain: [minGrade - 0.03, maxGrade + 0.03] }}
                curveType="natural"
                valueFormatter={formatGrade}
                referenceLines={[{ y: 0, label: "0%", color: "gray.5" }]}
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
    data: Array<{ d: string; g: number; latLon: LatLon | null }>;
    minGrade: number;
    maxGrade: number;
}

function computeDataEx(chartWidth: number, routeAnalyzer: RouteAnalyzer, isMetricSystem: boolean): DataEx {
    const numEntries = chartWidth / 8 + 1;
    const segments = routeAnalyzer.getRouteSegments();
    const totalDistance = routeAnalyzer.getTotalDistance();
    const distanceBetweenEntries = totalDistance / (numEntries - 1);
    let segmentIdx = 0;
    const data: DataEx["data"] = [];
    let minGrade = Number.MAX_SAFE_INTEGER;
    let maxGrade = Number.MIN_SAFE_INTEGER;
    for (let entryId = 0; entryId < numEntries; ++entryId) {
        const distance = (entryId * distanceBetweenEntries) as DistanceMeters;
        while ((segments[segmentIdx + 1]?.start ?? Number.MAX_SAFE_INTEGER) < distance) {
            segmentIdx++;
        }
        const segment = segments[segmentIdx] ?? segments[segments.length - 1];
        const grade = segment?.grade ?? (0 as GradeFrac);
        const latLon = segment === undefined ? null : GeoComputations.getLatLonWithinSegment(segment, distance);
        const distanceConverted = isMetricSystem
            ? MeasurementSystemsConverter.convertMetersToKilometers(distance)
            : MeasurementSystemsConverter.convertMetersToMiles(distance);
        data.push({ d: distanceConverted.toFixed(2), g: grade, latLon });
        minGrade = Math.min(minGrade, grade);
        maxGrade = Math.max(maxGrade, grade);
    }
    return { data, minGrade, maxGrade };
}
