
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
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Public imperative API exposed by each Row via forwardRef
export interface RowHandle {
  // Moves the row up by "distance" (defaults to own height)
  moveUp: (index: number) => void;
  // Moves the row down by "distance" (defaults to own height)
  moveDown: (index: number) => void;
  // Resets any temporary displacement back to 0
  resetDisplacement: () => void;
  // Optional helpers
  isDragging: () => boolean;
  getHeight: () => number | undefined;
}