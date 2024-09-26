import type { RoutePoint } from "@/lib/db/collections/routes/types";

export class PointMarkerUtils {
    static getPointMarkerIconHtml(routePoint: RoutePoint): string {
        let markerSvgHtml = "";
        switch (routePoint.type) {
            case "coffeeStop":
                // @tabler/icons: IconCoffee
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-coffee "><path d="M3 14c.83 .642 2.077 1.017 3.5 1c1.423 .017 2.67 -.358 3.5 -1c.83 -.642 2.077 -1.017 3.5 -1c1.423 -.017 2.67 .358 3.5 1"></path><path d="M8 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path><path d="M12 3a2.4 2.4 0 0 0 -1 2a2.4 2.4 0 0 0 1 2"></path><path d="M3 10h14v5a6 6 0 0 1 -6 6h-2a6 6 0 0 1 -6 -6v-5z"></path><path d="M16.746 16.726a3 3 0 1 0 .252 -5.555"></path></svg>`;
                break;
            case "danger":
                // @tabler/icons: IconAlertTriangleFilled
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="tabler-icon tabler-icon-alert-triangle-filled "><path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z"></path></svg>`;
                break;
            case "foodStop":
                // @tabler/icons: IconToolsKitchen2
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-tools-kitchen-2 "><path d="M19 3v12h-5c-.023 -3.681 .184 -7.406 5 -12zm0 12v6h-1v-3m-10 -14v17m-3 -17v3a3 3 0 1 0 6 0v-3"></path></svg>`;
                break;
            case "photos":
                // @tabler/icons: IconPhoto
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-photo "><path d="M15 8h.01"></path><path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z"></path><path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5"></path><path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3"></path></svg>`;
                break;
            case "pointOfInterest":
                // @tabler/icons: IconFocus2
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-focus-2 "><circle cx="12" cy="12" r=".5" fill="currentColor"></circle><path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path><path d="M12 3l0 2"></path><path d="M3 12l2 0"></path><path d="M12 19l0 2"></path><path d="M19 12l2 0"></path></svg>`;
                break;
            case "routeEnd":
                // @tabler/icons: IconPlayerStopFilled
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="tabler-icon tabler-icon-player-stop-filled "><path d="M17 4h-10a3 3 0 0 0 -3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3 -3v-10a3 3 0 0 0 -3 -3z"></path></svg>`;
                break;
            case "routeStart":
                // @tabler/icons: IconPlayerPlayFilled
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="tabler-icon tabler-icon-player-play-filled "><path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z"></path></svg>`;
                break;
            case "shopStop":
                // @tabler/icons: IconShoppingCartFilled
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="tabler-icon tabler-icon-shopping-cart-filled "><path d="M6 2a1 1 0 0 1 .993 .883l.007 .117v1.068l13.071 .935a1 1 0 0 1 .929 1.024l-.01 .114l-1 7a1 1 0 0 1 -.877 .853l-.113 .006h-12v2h10a3 3 0 1 1 -2.995 3.176l-.005 -.176l.005 -.176c.017 -.288 .074 -.564 .166 -.824h-5.342a3 3 0 1 1 -5.824 1.176l-.005 -.176l.005 -.176a3.002 3.002 0 0 1 1.995 -2.654v-12.17h-1a1 1 0 0 1 -.993 -.883l-.007 -.117a1 1 0 0 1 .883 -.993l.117 -.007h2zm0 16a1 1 0 1 0 0 2a1 1 0 0 0 0 -2zm11 0a1 1 0 1 0 0 2a1 1 0 0 0 0 -2z"></path></svg>`;
                break;
            case "stop":
                // @tabler/icons: IconPlayerPauseFilled
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="tabler-icon tabler-icon-player-pause-filled "><path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z"></path><path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z"></path></svg>`;
                break;
            case "other":
            default:
                // @tabler/icons: IconInfoSmall
                markerSvgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="tabler-icon tabler-icon-info-small "><path d="M12 9h.01"></path><path d="M11 12h1v4h1"></path></svg>`;
                break;
        }
        return `<div style="position:absolute;top:0;left:0;right:0px;bottom:12px;display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer;">${markerSvgHtml}</div>`;
    }

    static getPointMarkerColor(routePoint: RoutePoint): string {
        switch (routePoint.type) {
            case "coffeeStop":
                return "hsl(189, 81%, 52%)";
            case "danger":
                return "hsl(29, 81%, 52%)";
            case "foodStop":
                return "hsl(189, 81%, 52%)";
            case "photos":
                return "hsl(280, 81%, 52%)";
            case "pointOfInterest":
                return "hsl(189, 81%, 52%)";
            case "routeEnd":
                return "hsl(5, 81%, 52%)";
            case "routeStart":
                return "hsl(148, 81%, 52%)";
            case "shopStop":
                return "hsl(189, 81%, 52%)";
            case "stop":
                return "hsl(189, 81%, 52%)";
            case "other":
            default:
                return "hsl(189, 81%, 52%)";
        }
    }
}
