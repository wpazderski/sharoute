"use client";

import { Group, Text } from "@mantine/core";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { appRoutes } from "@/app/appRoutes";
import { AuthGuardClient } from "@/components/authGuard/AuthGuardClient";
import { Icon } from "@/components/Icon";
import { PageWrapper } from "@/components/PageWrapper";
import { ApiClient } from "@/lib/ApiClient";
import { ApiError } from "@/lib/errors/ApiError";
import { InvalidGpxFileError } from "@/lib/gpxFile/errors/InvalidGpxFileError";
import { MultipleTrkElementsError } from "@/lib/gpxFile/errors/MultipleTrkElementsError";
import { MultipleTrkSegElementsError } from "@/lib/gpxFile/errors/MultipleTrkSegElementsError";
import { GpxFileParser } from "@/lib/gpxFile/GpxFileParser";
import { Notifications } from "@/utils/Notifications";

const maxFileSizeMiB = 10;

export function CreateRoute() {
    return (
        <AuthGuardClient unauthenticatedAction="signIn">
            <CreateRouteCore />
        </AuthGuardClient>
    );
}

function CreateRouteCore() {
    const router = useRouter();
    const t = useTranslations("features.route.create");
    const tApiErrors = useTranslations("apiErrors");
    const [isProcessingFile, setIsProcessingFile] = useState(false);

    const handleDrop = useCallback(
        (files: FileWithPath[]) => {
            const file = files[0];
            if (!file || files.length !== 1) {
                Notifications.showError({ message: t("errors.invalidFileCount") });
                return;
            }
            if (!file.name.endsWith(".gpx")) {
                Notifications.showError({ message: t("errors.invalidFileExtension") });
                return;
            }
            if (file.size > maxFileSizeMiB * 1024 * 1024) {
                Notifications.showError({ message: t("errors.fileTooLarge", { maxFileSizeMiB }) });
                return;
            }
            void (async () => {
                setIsProcessingFile(true);
                try {
                    const gpxRoute = await GpxFileParser.parseGpxFile(file);
                    const res = await ApiClient.createRoute({ gpxRoute });
                    router.push(appRoutes.route.manage({ routePublicId: res.route.publicId }));
                } catch (error) {
                    if (error instanceof MultipleTrkElementsError) {
                        Notifications.showError({ message: t("errors.multipleTrkElements") });
                        return;
                    }
                    if (error instanceof MultipleTrkSegElementsError) {
                        Notifications.showError({ message: t("errors.multipleTrkSegElements") });
                        return;
                    }
                    if (error instanceof InvalidGpxFileError) {
                        Notifications.showError({ message: t("errors.fileReadError") });
                        return;
                    }
                    if (error instanceof ApiError) {
                        Notifications.showError({ message: tApiErrors(error.errorI18nKey) });
                        return;
                    }
                    Notifications.showError({ message: t("errors.fileReadError") });
                } finally {
                    setIsProcessingFile(false);
                }
            })();
        },
        [router, t, tApiErrors],
    );

    return (
        <PageWrapper title={t("title")} subTitle={t("description")}>
            <Dropzone onDrop={handleDrop} maxSize={maxFileSizeMiB * 1024 * 1024} maxFiles={1} loading={isProcessingFile}>
                <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                    <Dropzone.Accept>
                        <Icon name="upload" size="xl" />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <Icon name="error" size="xl" />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <Icon name="upload" size="xl" />
                    </Dropzone.Idle>

                    <div>
                        <Text size="xl" inline>
                            {t("dropzone.state.empty.title")}
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            {t("dropzone.state.empty.description", { maxFileSizeMiB })}
                        </Text>
                    </div>
                </Group>
            </Dropzone>
        </PageWrapper>
    );
}
