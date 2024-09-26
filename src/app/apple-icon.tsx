import { ImageResponse } from "next/og";
import { AppIcon } from "@/components/AppIcon";

export const runtime = "edge";

export const size = {
    width: 180,
    height: 180,
};
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    background: "#eee",
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
