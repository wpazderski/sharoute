import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { RoutePoint } from "@/lib/db/collections/routes/types";
import { ViewRoutePointDetailsModalContent } from "./ViewRoutePointDetailsModalContent";

export function useViewRoutePointDetailsModal() {
    const t = useTranslations("modals.viewRoutePointDetails");

    const open = useCallback(
        (routePoint: RoutePoint) => {
            modals.open({
                title: routePoint.name.trim().length > 0 ? t("title.named", { name: routePoint.name }) : t("title.unnamed"),
                children: <ViewRoutePointDetailsModalContent routePoint={routePoint} />,
                size: "calc(min(90%, 1200px))",
            });
        },
        [t],
    );

    return { open };
}
