import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import { ViewRoutePointDetailsModalContent } from "./ViewRoutePointDetailsModalContent";

export function useViewRoutePointDetailsModal() {
    const t = useTranslations("modals.viewRoutePointDetails");

    const open = useCallback(
        (routePoint: RoutePoint) => {
            const modalId = `editRoutePoint-${routePoint.id}`;
            const close = () => {
                modals.close(modalId);
            };
            modals.open({
                modalId: modalId,
                title: routePoint.name.trim().length > 0 ? t("title.named", { name: routePoint.name }) : t("title.unnamed"),
                // eslint-disable-next-line react/jsx-no-bind
                children: <ViewRoutePointDetailsModalContent routePoint={routePoint} close={close} />,
                size: "calc(min(90%, 1200px))",
            });
        },
        [t],
    );

    return { open };
}
