import { Env } from "@/utils/Env";

export const demoWarningHeight = 40;
export const headerHeight = 60 + (Env.isDemoMode ? demoWarningHeight : 0);
export const sidebarWidth = 300;
