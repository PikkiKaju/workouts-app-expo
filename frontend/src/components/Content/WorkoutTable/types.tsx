
export interface Set {
  id: number
  reps: number
  weight: number
}

export interface Exercise {
  id: number
  name: string
  description: string
  sets: Set[]
}

export interface Workout {
  id: number
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
  // Moves the row up by the height of the dragged row
  moveUp: (index: number) => void;
  // Moves the row down by the height of the dragged row
  moveDown: (index: number) => void;
  // Resets row's displacement back to its original position
  resetDisplacement: () => void;
}