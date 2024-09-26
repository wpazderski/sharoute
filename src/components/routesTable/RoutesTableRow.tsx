"use client";

import { Group, Table, Tooltip } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { appRoutes } from "@/app/appRoutes";
import { I18nDateTimeFormatName } from "@/i18n/formats/i18nDateTimeFormats";
import { ApiClient } from "@/lib/ApiClient";
import type { BasicRouteData } from "@/lib/db/collections/routes/types";
import { ApiError } from "@/lib/errors/ApiError";
import { useDeleteRouteConfirmationModal } from "@/modals/deleteRouteConfirmationModal/useDeleteRouteConfirmationModal";
import { Notifications } from "@/utils/Notifications";
import { Button } from "../button/Button";
import { NoneText } from "../noneText/NoneText";

export interface RoutesTableRowProps {
    route: BasicRouteData;
    setIsDeletingRoute: Dispatch<SetStateAction<boolean>>;
    setRoutes: Dispatch<SetStateAction<BasicRouteData[]>>;
}

export function RoutesTableRow(props: RoutesTableRowProps) {
    const route = props.route;
    const propsSetRoutes = props.setRoutes;
    const propsSetIsDeletingRoute = props.setIsDeletingRoute;
    const { dateTime: formatDateTime } = useFormatter();
    const tRoot = useTranslations();
    const t = useTranslations("components.routesTable");
    const tApiErrors = useTranslations("apiErrors");
    const { open: openDeleteRouteConfirmationModal } = useDeleteRouteConfirmationModal(route);
    const router = useRouter();

    const handleOpenPublicViewClick = useCallback(() => {
        router.push(appRoutes.route.view({ routePublicId: route.publicId }));
    }, [route.publicId, router]);

    const handleOpenManagementViewClick = useCallback(() => {
        router.push(appRoutes.route.manage({ routePublicId: route.publicId }));
    }, [route.publicId, router]);

    const handleDeleteClick = useCallback(() => {
        void openDeleteRouteConfirmationModal()
            .then(async (result) => {
                propsSetIsDeletingRoute(true);
                if (result.confirmed) {
                    await ApiClient.deleteRoute({ routeId: route.id });
                    propsSetRoutes((prev) => {
                        // eslint-disable-next-line max-nested-callbacks
                        return prev.filter((x) => x.id !== route.id);
                    });
                    Notifications.showSuccess({ message: t("routeDeletedNotificationMessage") });
                }
            })
            .catch((error: unknown) => {
                if (error instanceof ApiError) {
                    Notifications.showError({ message: tApiErrors(error.errorI18nKey) });
                    return;
                }
                Notifications.showError({ message: t("routeDeletionFailureNotificationMessage") });
            })
            .finally(() => {
                propsSetIsDeletingRoute(false);
            });
    }, [openDeleteRouteConfirmationModal, propsSetIsDeletingRoute, route.id, propsSetRoutes, t, tApiErrors]);

    return (
        <Table.Tr key={route.id}>
            <Table.Td>{route.name.trim().length > 0 ? route.name : <NoneText size="sm" />}</Table.Td>
            <Table.Td>{formatDateTime(route.createdAtTimestamp, I18nDateTimeFormatName.DmyHm)}</Table.Td>
            <Table.Td>{formatDateTime(route.updatedAtTimestamp, I18nDateTimeFormatName.DmyHm)}</Table.Td>
            <Table.Td>
                <Group gap="xs" wrap="nowrap">
                    <Tooltip label={t("openPublicView")}>
                        <div>
                            <Button type="button" preset="viewDetails" size="xs" onlyIcon onClick={handleOpenPublicViewClick} />
                        </div>
                    </Tooltip>
                    <Tooltip label={t("openManagementView")}>
                        <div>
                            <Button type="button" preset="edit" size="xs" onlyIcon onClick={handleOpenManagementViewClick} />
                        </div>
                    </Tooltip>
                    <Tooltip label={tRoot("forms.buttons.delete")}>
                        <div>
                            <Button type="button" preset="delete" size="xs" onlyIcon onClick={handleDeleteClick} />
                        </div>
                    </Tooltip>
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}
