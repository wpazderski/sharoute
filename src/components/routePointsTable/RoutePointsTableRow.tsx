"use client";

import { Group, Table, Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { useDistanceFormatter } from "@/hooks/useDistanceFormatter";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import { useDeleteRoutePointConfirmationModal } from "@/modals/deleteRoutePointConfirmationModal/useDeleteRoutePointConfirmationModal";
import { useEditRoutePointModal } from "@/modals/editRoutePointModal/useEditRoutePointModal";
import { useViewRoutePointDetailsModal } from "@/modals/viewRoutePointDetailsModal/useViewRoutePointDetailsModal";
import type { LatLon } from "@/units";
import { Button } from "../button/Button";
import { NoneText } from "../noneText/NoneText";

export interface RoutePointsTableRowProps {
    routePoint: RoutePoint;
    goToMapLatLon?: ((latLon: LatLon) => void) | undefined;
    setRoutePoints?: Dispatch<SetStateAction<RoutePoint[]>> | undefined;
}

export function RoutePointsTableRow(props: RoutePointsTableRowProps) {
    const propsGoToMapLatLon = props.goToMapLatLon;
    const propsSetRoutePoints = props.setRoutePoints;
    const setRoutePointsOrNoOp = propsSetRoutePoints ?? (() => {});
    const routePoint = props.routePoint;
    const tRoot = useTranslations();
    const t = useTranslations("components.routePointsTable");
    const canBeDeleted = props.routePoint.type !== "routeStart" && props.routePoint.type !== "routeEnd";
    const { open: openDeleteRoutePointConfirmationModal } = useDeleteRoutePointConfirmationModal(routePoint, setRoutePointsOrNoOp);
    const { open: openEditRoutePointModal } = useEditRoutePointModal(setRoutePointsOrNoOp);
    const { open: openViewRoutePointDetailsModal } = useViewRoutePointDetailsModal();

    const { formatDistance } = useDistanceFormatter();

    const handleViewRoutePointDetailsClick = useCallback(() => {
        openViewRoutePointDetailsModal(routePoint);
    }, [openViewRoutePointDetailsModal, routePoint]);

    const handleMapGoToPointClick = useCallback(() => {
        propsGoToMapLatLon?.({
            lat: routePoint.lat,
            lon: routePoint.lon,
        });
    }, [propsGoToMapLatLon, routePoint.lat, routePoint.lon]);

    const handleEditRoutePointClick = useCallback(() => {
        openEditRoutePointModal(routePoint);
    }, [openEditRoutePointModal, routePoint]);

    return (
        <Table.Tr key={routePoint.id}>
            <Table.Td>{tRoot(`routePointTypes.${routePoint.type}`)}</Table.Td>
            <Table.Td>{formatDistance(routePoint.distanceFromRouteStartMeters)}</Table.Td>
            <Table.Td>{routePoint.name.trim().length > 0 ? routePoint.name : <NoneText size="sm" />}</Table.Td>
            <Table.Td>
                <Group gap="xs" wrap="nowrap">
                    <Tooltip label={tRoot("forms.buttons.viewDetails")}>
                        <div>
                            <Button type="button" preset="viewDetails" size="xs" onlyIcon onClick={handleViewRoutePointDetailsClick} />
                        </div>
                    </Tooltip>
                    <Tooltip label={tRoot("components.routePointsTable.mapGoToPoint")}>
                        <div>
                            <Button type="button" icon="mapGoToLatLon" size="xs" onlyIcon onClick={handleMapGoToPointClick} />
                        </div>
                    </Tooltip>
                    {props.setRoutePoints === undefined ? null : (
                        <>
                            <Tooltip label={tRoot("forms.buttons.edit")}>
                                <div>
                                    <Button type="button" preset="edit" size="xs" onlyIcon onClick={handleEditRoutePointClick} />
                                </div>
                            </Tooltip>
                            <Tooltip label={canBeDeleted ? tRoot("forms.buttons.delete") : t("deleteButtonDisabledTooltip")}>
                                <div>
                                    <Button
                                        type="button"
                                        preset="delete"
                                        size="xs"
                                        onlyIcon
                                        onClick={openDeleteRoutePointConfirmationModal}
                                        disabled={!canBeDeleted}
                                    />
                                </div>
                            </Tooltip>
                        </>
                    )}
                </Group>
            </Table.Td>
        </Table.Tr>
    );
}
