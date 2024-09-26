import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { BasicRouteData } from "@/lib/db/collections/routes/types";
import { Deferred } from "@/utils/Deferred";

export function useDeleteRouteConfirmationModal(route: BasicRouteData) {
    const tRoot = useTranslations();
    const t = useTranslations("modals.deleteRouteConfirmation");

    const open = useCallback(async () => {
        const pointName = route.name.trim();
        const resultDeferred = new Deferred<{ confirmed: boolean }>();
        modals.openConfirmModal({
            title: t("title"),
            children: <Text size="sm">{pointName.length > 0 ? t("message.namedRoute", { name: pointName }) : t("message.unnamedRoute")}</Text>,
            labels: { confirm: tRoot("forms.buttons.delete"), cancel: tRoot("forms.buttons.cancel") },
            confirmProps: { color: "error" },
            onConfirm: () => {
                resultDeferred.resolve({ confirmed: true });
            },
            onCancel: () => {
                resultDeferred.resolve({ confirmed: false });
            },
        });
        return await resultDeferred.promise;
    }, [route, t, tRoot]);

    return { open };
}
