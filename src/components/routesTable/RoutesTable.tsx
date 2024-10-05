"use client";

import { Box, Loader, LoadingOverlay, Stack, Table, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useState } from "react";
import type { BasicRouteData } from "@/lib/db/collections/routes/types";
import { Env } from "@/utils/Env";
import { headerHeight } from "../rootAppLayout/rootAppLayoutConsts";
import { RoutesLimitExceededBanner } from "../routesLimitExceededBanner/RoutesLimitExceededBanner";
import { RoutesTableRow } from "./RoutesTableRow";

export interface RoutesTableProps {
    routes: BasicRouteData[];
}

export function RoutesTable(props: RoutesTableProps) {
    const t = useTranslations("components.routesTable");
    const [isDeletingRoute, setIsDeletingRoute] = useState(false);
    const [routes, setRoutes] = useState<BasicRouteData[]>(props.routes);

    const numRoutes = routes.length;
    const routesLimit = Env.isDemoMode ? Env.demoModeMaxRoutes : Number.MAX_VALUE;

    return (
        <Box>
            {numRoutes >= routesLimit ? (
                <Box mt="md" mb="xl">
                    <RoutesLimitExceededBanner />
                </Box>
            ) : null}
            <Table stickyHeader stickyHeaderOffset={headerHeight} verticalSpacing="sm" horizontalSpacing="sm" striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>{t("headers.name")}</Table.Th>
                        <Table.Th w={225}>{t("headers.createdAtTimestamp")}</Table.Th>
                        <Table.Th w={225}>{t("headers.updatedAtTimestamp")}</Table.Th>
                        <Table.Th w={175}>{t("headers.actions")}</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {routes.map((route) => (
                        <RoutesTableRow key={route.id} route={route} setIsDeletingRoute={setIsDeletingRoute} setRoutes={setRoutes} />
                    ))}
                </Table.Tbody>
            </Table>
            <LoadingOverlay
                visible={isDeletingRoute}
                overlayProps={{ blur: 3, bg: "rgba(0, 0, 0, 0.5)" }}
                loaderProps={{
                    children: (
                        <Stack align="center" bg="white" w={300} py={50} gap="xl" style={{ borderRadius: 5 }}>
                            <Loader />
                            <Text size="xl">{t("deletingRoute")}</Text>
                        </Stack>
                    ),
                }}
            />
        </Box>
    );
}
