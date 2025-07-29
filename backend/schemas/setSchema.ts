import { z } from "zod";

// Zod schema for an exercise
const setSchema = z.object({
    reps: z.number(),
    weight: z.number().optional(),
});

export default setSchema;