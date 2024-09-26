import { Box } from "@mantine/core";
import { useId } from "@mantine/hooks";
import type { RouteHasElevation } from "@/lib/db/collections/routes/types";
import type { RouteAnalyzer } from "@/lib/route/RouteAnalyzer";
import type { LatLon } from "@/units";
import { ElevationChart } from "./ElevationChart";
import { GradeChart } from "./GradeChart";

export interface RouteChartsProps {
    routeAnalyzer: RouteAnalyzer;
    hasElevation: RouteHasElevation;
    onHighlightLatLon?: ((latLon: LatLon | null) => void) | undefined;
}

export function RouteCharts(props: RouteChartsProps) {
    const chartsSyncId = useId();

    return (
        <Box>
            {props.hasElevation ? (
                <>
                    <GradeChart routeAnalyzer={props.routeAnalyzer} chartsSyncId={chartsSyncId} onHighlightLatLon={props.onHighlightLatLon} />
                    <ElevationChart routeAnalyzer={props.routeAnalyzer} chartsSyncId={chartsSyncId} onHighlightLatLon={props.onHighlightLatLon} />
                </>
            ) : null}
        </Box>
    );
}
