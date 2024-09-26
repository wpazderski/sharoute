import { notFound } from "next/navigation";
import { ViewRoute } from "@/features/route/view/ViewRoute";
import { ApiClient } from "@/lib/ApiClient";
import type { RoutePublicId } from "@/lib/db/collections/routes/types";

interface RoutePageProps {
    params: {
        routePublicId: RoutePublicId;
    };
}

export default async function RoutePage(props: RoutePageProps) {
    const { routePublicId } = props.params;

    const route = (await ApiClient.getRouteForViewing(routePublicId))?.route ?? null;
    if (route === null) {
        notFound();
    }

    return <ViewRoute route={route} />;
}
