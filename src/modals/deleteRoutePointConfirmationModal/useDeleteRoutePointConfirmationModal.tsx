import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { useDistanceFormatter } from "@/hooks/useDistanceFormatter";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import { Notifications } from "@/utils/Notifications";

export function useDeleteRoutePointConfirmationModal(routePoint: RoutePoint, setRoutePoints: Dispatch<SetStateAction<RoutePoint[]>>) {
    const tRoot = useTranslations();
    const t = useTranslations("modals.deleteRoutePointConfirmation");

    const { formatDistance } = useDistanceFormatter();

    const open = useCallback(() => {
        const pointName = routePoint.name.trim();
        const distanceFormatted = formatDistance(routePoint.distanceFromRouteStartMeters);
        modals.openConfirmModal({
            title: t("title"),
            children: (
                <Text size="sm">
                    {pointName.length > 0
                        ? t("message.namedPoint", { distance: distanceFormatted, name: pointName })
                        : t("message.unnamedPoint", { distance: distanceFormatted })}
                </Text>
            ),
            labels: { confirm: tRoot("forms.buttons.delete"), cancel: tRoot("forms.buttons.cancel") },
            confirmProps: { color: "error" },
            onConfirm: () => {
                setRoutePoints((prev) => {
                    return prev.filter((point) => point.id !== routePoint.id);
                });
                Notifications.showSuccess({ message: t("successMessage") });
            },
        });
    }, [formatDistance, routePoint, setRoutePoints, t, tRoot]);

    return { open };
}
