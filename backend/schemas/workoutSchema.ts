import { z } from "zod";
import exerciseSchema from "./exerciseSchema";

// Zod schema for a workout
const workoutSchema = z.object({
  name: z.string(),
  date: z.date(),
  exercises: z.array(exerciseSchema),
});

export default workoutSchema;