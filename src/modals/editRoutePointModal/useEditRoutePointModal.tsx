import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import { EditRoutePointModalContent } from "./EditRoutePointModalContent";

export function useEditRoutePointModal(setRoutePoints: Dispatch<SetStateAction<RoutePoint[]>>) {
    const t = useTranslations("modals.editRoutePoint");

    const open = useCallback(
        (routePoint: RoutePoint) => {
            const modalId = `editRoutePoint-${routePoint.id}`;
            const close = () => {
                modals.close(modalId);
            };
            modals.open({
                modalId: modalId,
                title: t("title"),
                // eslint-disable-next-line react/jsx-no-bind
                children: <EditRoutePointModalContent routePoint={routePoint} setRoutePoints={setRoutePoints} close={close} />,
                size: "calc(min(90%, 1200px))",
            });
        },
        [setRoutePoints, t],
    );

    return { open };
}
