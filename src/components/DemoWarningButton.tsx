"use client";

import { Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { useDemoModeWarningModal } from "@/modals/demoModeWarningModal/useDemoModeWarningModal";
import { Env } from "@/utils/Env";
import { Button } from "./button/Button";

export function DemoWarningButton() {
    const t = useTranslations();
    const { open: openDemoModeWarningModal } = useDemoModeWarningModal();
    const handleClick = useCallback(() => {
        openDemoModeWarningModal();
    }, [openDemoModeWarningModal]);

    if (!Env.isDemoMode) {
        return null;
    }

    return (
        <Tooltip label={t("demoModeWarningWithClickToReadMore")}>
            <span>
                <Button
                    type="button"
                    color="warning"
                    priority="quaternary"
                    icon="warningTriangle"
                    onlyIcon
                    style={{ paddingLeft: 8, paddingRight: 8 }}
                    onClick={handleClick}
                />
            </span>
        </Tooltip>
    );
}
