import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";
import type { RouteHasElevation } from "@/lib/db/collections/routes/types";
import type { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import { MeasurementSystemsConverter } from "@/utils/MeasurementSystemsConverter";
import { RouteStatsItem } from "./RouteStatsItem";

export interface RouteStatsProps {
    routeAnalyzer: RouteAnalyzer;
    hasElevation: RouteHasElevation;
}

export function RouteStats(props: RouteStatsProps) {
    const t = useTranslations("components.routeStats");
    const { userPreferences } = useUserPreferences();
    const isMetricSystem = userPreferences.measurementSystem === "metric";

    const distance = isMetricSystem
        ? MeasurementSystemsConverter.convertMetersToKilometers(props.routeAnalyzer.getTotalDistance())
        : MeasurementSystemsConverter.convertMetersToMiles(props.routeAnalyzer.getTotalDistance());
    const elevationGain = isMetricSystem
        ? props.routeAnalyzer.getElevationGain()
        : MeasurementSystemsConverter.convertMetersToFeet(props.routeAnalyzer.getElevationGain());
    const elevationLoss = isMetricSystem
        ? props.routeAnalyzer.getElevationLoss()
        : MeasurementSystemsConverter.convertMetersToFeet(props.routeAnalyzer.getElevationLoss());
    const elevationMax = isMetricSystem
        ? props.routeAnalyzer.getElevationMax()
        : MeasurementSystemsConverter.convertMetersToFeet(props.routeAnalyzer.getElevationMax());
    const elevationMin = isMetricSystem
        ? props.routeAnalyzer.getElevationMin()
        : MeasurementSystemsConverter.convertMetersToFeet(props.routeAnalyzer.getElevationMin());

    return (
        <Stack gap="md">
            <RouteStatsItem
                label={t("distance")}
                value={distance}
                format={isMetricSystem ? I18nNumberFormatName.KiloMetersPrecise : I18nNumberFormatName.MilesPrecise}
            />
            {props.hasElevation ? (
                <>
                    <RouteStatsItem
                        label={t("elevationGain")}
                        value={elevationGain}
                        format={isMetricSystem ? I18nNumberFormatName.MetersRough : I18nNumberFormatName.FeetRough}
                    />
                    <RouteStatsItem
                        label={t("elevationLoss")}
                        value={elevationLoss}
                        format={isMetricSystem ? I18nNumberFormatName.MetersRough : I18nNumberFormatName.FeetRough}
                    />
                    <RouteStatsItem
                        label={t("elevationMax")}
                        value={elevationMax}
                        format={isMetricSystem ? I18nNumberFormatName.MetersRough : I18nNumberFormatName.FeetRough}
                    />
                    <RouteStatsItem
                        label={t("elevationMin")}
                        value={elevationMin}
                        format={isMetricSystem ? I18nNumberFormatName.MetersRough : I18nNumberFormatName.FeetRough}
                    />
                </>
            ) : null}
        </Stack>
    );
}
