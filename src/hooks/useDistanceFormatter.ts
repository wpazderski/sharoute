"use client";

import { useFormatter } from "next-intl";
import { useCallback } from "react";
import { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";
import type { DistanceMeters } from "@/units";
import { MeasurementSystemsConverter } from "@/utils/MeasurementSystemsConverter";
import { useUserPreferences } from "./useUserPreferences";

interface UseDistanceFormatterReturnValue {
    formatDistance: (distance: DistanceMeters) => string;
}

export function useDistanceFormatter(): UseDistanceFormatterReturnValue {
    const { number: numberFormatter } = useFormatter();
    const { userPreferences } = useUserPreferences();
    const isMetricSystem = userPreferences.measurementSystem === "metric";

    const formatDistance = useCallback(
        (distance: DistanceMeters) => {
            if (isMetricSystem) {
                return numberFormatter(MeasurementSystemsConverter.convertMetersToKilometers(distance), I18nNumberFormatName.KiloMetersVeryPrecise);
            } else {
                return numberFormatter(MeasurementSystemsConverter.convertMetersToMiles(distance), I18nNumberFormatName.MilesVeryPrecise);
            }
        },
        [isMetricSystem, numberFormatter],
    );

    return {
        formatDistance,
    };
}
