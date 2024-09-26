"use client";

import { AppShell, Box, Burger, Center, Group, Loader, NavLink, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { appRoutes } from "@/app/appRoutes";
import { AppLogo } from "@/components/AppLogo";
import { Icon } from "@/components/Icon";
import { Button } from "../button/Button";
import { CreateRouteButtonLink } from "../createRouteButtonLink/CreateRouteButtonLink";
import { headerHeight, sidebarWidth } from "./rootAppLayoutConsts";

export interface RootAppLayoutClientProps extends React.PropsWithChildren {}

export function RootAppLayoutClient(props: RootAppLayoutClientProps) {
    const session = useSession();
    const [isBurgerNavOpen, { toggle: setIsBurgerNavOpen }] = useDisclosure();
    const t = useTranslations();
    const userEmail = session.data?.user?.email ?? null;

    const handleSignInClick = useCallback(() => {
        void signIn();
    }, []);
    const handleSignOutClick = useCallback(() => {
        void signOut({ redirectTo: appRoutes.home() });
    }, []);

    return (
        <AppShell header={{ height: headerHeight }} navbar={{ width: sidebarWidth, breakpoint: "sm", collapsed: { mobile: !isBurgerNavOpen } }} padding="md">
            <AppShell.Header withBorder={false} bg="gray.3">
                <Group h="100%" px="md" justify="space-between">
                    <Burger opened={isBurgerNavOpen} onClick={setIsBurgerNavOpen} hiddenFrom="sm" size="sm" />
                    <AppLogo type="imageWithText" href={appRoutes.home()} />
                </Group>
            </AppShell.Header>
            <AppShell.Navbar withBorder={false} bg="gray.1">
                <AppShell.Section grow my="md" component={ScrollArea}>
                    <NavLink label={t("mainNav.home")} leftSection={<Icon name="home" size={"md"} />} href={appRoutes.home()} component={Link} />
                    {session.status === "authenticated" ? (
                        <NavLink label={t("mainNav.myRoutes")} leftSection={<Icon name="routes" size={"md"} />} href={appRoutes.myRoutes()} component={Link} />
                    ) : null}
                    <Stack gap="md" align="stretch" px="md" mt="md">
                        {session.status === "authenticated" ? (
                            <Stack gap={50} align="stretch">
                                <CreateRouteButtonLink size="sm" />
                            </Stack>
                        ) : null}
                        {session.status === "loading" ? (
                            <Center>
                                <Loader size="md" />
                            </Center>
                        ) : null}
                    </Stack>
                </AppShell.Section>
                <AppShell.Section>
                    <Stack gap="md" align="stretch" p="md" pb="xl">
                        {session.status === "authenticated" ? (
                            <>
                                <Box>
                                    <Text>{userEmail === null ? "" : t("mainNav.signedInAs")}</Text>
                                    <Text size="sm">{userEmail}</Text>
                                </Box>
                                <Button type="button" preset="signOut" onClick={handleSignOutClick} />
                            </>
                        ) : null}
                        {session.status === "unauthenticated" ? <Button type="button" preset="signIn" onClick={handleSignInClick} /> : null}
                        {session.status === "loading" ? (
                            <Center>
                                <Loader size="md" />
                            </Center>
                        ) : null}
                    </Stack>
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main display="flex" style={{ flexDirection: "column" }}>
                <Box py={20}>{props.children}</Box>
            </AppShell.Main>
        </AppShell>
    );
}
