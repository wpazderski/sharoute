import { Box, Center, type ComboboxData, Select, Stack, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { type NegativeGradeColoring, negativeGradeColoringOptions } from "@/contexts/UserPreferencesContext";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { GradeColors } from "@/lib/route/GradeColors";
import type { GradeFrac } from "@/units";
import { GradeLegendItem } from "./GradeLegendItem";

const grades = getGradesArray();

export function GradeLegend() {
    const { userPreferences, setUserPreferences } = useUserPreferences();
    const t = useTranslations("components.gradeLegend");

    const negativeGradeColoringSelectOptions: ComboboxData = useMemo(() => {
        return negativeGradeColoringOptions.map((value) => ({
            value,
            label: t(`negativeGradeColoringSelect.options.${value}`),
        }));
    }, [t]);

    const handleNegativeGradeColoringChange = useCallback(
        (value: string | null) => {
            if (value === null) {
                return;
            }
            setUserPreferences({ ...userPreferences, negativeGradeColoring: value as NegativeGradeColoring });
        },
        [userPreferences, setUserPreferences],
    );

    return (
        <Stack gap="md">
            <Title order={5} fw="normal">
                {t("header")}
            </Title>
            <Center>
                <Box>
                    {grades.map((grade) => (
                        <GradeLegendItem key={grade} grade={grade} negativeGradeColoring={userPreferences.negativeGradeColoring} />
                    ))}
                </Box>
            </Center>
            <Select
                label={t("negativeGradeColoringSelect.label")}
                value={userPreferences.negativeGradeColoring}
                onChange={handleNegativeGradeColoringChange}
                data={negativeGradeColoringSelectOptions}
                comboboxProps={{ offset: 0 }}
                labelProps={{ c: "gray.7" }}
                size="xs"
            />
        </Stack>
    );
}

function getGradesArray(): GradeFrac[] {
    const res: GradeFrac[] = [];
    const minGrade = -GradeColors.maxAbsGrade;
    const maxGrade = GradeColors.maxAbsGrade;
    const step = 0.005;
    const numSteps = (maxGrade - minGrade) / step;
    for (let stepId = 0; stepId <= numSteps; ++stepId) {
        const grade = (minGrade + stepId * step) as GradeFrac;
        res.push(grade);
    }
    return res.reverse();
}
