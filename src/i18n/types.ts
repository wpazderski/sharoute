import type { Opaque } from "../types";

declare const _TimeZone: unique symbol;
export type TimeZone = Opaque<string, typeof _TimeZone>;

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
