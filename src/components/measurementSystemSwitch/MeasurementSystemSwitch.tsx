import { type ComboboxData, Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { type MeasurementSystem, measurementSystemOptions } from "@/contexts/UserPreferencesContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";

export function MeasurementSystemSwitch() {
    const { userPreferences, setUserPreferences } = useUserPreferences();
    const t = useTranslations("components.measurementSystemSwitch");

    const measurementSystemSelectOptions: ComboboxData = useMemo(() => {
        return measurementSystemOptions.map((value) => ({
            value,
            label: t(`options.${value}`),
        }));
    }, [t]);

    const handleMeasurementSystemChange = useCallback(
        (value: string | null) => {
            if (value === null) {
                return;
            }
            setUserPreferences({ ...userPreferences, measurementSystem: value as MeasurementSystem });
        },
        [userPreferences, setUserPreferences],
    );

    return (
        <Select
            label={t("label")}
            value={userPreferences.measurementSystem}
            onChange={handleMeasurementSystemChange}
            data={measurementSystemSelectOptions}
            comboboxProps={{ offset: 0 }}
            labelProps={{ c: "gray.7" }}
            size="xs"
        />
    );
}
