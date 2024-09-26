import { Timeline } from "@mantine/core";
import { useTranslations } from "next-intl";
import { IntroItem } from "./IntroItem";

export function IntroItems() {
    const t = useTranslations("features.home.introItems");

    return (
        <Timeline active={3} bulletSize={40} lineWidth={2}>
            <IntroItem iconName="upload" title={t("upload.title")} description={t("upload.description")} />
            <IntroItem iconName="write" title={t("nameDescription.title")} description={t("nameDescription.description")} />
            <IntroItem iconName="routePoint" title={t("points.title")} description={t("points.description")} />
            <IntroItem iconName="share" title={t("share.title")} description={t("share.description")} />
        </Timeline>
    );
}
