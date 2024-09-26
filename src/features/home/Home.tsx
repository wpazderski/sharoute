import { Stack } from "@mantine/core";
import { useTranslations } from "next-intl";
import { CreateRouteButtonLink } from "@/components/createRouteButtonLink/CreateRouteButtonLink";
import { PageWrapper } from "@/components/PageWrapper";
import { IntroItems } from "./IntroItems";

export function Home() {
    const t = useTranslations("features.home");

    return (
        <PageWrapper title={t("title")}>
            <Stack p="xl" align="center" gap={50}>
                <IntroItems />
                <CreateRouteButtonLink size="lg" />
            </Stack>
        </PageWrapper>
    );
}
