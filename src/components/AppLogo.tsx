"use client";

import { Group, Title } from "@mantine/core";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AppIcon } from "./AppIcon";
import styles from "./AppLogo.module.scss";

export interface AppLogoProps {
    type?: "image" | "imageWithText" | undefined;
    height?: number | undefined;
    href?: string | undefined;
}

export function AppLogo(props: AppLogoProps) {
    const type = props.type ?? "image";
    const height = props.height ?? 40;
    const t = useTranslations();

    if (type === "image") {
        return (
            <AppLogoWrapper href={props.href}>
                <AppLogoImage height={height} />
            </AppLogoWrapper>
        );
    }
    return (
        <AppLogoWrapper href={props.href}>
            <Group gap={Math.round(height * 0.3)}>
                <AppLogoImage height={height} />
                <Title order={1} c="primary" fw={400} size={Math.round(height * 0.5)} style={{ textTransform: "uppercase" }}>
                    {t("appLogoText")}
                </Title>
            </Group>
        </AppLogoWrapper>
    );
}

interface AppLogoImageProps {
    height: number;
}

function AppLogoImage(props: AppLogoImageProps) {
    return <AppIcon height={props.height} />;
}

interface AppLogoWrapperProps extends React.PropsWithChildren {
    href?: string | undefined;
}

export function AppLogoWrapper(props: AppLogoWrapperProps) {
    if (typeof props.href === "undefined" || props.href.length === 0) {
        return <span className={styles["wrapper"]}>{props.children}</span>;
    }
    return (
        <Link className={`${styles["wrapper"]} ${styles["link"]}`} href={props.href}>
            {props.children}
        </Link>
    );
}
