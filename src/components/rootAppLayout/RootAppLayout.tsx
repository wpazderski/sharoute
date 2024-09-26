import "@mantine/charts/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import { Open_Sans } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { auth } from "@/auth";
import { UserPreferencesContextProvider } from "@/contexts/UserPreferencesContext";
import { i18nFormats } from "@/i18n/formats/i18nFormats";
import { mantineTheme } from "./mantineTheme";
import { RootAppLayoutClient } from "./RootAppLayoutClient";
import "./global.scss";

const openSans = Open_Sans({ subsets: ["latin", "latin-ext"] });

export interface RootAppLayoutProps extends React.PropsWithChildren {}

export async function RootAppLayout(props: RootAppLayoutProps) {
    const messages = await getMessages();
    const locale = await getLocale();
    const session = await auth();

    return (
        <html lang={locale}>
            {/* eslint-disable-next-line @next/next/no-head-element */}
            <head>
                <ColorSchemeScript />
            </head>
            <body className={openSans.className}>
                <SessionProvider session={session}>
                    <NextIntlClientProvider messages={messages} locale={locale} formats={i18nFormats}>
                        <MantineProvider theme={mantineTheme}>
                            <ModalsProvider>
                                <Notifications />
                                <UserPreferencesContextProvider>
                                    <RootAppLayoutClient>{props.children}</RootAppLayoutClient>
                                </UserPreferencesContextProvider>
                            </ModalsProvider>
                        </MantineProvider>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
