import { auth, signIn } from "@/auth";

export interface AuthGuardServerProps extends React.PropsWithChildren {
    unauthenticatedAction: "signIn" | "renderNothing";
}

export async function AuthGuardServer(props: AuthGuardServerProps) {
    const session = await auth();

    if ((session?.user ?? null) === null) {
        if (props.unauthenticatedAction === "signIn") {
            await signIn();
            return;
        }
        return null;
    }

    return <>{props.children}</>;
}
