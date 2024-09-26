import { ImageResponse } from "next/og";
import { AppIcon } from "@/components/AppIcon";

export const runtime = "edge";

export const size = {
    width: 192,
    height: 192,
};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "transparent",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AppIcon height={size.height} />
            </div>
        ),
        {
            ...size,
        },
    );
}
