import { notFound } from "next/navigation";
import { appRoutes } from "@/app/appRoutes";
import { auth, signIn } from "@/auth";
import { ManageRoute } from "@/features/route/manage/ManageRoute";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RouteOwnerId, RoutePublicId } from "@/lib/db/collections/routes/types";

interface RouteManagementPageProps {
    params: {
        routePublicId: RoutePublicId;
    };
}

export default async function RouteManagementPage(props: RouteManagementPageProps) {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        await signIn(undefined, { redirectTo: appRoutes.route.manage({ routePublicId: props.params.routePublicId }) }); // Throws NEXT_REDIRECT
        return;
    }

    const { routePublicId } = props.params;
    const route = await RoutesCollection.getInstance().getRoute(routePublicId);
    if (route === null || route.ownerId !== userId) {
        notFound();
    }

    return <ManageRoute route={route} />;
}
