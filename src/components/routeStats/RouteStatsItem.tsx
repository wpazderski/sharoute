import { Stack, Text } from "@mantine/core";
import { useFormatter } from "next-intl";
import type { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";

export interface RouteStatsItemProps {
    label: React.ReactNode;
    value: number;
    format: I18nNumberFormatName;
}

export function RouteStatsItem(props: RouteStatsItemProps) {
    const { number: numberFormatter } = useFormatter();

    return (
        <Stack gap={0}>
            <Text size="sm" c="gray.7">
                {props.label}:
            </Text>
            <Text>{numberFormatter(props.value, props.format)}</Text>
        </Stack>
    );
}
