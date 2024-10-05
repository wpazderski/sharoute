import { appRoutes } from "@/app/appRoutes";
import { auth, signIn } from "@/auth";
import { CreateRoute } from "@/features/route/create/CreateRoute";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RouteOwnerId } from "@/lib/db/collections/routes/types";

export default async function CreateRoutePage() {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        await signIn(undefined, { redirectTo: appRoutes.myRoutes() }); // Throws NEXT_REDIRECT
        return;
    }

    const numberOfOwnRoutes = await RoutesCollection.getInstance().countRoutesByOwnerId(userId);
    return <CreateRoute numberOfOwnRoutes={numberOfOwnRoutes} />;
}
