"use client";

import { Box, Center, Grid, ScrollArea, Stack } from "@mantine/core";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback } from "react";
import { Button } from "@/components/button/Button";
import { HtmlContent } from "@/components/HtmlContent";
import { PropView } from "@/components/PropView";
import { useDistanceFormatter } from "@/hooks/useDistanceFormatter";
import { useLatLonFormatter } from "@/hooks/useLatLonFormatter";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { I18nNumberFormatName } from "@/i18n/formats/i18nNumberFormats";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import { MeasurementSystemsConverter } from "@/utils/MeasurementSystemsConverter";

export interface ViewRoutePointDetailsModalContentProps {
    routePoint: RoutePoint;
    close: () => void;
}

export function ViewRoutePointDetailsModalContent(props: ViewRoutePointDetailsModalContentProps) {
    const propsClose = props.close;
    const t = useTranslations("modals.viewRoutePointDetails");
    const tRoutePointTypes = useTranslations("routePointTypes");
    const { number: numberFormatter } = useFormatter();
    const { userPreferences } = useUserPreferences();
    const isMetricSystem = userPreferences.measurementSystem === "metric";
    const { formatDistance } = useDistanceFormatter();
    const { formatLatLon } = useLatLonFormatter();
    const elevation = isMetricSystem ? props.routePoint.ele : MeasurementSystemsConverter.convertMetersToFeet(props.routePoint.ele);

    const distanceFormatted = formatDistance(props.routePoint.distanceFromRouteStartMeters);
    const latLonFormatted = formatLatLon({ lat: props.routePoint.lat, lon: props.routePoint.lon });
    const elevationFormatted = numberFormatter(elevation, isMetricSystem ? I18nNumberFormatName.MetersRough : I18nNumberFormatName.FeetRough);

    const handleOkClick = useCallback(() => {
        propsClose();
    }, [propsClose]);

    return (
        <Stack gap="md" p="md">
            <Grid>
                <Grid.Col span={6}>
                    <PropView label={t("props.type")}>{tRoutePointTypes(props.routePoint.type)}</PropView>
                </Grid.Col>
                <Grid.Col span={6}>
                    <PropView label={t("props.coordinates")} copyValue={latLonFormatted}>
                        {latLonFormatted}
                    </PropView>
                </Grid.Col>
                <Grid.Col span={6}>
                    <PropView label={t("props.distanceFromRouteStart")} copyValue={distanceFormatted}>
                        {distanceFormatted}
                    </PropView>
                </Grid.Col>
                <Grid.Col span={6}>
                    <PropView label={t("props.elevation")} copyValue={elevationFormatted}>
                        {elevationFormatted}
                    </PropView>
                </Grid.Col>
            </Grid>
            {props.routePoint.description.trim().length > 0 ? (
                <PropView label={t("props.description")}>
                    <ScrollArea.Autosize mah={400} type="auto">
                        <Box pr={30}>
                            <HtmlContent html={props.routePoint.description} />
                        </Box>
                    </ScrollArea.Autosize>
                </PropView>
            ) : null}
            <Center mt="lg">
                <Button type="button" preset="close" size="sm" onClick={handleOkClick} />
            </Center>
        </Stack>
    );
}
