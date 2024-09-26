import { z } from "zod";
import * as validationSchemas from "@/lib/validation/schemas";

export const deleteRouteRequestValidationSchema = z.object({
    routeId: validationSchemas.routeId,
});
