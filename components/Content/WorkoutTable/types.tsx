
export interface Set {
  reps: number
  weight: number
}

export interface Exercise {
  name: string
  description: string
  sets: Set[]
}

export interface Workout {
  name: string
  date: Date 
  exercises: Exercise[]
}

// Shared type used by WorkoutTable rows to track measured layout
export type rowPositionType = {
  x: number;
  y: number;
  width: number;
  height: number;
}