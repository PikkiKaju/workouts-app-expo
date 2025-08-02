
import React, { createContext, useContext, useState } from "react";
import { DimensionValue, Platform } from "react-native";

export type panelToggled = true | false;

// Platform-specific column widths to handle mobile vs web differences
const getColumnWidths = () => {
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
  if (isMobile) { // Mobile devices
    return {
      dragColumn: 30 as DimensionValue, 
      keyColumn: 20 as DimensionValue,
      nameColumn: {
        percentage: '50%' as DimensionValue, 
        flex: 2,
      },
      repsColumn: {
        percentage: '25%' as DimensionValue, 
        flex: 1,
      },
      weightsColumn: {
        percentage: '25%' as DimensionValue, 
        flex: 1,
      },
      deleteColumn: 40 as DimensionValue, 
    };
  } else { // Web platform - increase widths
    return {
      dragColumn: 40 as DimensionValue, 
      keyColumn: 40 as DimensionValue,
      nameColumn: {
        percentage: '50%' as DimensionValue, 
        flex: 2,
      },
      repsColumn: {
        percentage: '25%' as DimensionValue, 
        flex: 1,
      },
      weightsColumn: {
        percentage: '25%' as DimensionValue, 
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
  }
}

interface WorkoutTableContextType {
  tableStyles: typeof workoutTableStyles;
}

const WorkoutTableContext = createContext<WorkoutTableContextType | undefined>(undefined);

export const WorkoutTableContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tableStyles, setStyles] = useState<typeof workoutTableStyles>(workoutTableStyles);


  return (
    <WorkoutTableContext.Provider value={{ tableStyles }} >
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