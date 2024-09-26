import { z } from "zod";

export const latitude = z.number().min(-90).max(90);
export const longitude = z.number().min(-180).max(180);
export const elevation = z.number().min(-20000).max(20000);
