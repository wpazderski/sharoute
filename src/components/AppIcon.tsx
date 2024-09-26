import { primaryColor } from "./rootAppLayout/mantineTheme";

const color = primaryColor;
const svgSize = 256;
const radius = 96;
const numSpokes = 7;
const numCogs = 12;
const cogOffset = 6;
const cogSize = 2;
const wheelStrokeWidth = 16;
const spokeStrokeWidth = 8;
const cogStrokeWidth = 24;
const center = svgSize / 2;

export interface AppIconProps {
    height?: number | undefined;
}

export function AppIcon(props: AppIconProps) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${svgSize} ${svgSize}`} width={props.height} height={props.height}>
            <circle style={{ stroke: color, fill: "none", strokeWidth: wheelStrokeWidth }} cx={center} cy={center} r={radius} />
            {new Array(numSpokes)
                .fill(0)
                .map((_, idx) => idx)
                .map((spokeId) => (
                    <path
                        key={spokeId}
                        style={{ stroke: color, fill: "none", strokeWidth: spokeStrokeWidth }}
                        strokeLinecap="round"
                        d={getSpokePath(spokeId)}
                    />
                ))}
            {new Array(numCogs)
                .fill(0)
                .map((_, idx) => idx)
                .map((cogSegmentId) => (
                    <path
                        key={cogSegmentId}
                        style={{ stroke: color, fill: "none", strokeWidth: cogStrokeWidth }}
                        strokeLinecap="round"
                        d={getCogSegmentPath(cogSegmentId)}
                    />
                ))}
        </svg>
    );
}

function getSpokePath(spokeId: number) {
    const { x, y } = rotateCoords(center, center - radius, (spokeId * 2 * Math.PI) / numSpokes);
    return `M ${center} ${center} L ${x} ${y}`;
}

function getCogSegmentPath(cogSegmentId: number) {
    const { x: x1, y: y1 } = rotateCoords(center, center - radius - cogOffset, (cogSegmentId * 2 * Math.PI) / numCogs);
    const { x: x2, y: y2 } = rotateCoords(center, center - radius - cogOffset - cogSize, (cogSegmentId * 2 * Math.PI) / numCogs);
    return `M ${x1} ${y1} L ${x2} ${y2}`;
}

function rotateCoords(x: number, y: number, angle: number) {
    const exactCoords = {
        x: center + (x - center) * Math.cos(angle) - (y - center) * Math.sin(angle),
        y: center + (x - center) * Math.sin(angle) + (y - center) * Math.cos(angle),
    };
    return {
        x: Math.round(exactCoords.x * 1000) / 1000,
        y: Math.round(exactCoords.y * 1000) / 1000,
    };
}
