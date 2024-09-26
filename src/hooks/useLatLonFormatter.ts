"use client";

import { type NumberFormatOptions, useFormatter } from "next-intl";
import { useCallback } from "react";
import type { LatLon } from "@/units";

interface UseLatLonFormatterReturnValue {
    formatLatLon: (latLon: LatLon) => string;
}

export function useLatLonFormatter(): UseLatLonFormatterReturnValue {
    const { number: numberFormatter } = useFormatter();

    const formatLatLon = useCallback(
        (latLon: LatLon) => {
            const numberFormatOptions: NumberFormatOptions = {
                style: "unit",
                unit: "degree",
                unitDisplay: "narrow",
                minimumFractionDigits: 6,
                maximumFractionDigits: 6,
            };
            const latStr = numberFormatter(latLon.lat, numberFormatOptions);
            const lonStr = numberFormatter(latLon.lon, numberFormatOptions);
            return `${latStr}N ${lonStr}E`;
        },
        [numberFormatter],
    );

    return {
        formatLatLon,
    };
}
