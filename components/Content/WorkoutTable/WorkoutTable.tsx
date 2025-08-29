import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { View } from "@/components/UI/Themed";
import Header from "./Header";
import Row from "./Row";
import Footer from "./Footer";
import { WorkoutTableContextProvider, useWorkoutTableContext } from "./WorkoutTableContextProvider";


type HeaderElement = React.ReactElement<React.ComponentProps<typeof Header>>;
export type RowElement = React.ReactElement<React.ComponentProps<typeof Row>>;
type FooterElement = React.ReactElement<React.ComponentProps<typeof Footer>>;

type AllowedChildren = HeaderElement | RowElement | FooterElement;

interface WorkoutTableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const WorkoutTableContent = ({ children, style }: WorkoutTableProps) => {
  const { tableRows, setTableRows, setTableRowsPositions, registerRowRef } = useWorkoutTableContext();
  const childrenArray = React.Children.toArray(children);
        
  // Type guard function to check if a child is an allowed type
  const isAllowedChild = (child: React.ReactNode): child is AllowedChildren => {
    return React.isValidElement(child) && 
    (child.type === Header || child.type === Row || child.type === Footer);
  };   
        
  useEffect(() => {
    // Validate that all children are of allowed types
    const invalidChildren = childrenArray.filter(child => !isAllowedChild(child));
    if (invalidChildren.length > 0) {
      throw new Error("WorkoutTable only accepts Header, Row, and Footer components as children.");
    }
    
    // Initialize tableRows from children
    const rows = childrenArray.filter(
      (child) => React.isValidElement(child) && child.type === Row
    ) as RowElement[];

    setTableRows(rows);
    setTableRowsPositions(rows.map((row, index) => ({x: 0, y: 0, width: 0, height: 0})));
  }, []);

  const header = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === Header
  ) as HeaderElement;
  
  if (!header) {
    console.warn("WorkoutTable requires a Header component as a child.");
    throw new Error("WorkoutTable requires a Header component as a child.");
  }
  
  const footer = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === Footer
  ) as FooterElement;
  
  return(
    <View style={[styles.container, style]}>
      {header}
      <View style={styles.container}>
        {tableRows.map((row, index) => {
          const stableKey = (row.key ?? row.props?.name ?? `row-${index}`) as string;
          return (
            <Row
              key={stableKey}
              ref={(ref) => registerRowRef(index, ref)}
              {...row.props}
              exerciseIndex={index}
            />
          );
        })}
      </View>
      {footer}
    </View>
  );
}

// Public component that provides the context
const WorkoutTable = ({ children, style }: WorkoutTableProps) => {
  return (
    <WorkoutTableContextProvider>
      <WorkoutTableContent style={style}>{children}</WorkoutTableContent>
    </WorkoutTableContextProvider>
  );
};

WorkoutTable.Header = Header;
WorkoutTable.Row = Row;
WorkoutTable.Footer = Footer;

export default WorkoutTable;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
    zIndex: 1
  },
});
