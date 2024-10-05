import { Alert, Box, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { appRoutes } from "@/app/appRoutes";
import { Env } from "@/utils/Env";
import { Button } from "../button/Button";

export interface RoutesLimitExceededBannerProps {
    limit?: number | undefined;
    withGoToMyRoutesButton?: boolean | undefined;
}

export function RoutesLimitExceededBanner(props: RoutesLimitExceededBannerProps) {
    const limit = props.limit ?? Env.demoModeMaxRoutes;
    const t = useTranslations("components.routesLimitExceededBanner");

    return (
        <Alert color="warning" title={t("title")}>
            <Text>{t("message", { maxRoutesCount: limit })}</Text>
            {props.withGoToMyRoutesButton === true ? (
                <Box mt="md">
                    <Button type="link" priority="tertiary" href={appRoutes.myRoutes()} icon="routes">
                        {t("goToMyRoutes")}
                    </Button>
                </Box>
            ) : null}
        </Alert>
    );
}
