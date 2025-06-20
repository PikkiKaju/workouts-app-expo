import { useState, useEffect, useRef, useCallback } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import DatePicker from '../components/DatePicker/DatePicker';

export function useWorkoutForm(
  initialName = "Workout Name",
  initialDate = new Date(),
  initialDescription = ""
) {
  const nameInputRef = useRef<RNTextInput>(null);
  const dateInputRef = useRef<DatePicker>(null); 
  const descInputRef = useRef<RNTextInput>(null);

  const [workoutName, setWorkoutName] = useState<string>(initialName);
  const [workoutDate, setWorkoutDate] = useState<Date>(initialDate);
  const [workoutDescription, setWorkoutDescription] = useState<string>(initialDescription);

  useEffect(() => {
    setWorkoutName("Workout 1");
    setWorkoutDate(new Date());
    setWorkoutDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ");
  }, []); // Runs once on mount

  const handleWorkoutNameChange = useCallback((name: string) => {
    setWorkoutName(name);
  }, []);

  const saveWorkoutName = useCallback(() => {
    console.log("Workout name changed (implement save logic):", workoutName);
    // Add logic to save the workout name
  }, [workoutName]);

  const handleWorkoutDateChange = useCallback((newDate: Date) => {
    setWorkoutDate(newDate);
    console.log("Workout date changed (implement save logic):", newDate);
    // Add logic to save the workout date
  }, []);

  const saveWorkoutDescription = useCallback(() => {
    console.log("Workout description changed (implement save logic):", workoutDescription);
    // Add logic to save the workout description
  }, [workoutDescription]);

  const requestFocusNameInput = useCallback(() => {
    dateInputRef.current?.blur();
    descInputRef.current?.blur();
    nameInputRef.current?.focus();
  }, []);

  const requestFocusDateInput = useCallback(() => {
    nameInputRef.current?.blur();
    descInputRef.current?.blur();
    dateInputRef.current?.focus();
  }, []);

  const requestFocusDescriptionInput = useCallback(() => {
    nameInputRef.current?.blur();
    dateInputRef.current?.blur();
    descInputRef.current?.focus();
  }, []);

  return {
    refs: { nameInputRef, dateInputRef, descInputRef },
    workoutName,
    workoutDate,
    workoutDescription,
    setWorkoutDescription,   // For direct updates from DescriptionInput
    handleWorkoutNameChange, // For onChangeText
    saveWorkoutName,         // For onBlur
    handleWorkoutDateChange, // For onDateChange
    saveWorkoutDescription,  // For onBlur
    requestFocusNameInput,
    requestFocusDateInput,
    requestFocusDescriptionInput,
  };
}
