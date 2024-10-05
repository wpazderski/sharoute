import { Box, Center, List, Stack, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { Button } from "@/components/button/Button";
import { Env } from "@/utils/Env";

export interface DemoModeWarningModalContentProps {
    close: () => void;
}

export function DemoModeWarningModalContent(props: DemoModeWarningModalContentProps) {
    const propsClose = props.close;
    const t = useTranslations("modals.demoModeWarning");

    const handleOkClick = useCallback(() => {
        propsClose();
    }, [propsClose]);

    return (
        <Stack gap="md" p="md">
            <Text>{t("intro")}</Text>
            <List ml="md">
                <List.Item>{t("list.item-1", { maxRoutesCount: Env.demoModeMaxRoutes })}</List.Item>
                <List.Item>{t("list.item-2")}</List.Item>
            </List>
            <Text>{t("outro")}</Text>
            <Box ml="md">
                <Button type="linkExternal" shouldOpenInNewTab href="https://github.com/wpazderski/sharoute">
                    https://github.com/wpazderski/sharoute
                </Button>
            </Box>
            <Center mt="lg">
                <Button type="button" preset="close" size="sm" onClick={handleOkClick} />
            </Center>
        </Stack>
    );
}
