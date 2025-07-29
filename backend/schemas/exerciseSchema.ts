import { z } from "zod";
import setSchema from "./setSchema";

// Zod schema for an exercise
const exerciseSchema = z.object({
    name: z.string(),
    description: z.string().optional(),
    muscleGroup: z.string().optional(),
    equipment: z.string().optional(),
    instructions: z.string().optional(),
    sets: z.array(setSchema)
});

export default exerciseSchema;