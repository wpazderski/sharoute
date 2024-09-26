import type { DefaultMantineColor, MantineColorsTuple, MantineThemeOverride } from "@mantine/core";
import { createTheme } from "@mantine/core";

export type CustomColor = "primary" | "subtle" | "info" | "success" | "warning" | "error";
type ExtendedCustomColors = DefaultMantineColor | CustomColor;

declare module "@mantine/core" {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, MantineColorsTuple>;
    }
}

export const primaryColorsTuple: MantineColorsTuple = [
    "#f0f3fa",
    "#dfe4ee",
    "#bac5dd",
    "#92a5ce",
    "#718ac0",
    "#5d79b9",
    "#5271b7",
    "#425fa1",
    "#3a5590",
    "#2d4980",
];
export const primaryShadeForLightColorScheme = 6;
export const primaryShadeForDarkColorScheme = 8;
export const primaryColor = primaryColorsTuple[primaryShadeForLightColorScheme];

export const mantineTheme: MantineThemeOverride = createTheme({
    primaryColor: "primary",
    primaryShade: {
        light: primaryShadeForLightColorScheme,
        dark: primaryShadeForDarkColorScheme,
    },
    colors: {
        primary: primaryColorsTuple,
        subtle: ["#f8f9fa", "#f1f3f5", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd", "#868e96", "#495057", "#343a40", "#212529"],
        info: ["#e7f5ff", "#d0ebff", "#a5d8ff", "#74c0fc", "#4dabf7", "#339af0", "#228be6", "#1c7ed6", "#1971c2", "#1864ab"],
        success: ["#e6fcf5", "#c3fae8", "#96f2d7", "#63e6be", "#38d9a9", "#20c997", "#12b886", "#0ca678", "#099268", "#087f5b"],
        warning: ["#fff4e6", "#ffe8cc", "#ffd8a8", "#ffc078", "#ffa94d", "#ff922b", "#fd7e14", "#f76707", "#e8590c", "#d9480f"],
        error: ["#fff5f5", "#ffe3e3", "#ffc9c9", "#ffa8a8", "#ff8787", "#ff6b6b", "#fa5252", "#f03e3e", "#e03131", "#c92a2a"],
    },
});
