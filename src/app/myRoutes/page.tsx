import { auth, signIn } from "@/auth";
import { MyRoutes } from "@/features/myRoutes/MyRoutes";
import { getUserId } from "@/getUserId";
import { RoutesCollection } from "@/lib/db/collections/routes/RoutesCollection";
import type { RouteOwnerId } from "@/lib/db/collections/routes/types";
import { appRoutes } from "../appRoutes";

export default async function MyRoutesPage() {
    const session = await auth();
    const userId = (session?.provider && session.providerAccountId ? getUserId(session.provider, session.providerAccountId) : null) as RouteOwnerId | null;
    if (userId === null) {
        await signIn(undefined, { redirectTo: appRoutes.myRoutes() }); // Throws NEXT_REDIRECT
        return;
    }

    const routes = await RoutesCollection.getInstance().getBasicRoutesDataByOwnerId(userId);

    return <MyRoutes routes={routes} />;
}
