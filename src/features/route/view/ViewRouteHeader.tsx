import { Box, Group, Modal } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { Button } from "@/components/button/Button";
import { ShareRoute } from "@/components/shareRoute/ShareRoute";
import type { PublicRoute } from "@/lib/db/collections/routes/types";

export interface ViewRouteHeaderProps {
    route: PublicRoute;
}

export function ViewRouteHeader(props: ViewRouteHeaderProps) {
    const t = useTranslations("features.route.view");
    const [isShareModalOpened, setIsShareModalOpened] = useState(false);
    const handleShareClick = useCallback(() => {
        setIsShareModalOpened(true);
    }, []);
    const handleShareModalClose = useCallback(() => {
        setIsShareModalOpened(false);
    }, []);

    return (
        <Group gap="lg" align="center">
            {props.route.name.trim().length > 0 ? props.route.name : t("namePlaceholder")}
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
