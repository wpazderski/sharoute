"use client";

import { Tooltip } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import type { PublicRoute } from "@/lib/db/collections/routes/types";
import { GpxFileGenerator } from "@/lib/gpxFile/GpxFileGenerator";
import { Button } from "../button/Button";

export interface RouteGpxDownloadButtonProps {
    route: PublicRoute;
}

export function RouteGpxDownloadButton(props: RouteGpxDownloadButtonProps) {
    const t = useTranslations("components.routeGpxDownloadButton");

    const handleClick = useCallback(() => {
        GpxFileGenerator.downloadGpxFile(props.route, t("defaultRouteName"));
    }, [props.route, t]);

    return (
        <Tooltip label={t("tooltip")}>
            <span>
                <Button type="button" icon="download" priority="quaternary" size="sm" onClick={handleClick}>
                    {t("label")}
                </Button>
            </span>
        </Tooltip>
    );
}
