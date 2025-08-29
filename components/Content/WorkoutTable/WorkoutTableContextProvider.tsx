import React, { createContext, useContext, useRef, useState } from "react";
import { DimensionValue, Platform } from "react-native";
import { RowElement } from "./WorkoutTable";
import { RowHandle, rowPositionType } from "./types";

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
  tableRowsPositions: rowPositionType[];
  setTableRowsPositions: (positions: rowPositionType[]) => void;
  setTableRowPosition: (index: number, position: rowPositionType) => void;
  tableRows: RowElement[];
  setTableRows: React.Dispatch<React.SetStateAction<RowElement[]>>;
  setTableRow: (index: number, row: RowElement) => void;
  // Registry of Row refs to control rows from siblings/parent
  registerRowRef: (index: number, ref: RowHandle | null) => void;
  getRowRef: (index: number) => RowHandle | undefined;
}

const WorkoutTableContext = createContext<WorkoutTableContextType | undefined>(undefined);


export const WorkoutTableContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tableStyles, setStyles] = useState<typeof workoutTableStyles>(workoutTableStyles);
  const [tableRowsPositions, setTableRowsPositions] = useState<rowPositionType[]>([]);
  const [tableRows, setTableRows] = useState<RowElement[]>([]);
  // Keep a stable map of row refs by index
  const rowRefs = useRef<Map<number, RowHandle>>(new Map());

  const setTableRow = (index: number, row: RowElement) => {
    setTableRows((prevRows) => {
      const newRows = [...prevRows];
      newRows[index] = row;
      console.log(`Updated rows order ${newRows.map(r => r.props.name).join(', ')}`);
      return newRows;
    });
    
  }

  const setTableRowPosition = (index: number, position: rowPositionType) => {
    setTableRowsPositions((prevPositions) => {
      const newPositions = [...prevPositions];
      newPositions[index] = position;
      return newPositions;
    });
  };

  const registerRowRef = (index: number, ref: RowHandle | null) => {
    if (ref) {
      rowRefs.current.set(index, ref);
    } else {
      rowRefs.current.delete(index);
    }
  };

  const getRowRef = (index: number) => rowRefs.current.get(index);

  return (
    <WorkoutTableContext.Provider value={{ tableStyles, tableRowsPositions, setTableRowsPositions, setTableRowPosition, tableRows, setTableRows, setTableRow, registerRowRef, getRowRef }} >
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