/* eslint-disable prefer-arrow-callback */

import { Box, Group } from "@mantine/core";
import { memo } from "react";
import type { NegativeGradeColoring } from "@/contexts/UserPreferencesContext";
import { GradeColors } from "@/lib/route/GradeColors";
import type { GradeFrac } from "@/units";

export interface GradeLegendItemProps {
    grade: GradeFrac;
    negativeGradeColoring: NegativeGradeColoring;
}

export const GradeLegendItem = memo(function GradeLegendItem(props: GradeLegendItemProps) {
    const colorStr = GradeColors.getColorForGrade(props.grade, props.negativeGradeColoring);
    const gradeDisplayString = getGradeDisplayString(props.grade);

    if (gradeDisplayString === "") {
        return <GradeLegendItemColorDisplay color={colorStr} />;
    }

    return (
        <Group gap="xs">
            <GradeLegendItemColorDisplay color={colorStr} />
            <Box lh={0} fz={12} ff="monospace" style={{ whiteSpace: "pre" }} c="gray.7">
                {gradeDisplayString}
            </Box>
        </Group>
    );
});

interface GradeLegendItemColorDisplayProps {
    color: string;
}

const GradeLegendItemColorDisplay = memo(function GradeLegendItemColorDisplay(props: GradeLegendItemColorDisplayProps) {
    return <Box h={3} bg={props.color} w={40} />;
});

function getGradeDisplayString(grade: GradeFrac): string {
    const str = (Math.round(grade * 1000) / 1000).toFixed(3);
    if (str.endsWith("00") || str.endsWith("50")) {
        return `${grade >= 0 ? " " : ""}${(Math.round(grade * 100) / 100).toFixed(2)}%`;
    }
    return "";
}
