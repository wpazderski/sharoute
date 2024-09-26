"use client";

import { Box, CopyButton, Group, TextInput, Title } from "@mantine/core";
import { useTranslations } from "next-intl";
// eslint-disable-next-line @typescript-eslint/naming-convention
import QRCode from "react-qr-code";
import { appRoutes, convertAppRoutePathToFullUrl } from "@/app/appRoutes";
import type { RoutePublicId } from "@/lib/db/collections/routes/types";
import { Button } from "../button/Button";

export interface ShareRouteProps {
    routePublicId: RoutePublicId;
    noHeader?: boolean | undefined;
    centeredQrCode?: boolean | undefined;
}

export function ShareRoute(props: ShareRouteProps) {
    const t = useTranslations("components.shareRoute");
    const routeUrl = convertAppRoutePathToFullUrl(appRoutes.route.view({ routePublicId: props.routePublicId }));

    return (
        <Box>
            {props.noHeader === true ? null : <Title order={3}>{t("header")}</Title>}
            <Group gap="xs" mt="lg">
                <CopyButton value={routeUrl}>
                    {({ copied, copy }) => (
                        <Button type="button" onClick={copy} icon={copied ? "check" : "copy"} width={150}>
                            {copied ? t("copied") : t("copy")}
                        </Button>
                    )}
                </CopyButton>
                <TextInput readOnly value={routeUrl} maw={600} style={{ flex: "1 1 auto" }} />
            </Group>
            <Box bg="white" p={40} style={{ display: "flex", justifyContent: props.centeredQrCode === true ? "center" : "flex-start" }}>
                <QRCode value={routeUrl} size={256} />
            </Box>
        </Box>
    );
}
