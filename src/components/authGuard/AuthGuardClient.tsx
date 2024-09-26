"use client";

import { Center, Loader } from "@mantine/core";
import { signIn, useSession } from "next-auth/react";

export interface AuthGuardClientProps extends React.PropsWithChildren {
    unauthenticatedAction: "signIn" | "renderNothing";
}

export function AuthGuardClient(props: AuthGuardClientProps) {
    const session = useSession();

    if (session.status === "loading") {
        return (
            <Center py="xl">
                <Loader />
            </Center>
        );
    }
    if (session.status === "unauthenticated") {
        if (props.unauthenticatedAction === "signIn" && typeof window !== "undefined") {
            void signIn();
        }
        return null;
    }

    return <>{props.children}</>;
}
