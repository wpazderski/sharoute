import type { RoutePublicId } from "@/lib/db/collections/routes/types";
import { Env } from "@/utils/Env";

/* eslint-disable @typescript-eslint/naming-convention */
export const appRoutes = {
    _base: () => ``,
    api: {
        _base: () => `${appRoutes._base()}/api`,
        route: {
            _base: () => `${appRoutes.api._base()}/route`,
            create: () => `${appRoutes.api.route._base()}/create`,
            delete: () => `${appRoutes.api.route._base()}/delete`,
            getForManagement: (params: { routePublicId: RoutePublicId }) => `${appRoutes.api.route._base()}/getForManagement${getUrlSearchSuffix(params)}`,
            getForViewing: (params: { routePublicId: RoutePublicId }) => `${appRoutes.api.route._base()}/getForViewing${getUrlSearchSuffix(params)}`,
            update: () => `${appRoutes.api.route._base()}/update`,
        },
    },
    home: () => `${appRoutes._base()}/`,
    route: {
        _base: () => `${appRoutes._base()}/route`,
        create: () => `${appRoutes.route._base()}/create`,
        manage: (params: { routePublicId: RoutePublicId }) => `${appRoutes.route._base()}/${params.routePublicId}/manage`,
        view: (params: { routePublicId: RoutePublicId }) => `${appRoutes.route._base()}/${params.routePublicId}`,
    },
    myRoutes: () => `${appRoutes._base()}/myRoutes`,
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

function getUrlSearchSuffix(params?: Record<string, string | number | boolean | undefined>): string {
    const newParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params ?? {})) {
        if (value !== undefined) {
            newParams[key] = value.toString();
        }
    }
    if (Object.keys(newParams).length === 0) {
        return "";
    }
    return `?${new URLSearchParams(newParams).toString()}`;
}

export function convertAppRoutePathToFullUrl(path: string): string {
    return `${Env.appOrigin}${Env.basePath}${path}`.replace(/\/+/gu, "/").replace(/http(?<s>s?):\//u, "http$1://");
}
