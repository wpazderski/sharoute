import { getTranslations } from "next-intl/server";
import { PageWrapper } from "@/components/PageWrapper";

export default async function NotFound() {
    const t = await getTranslations("errorPages.notFound");
    return <PageWrapper title={t("title")} />;
}
