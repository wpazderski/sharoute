import { z } from "zod";
import * as validationSchemas from "@/lib/validation/schemas";

export const getRouteForViewingRequestValidationSchema = z.object({
    routePublicId: validationSchemas.routePublicId,
});
