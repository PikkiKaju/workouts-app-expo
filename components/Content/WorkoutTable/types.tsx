
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