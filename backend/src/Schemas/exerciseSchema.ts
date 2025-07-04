import { z } from "zod";

// Zod schema for an exercise
const exerciseSchema = z.object({
    name: z.string(),
    sets: z.array(z.object({
        reps: z.number(),
        weight: z.number().optional(),
    })),
});

export default exerciseSchema;