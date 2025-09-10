import React, { createContext, useCallback, useContext, useRef, useState, } from "react";
import { DimensionValue, Platform } from "react-native";
import { Exercise, RowHandle, rowPositionType } from "./types";

export interface ExtendedExercise extends Exercise {
  isExpanded: boolean;
}

// Platform-specific column widths to handle mobile vs web differences
const getColumnWidths = () => {
  const isMobile = Platform.OS === "ios" || Platform.OS === "android";

  if (isMobile) {
    // Mobile devices
    return {
      dragColumn: 30 as DimensionValue,
      keyColumn: 20 as DimensionValue,
      nameColumn: {
        percentage: "50%" as DimensionValue,
        flex: 2,
      },
      repsColumn: {
        percentage: "25%" as DimensionValue,
        flex: 1,
      },
      weightsColumn: {
        percentage: "25%" as DimensionValue,
        flex: 1,
      },
      deleteColumn: 40 as DimensionValue,
    };
  } else {
    // Web platform - increase widths
    return {
      dragColumn: 40 as DimensionValue,
      keyColumn: 40 as DimensionValue,
      nameColumn: {
        percentage: "50%" as DimensionValue,
        flex: 2,
      },
      repsColumn: {
        percentage: "25%" as DimensionValue,
        flex: 1,
      },
      weightsColumn: {
        percentage: "25%" as DimensionValue,
        flex: 1,
      },
      deleteColumn: 40 as DimensionValue,
    };
  }
};

const workoutTableStyles = {
  columns: {
    widths: getColumnWidths(),
  },
  rows: {
    height: 50,
  },
};

interface WorkoutTableContextType {
  exercises: ExtendedExercise[];
  setExercises: React.Dispatch<React.SetStateAction<ExtendedExercise[]>>;
  tableStyles: typeof workoutTableStyles;
  tableRowsPositions: rowPositionType[];
  setTableRowsPositions: React.Dispatch<React.SetStateAction<rowPositionType[]>>;
  setTableRowPosition: (index: number, position: rowPositionType) => void;
  toggleRowExpansion: (index: number) => void;
  // Registry of Row refs to control rows from siblings/parent
  registerRowRef: (index: number, ref: RowHandle | null) => void;
  getRowRef: (index: number) => RowHandle | undefined;
  tableVersion: number;
  incrementTableVersion: () => void;
}

const WorkoutTableContext = createContext<WorkoutTableContextType | undefined>(undefined);

export const WorkoutTableContextProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [exercises, setExercises] = useState<ExtendedExercise[]>([]);
  const [tableStyles] = useState<typeof workoutTableStyles>(workoutTableStyles);
  const [tableRowsPositions, setTableRowsPositions] = useState<rowPositionType[]>([]);
  const [tableVersion, setTableVersion] = useState(0);

  // Keep a stable map of row refs by index
  const rowRefs = useRef<Map<number, RowHandle>>(new Map());

  const setTableRowPosition = (index: number, position: rowPositionType) => {
    setTableRowsPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions[index] = position;
      // calculate y positions for all rows based on heights
      return newPositions.map((pos, i) => {
        let y = 0;
        for (let j = 0; j < i; j++) {
          y += newPositions[j]?.height || 0;
        }
        return { ...pos, y };
      });
    });
  };

  const toggleRowExpansion = (index: number) => {
    setExercises((prev) => {
      const next = [...prev];
      if (next[index]) {
        next[index] = { ...next[index], isExpanded: !next[index].isExpanded };
      }
      return next;
    });
  };

  const registerRowRef = (index: number, ref: RowHandle | null) => {
    if (ref) { rowRefs.current.set(index, ref); }
    else { rowRefs.current.delete(index); }
  };

  const getRowRef = (index: number) => rowRefs.current.get(index);

  // Increment the table version to trigger re-renders
  const incrementTableVersion = useCallback(() => {
    setTableVersion((prev) => prev + 1);
  }, []);

  return (
    <WorkoutTableContext.Provider
      value={{
        exercises, setExercises,
        tableStyles,
        tableRowsPositions, setTableRowsPositions, setTableRowPosition,
        toggleRowExpansion,
        registerRowRef, getRowRef,
        tableVersion, incrementTableVersion,
      }}
    >
      {children}
    </WorkoutTableContext.Provider>
  );
};

export const useWorkoutTableContext = () => {
  const context = useContext(WorkoutTableContext);
  if (!context) {
    throw new Error("WorkoutTableContext must be used within a WorkoutTableContextProvider");
  }

  return context;
};
