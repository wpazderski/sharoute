import { revalidatePath } from "next/cache";
import type { RoutePublicId } from "@/lib/db/collections/routes/types";
import { appRoutes } from "./appRoutes";

export class AppRoutesRevalidator {
    static onRouteChange(routePublicId: RoutePublicId): void {
        revalidatePath(appRoutes.api.route.getForViewing({ routePublicId }));
        revalidatePath(appRoutes.api.route.getForManagement({ routePublicId }));
    }
}
