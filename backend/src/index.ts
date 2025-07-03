import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

// Example Zod schema for a workout
const workoutSchema = z.object({
  name: z.string(),
  date: z.string(),
  exercises: z.array(
    z.object({
      name: z.string(),
      sets: z.number(),
      reps: z.number(),
      weight: z.number().optional(),
    })
  ),
});

// Example route
app.post("/workouts", (req: any, res: any) => {
  const parseResult = workoutSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: parseResult.error.errors });
  }
  // Here you would save the workout to a database
  res.status(201).json({ message: "Workout created", data: parseResult.data });
});

app.get("/", (req, res) => {
  res.send("Workouts backend is running!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
