import { Box, Group, Modal } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Button } from "@/components/button/Button";
import { ShareRoute } from "@/components/shareRoute/ShareRoute";
import type { Route } from "@/lib/db/collections/routes/types";

export interface ManageRouteHeaderProps {
    route: Route;
}

export function ManageRouteHeader(props: ManageRouteHeaderProps) {
    const t = useTranslations("features.route.manage");
    const [isShareModalOpened, setIsShareModalOpened] = useState(false);
    const handleShareClick = useCallback(() => {
        setIsShareModalOpened(true);
    }, []);
    const handleShareModalClose = useCallback(() => {
        setIsShareModalOpened(false);
    }, []);

    return (
        <Group gap="lg" align="center">
            {t("title")}
            <Button type="button" icon="share" size="md" onClick={handleShareClick} color="primary">
                {t("shareButton.label")}
            </Button>
            <Modal opened={isShareModalOpened} onClose={handleShareModalClose} size="lg" title={t("shareModal.title")}>
                <Box px="xl" py="md">
                    <ShareRoute routePublicId={props.route.publicId} centeredQrCode noHeader />
                </Box>
            </Modal>
        </Group>
    );
}
