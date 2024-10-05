import { modals } from "@mantine/modals";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { DemoModeWarningModalContent } from "./DemoModeWarningModalContent";

export function useDemoModeWarningModal() {
    const t = useTranslations("modals.demoModeWarning");

    const open = useCallback(() => {
        const modalId = `demoMode-${Math.random().toString(36)}`;
        const close = () => {
            modals.close(modalId);
        };
        modals.open({
            modalId: modalId,
            title: t("title"),
            // eslint-disable-next-line react/jsx-no-bind
            children: <DemoModeWarningModalContent close={close} />,
            size: "calc(min(90%, 1200px))",
        });
    }, [t]);

    return { open };
}
