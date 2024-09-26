"use client";

import { useTranslations } from "next-intl";
import { AuthGuardClient } from "@/components/authGuard/AuthGuardClient";
import { PageWrapper } from "@/components/PageWrapper";
import { RoutesTable } from "@/components/routesTable/RoutesTable";
import type { BasicRouteData } from "@/lib/db/collections/routes/types";

export interface MyRoutesProps {
    routes: BasicRouteData[];
}

export function MyRoutes(props: MyRoutesProps) {
    return (
        <AuthGuardClient unauthenticatedAction="signIn">
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <MyRoutesCore {...props} />
        </AuthGuardClient>
    );
}

function MyRoutesCore(props: MyRoutesProps) {
    const t = useTranslations("features.myRoutes");

    return (
        <PageWrapper title={t("title")} size="xl">
            <RoutesTable routes={props.routes} />
        </PageWrapper>
    );
}
