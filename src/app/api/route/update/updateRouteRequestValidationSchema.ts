import { z } from "zod";
import * as validationSchemas from "@/lib/validation/schemas";

export const updateRouteRequestValidationSchema = z.object({
    routeId: validationSchemas.routeId,
    routePropsToUpdate: z.object({
        name: validationSchemas.routeName.optional(),
        description: validationSchemas.routeDescription.optional(),
        hasElevation: validationSchemas.routeHasElevation.optional(),
        points: validationSchemas.routePoints.optional(),
        photoIds: validationSchemas.routePhotoIds.optional(),
    }),
});
