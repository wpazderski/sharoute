import { z } from "zod";
import * as validationSchemas from "@/lib/validation/schemas";

export const createRouteRequestValidationSchema = z.object({
    gpxRoute: validationSchemas.gpxRoute,
});
