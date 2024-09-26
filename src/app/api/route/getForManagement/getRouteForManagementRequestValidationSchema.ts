import { z } from "zod";
import * as validationSchemas from "@/lib/validation/schemas";

export const getRouteForManagementRequestValidationSchema = z.object({
    routePublicId: validationSchemas.routePublicId,
});
