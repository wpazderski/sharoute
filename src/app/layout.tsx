import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { RootAppLayout } from "@/components/rootAppLayout/RootAppLayout";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations();

    return {
        title: t("appTitle"),
        description: t("appDescription"),
    };
}

export interface RootLayoutProps extends React.PropsWithChildren {}

export default function RootLayout(props: RootLayoutProps) {
    return <RootAppLayout>{props.children}</RootAppLayout>;
}
