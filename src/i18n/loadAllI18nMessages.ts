import type { I18nLocale } from "./i18nConfig";
import type commonMessages from "./translations/en.json";

/* eslint-disable @typescript-eslint/consistent-type-imports, @typescript-eslint/no-unsafe-member-access */

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export async function loadAllI18nMessages(locale: I18nLocale) {
    const allMessages = {
        ...((await import(`./translations/${locale}.json`)).default as typeof commonMessages),
        components: {
            createRouteButtonLink: (await import(`../components/createRouteButtonLink/translations/${locale}.json`))
                .default as typeof import("../components/createRouteButtonLink/translations/en.json"),
            gradeLegend: (await import(`../components/gradeLegend/translations/${locale}.json`))
                .default as typeof import("../components/gradeLegend/translations/en.json"),
            measurementSystemSwitch: (await import(`../components/measurementSystemSwitch/translations/${locale}.json`))
                .default as typeof import("../components/measurementSystemSwitch/translations/en.json"),
            noneText: (await import(`../components/noneText/translations/${locale}.json`))
                .default as typeof import("../components/noneText/translations/en.json"),
            routeCharts: (await import(`../components/routeCharts/translations/${locale}.json`))
                .default as typeof import("../components/routeCharts/translations/en.json"),
            routeGpxDownloadButton: (await import(`../components/routeGpxDownloadButton/translations/${locale}.json`))
                .default as typeof import("../components/routeGpxDownloadButton/translations/en.json"),
            routePointsTable: (await import(`../components/routePointsTable/translations/${locale}.json`))
                .default as typeof import("../components/routePointsTable/translations/en.json"),
            routesLimitExceededBanner: (await import(`../components/routesLimitExceededBanner/translations/${locale}.json`))
                .default as typeof import("../components/routesLimitExceededBanner/translations/en.json"),
            routesTable: (await import(`../components/routesTable/translations/${locale}.json`))
                .default as typeof import("../components/routesTable/translations/en.json"),
            routeStats: (await import(`../components/routeStats/translations/${locale}.json`))
                .default as typeof import("../components/routeStats/translations/en.json"),
            shareRoute: (await import(`../components/shareRoute/translations/${locale}.json`))
                .default as typeof import("../components/shareRoute/translations/en.json"),
        },
        features: {
            home: (await import(`../features/home/translations/${locale}.json`)).default as typeof import("../features/home/translations/en.json"),
            myRoutes: (await import(`../features/myRoutes/translations/${locale}.json`)).default as typeof import("../features/myRoutes/translations/en.json"),
            route: {
                create: (await import(`../features/route/create/translations/${locale}.json`))
                    .default as typeof import("../features/route/create/translations/en.json"),
                manage: (await import(`../features/route/manage/translations/${locale}.json`))
                    .default as typeof import("../features/route/manage/translations/en.json"),
                view: (await import(`../features/route/view/translations/${locale}.json`))
                    .default as typeof import("../features/route/view/translations/en.json"),
            },
        },
        modals: {
            deleteRouteConfirmation: (await import(`../modals/deleteRouteConfirmationModal/translations/${locale}.json`))
                .default as typeof import("../modals/deleteRouteConfirmationModal/translations/en.json"),
            deleteRoutePointConfirmation: (await import(`../modals/deleteRoutePointConfirmationModal/translations/${locale}.json`))
                .default as typeof import("../modals/deleteRoutePointConfirmationModal/translations/en.json"),
            editRoutePoint: (await import(`../modals/editRoutePointModal/translations/${locale}.json`))
                .default as typeof import("../modals/editRoutePointModal/translations/en.json"),
            demoModeWarning: (await import(`../modals/demoModeWarningModal/translations/${locale}.json`))
                .default as typeof import("../modals/demoModeWarningModal/translations/en.json"),
            viewRoutePointDetails: (await import(`../modals/viewRoutePointDetailsModal/translations/${locale}.json`))
                .default as typeof import("../modals/viewRoutePointDetailsModal/translations/en.json"),
        },
    };

    return allMessages;
}

export type AllI18nMessages = Awaited<ReturnType<typeof loadAllI18nMessages>>;
