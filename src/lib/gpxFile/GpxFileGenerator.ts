import type { PublicRoute } from "../db/collections/routes/types";

export class GpxFileGenerator {
    static generateGpxFileContent(route: PublicRoute, defaultRouteName: string): string {
        const routeName = this.getRouteName(route, defaultRouteName);

        return `
<?xml version="1.0" encoding="UTF-8"?>
<gpx
    creator="Sharoute"
    version="1.1"
    xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/11.xsd"
    xmlns="http://www.topografix.com/GPX/1/1"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
    <metadata>
        <name>${routeName}</name>
    </metadata>
    <trk>
        <name>${routeName}</name>
        <trkseg>${route.trackPoints
            .map(
                (trackPoint) => `
            <trkpt lat="${trackPoint.lat}" lon="${trackPoint.lon}">
                <ele>${trackPoint.ele}</ele>
            </trkpt>`,
            )
            .join("")}
        </trkseg>
    </trk>
</gpx>
        `.trim();
    }

    static downloadGpxFile(route: PublicRoute, defaultRouteName: string): void {
        const routeName = this.getRouteName(route, defaultRouteName);
        const content = this.generateGpxFileContent(route, defaultRouteName);
        const blob = new Blob([content], { type: "application/gpx+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("href", url);
        a.setAttribute("download", `${routeName}.gpx`);
        a.click();
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 1000);
    }

    private static getRouteName(route: PublicRoute, defaultRouteName: string): string {
        let routeName = route.name.trim().length > 0 ? route.name : defaultRouteName;
        routeName = routeName.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");

        return routeName;
    }
}
