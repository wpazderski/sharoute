"use client";

import { Accordion, Box, Table, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
import type { Dispatch, SetStateAction } from "react";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import type { LatLon } from "@/units";
import { Icon } from "../Icon";
import { headerHeight } from "../rootAppLayout/rootAppLayoutConsts";
import { RoutePointsTableRow } from "./RoutePointsTableRow";

export interface RoutePointsTableProps {
    routePoints: RoutePoint[];
    setRoutePoints?: Dispatch<SetStateAction<RoutePoint[]>> | undefined;
    goToMapLatLon?: ((latLon: LatLon) => void) | undefined;
}

export function RoutePointsTable(props: RoutePointsTableProps) {
    const t = useTranslations("components.routePointsTable");
    const isEditable = props.setRoutePoints !== undefined;

    return (
        <Box>
            <Title order={4} fw="normal">
                {t("header")}:
            </Title>
            <Table stickyHeader stickyHeaderOffset={headerHeight} verticalSpacing="sm" horizontalSpacing="sm" striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th w={200}>{t("headers.type")}</Table.Th>
                        <Table.Th w={150}>{t("headers.distance")}</Table.Th>
                        <Table.Th>{t("headers.name")}</Table.Th>
                        <Table.Th w={200}>{t("headers.actions")}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {props.routePoints.map((routePoint) => (
                        <RoutePointsTableRow
                            key={routePoint.id}
                            routePoint={routePoint}
                            setRoutePoints={props.setRoutePoints}
                            goToMapLatLon={props.goToMapLatLon}
                        />
                    ))}
                </Table.Tbody>
            </Table>
            {isEditable ? (
                <Box mt="lg">
                    <Accordion bg="gray.1" style={{ borderRadius: 5 }}>
                        <Accordion.Item value="addingRoutePointInstructions" style={{ borderRadius: 5, border: "none" }}>
                            <Accordion.Control
                                icon={
                                    <Text c="blue.7" lh={0}>
                                        <Icon name="infoCircle" />
                                    </Text>
                                }
                                style={{ borderRadius: 5, border: "none" }}
                            >
                                <Text c="blue.7" size="sm" fw="bold">
                                    {t("addingRoutePointInstructions.header")}
                                </Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <ul>
                                    <li>{t("addingRoutePointInstructions.step1")}</li>
                                    <li>{t("addingRoutePointInstructions.step2")}</li>
                                    <li>{t("addingRoutePointInstructions.step3")}</li>
                                </ul>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Box>
            ) : null}
        </Box>
    );
}
