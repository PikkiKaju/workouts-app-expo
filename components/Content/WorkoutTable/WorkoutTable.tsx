import React from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { View, Text } from "@/components/UI/Themed";
import Header, { HeaderType } from "./Header";
import Row from "./Row";
import Footer from "./Footer";
import { WorkoutTableContextProvider } from "./WorkoutTableContextProvider";

interface WorkoutTableState {}

// More precise type definitions for allowed children
type HeaderElement = React.ReactElement<React.ComponentProps<typeof Header>>;
type RowElement = React.ReactElement<React.ComponentProps<typeof Row>>;
type FooterElement = React.ReactElement<React.ComponentProps<typeof Footer>>;

type AllowedChildren = HeaderElement | RowElement | FooterElement;

interface WorkoutTableProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const WorkoutTable = ({ children, style }: WorkoutTableProps) => {
  // Validate that all children are of allowed types
  const childrenArray = React.Children.toArray(children);
  
  // Type guard function to check if a child is an allowed type
  const isAllowedChild = (child: React.ReactNode): child is AllowedChildren => {
    return React.isValidElement(child) && 
           (child.type === Header || child.type === Row || child.type === Footer);
  };

  // Validate all children
  const invalidChildren = childrenArray.filter(child => !isAllowedChild(child));
  if (invalidChildren.length > 0) {
    console.log("Invalid children detected in WorkoutTable:", invalidChildren);
    console.error("WorkoutTable only accepts Header, Row, and Footer components as children.");
    throw new Error("WorkoutTable only accepts Header, Row, and Footer components as children.");
  }

  const header = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === Header
  ) as React.ReactElement | undefined;
  
  if (!header) {
    console.warn("WorkoutTable requires a Header component as a child.");
    throw new Error("WorkoutTable requires a Header component as a child.");
  }

  const rows = childrenArray.filter(
    (child) => React.isValidElement(child) && child.type === Row
  ) as React.ReactElement[];

  const footer = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === Footer
  );
  
  return(
    <WorkoutTableContextProvider>
      <View style={[styles.container, style]}>
        {React.cloneElement(header as React.ReactElement<any>, {})}
        {rows.map((row, index) => (
          React.cloneElement(row, { key: index })
        ))}
        {footer}
      </View>
    </WorkoutTableContextProvider>
  );
}

WorkoutTable.Header = Header;
WorkoutTable.Row = Row;
WorkoutTable.Footer = Footer;

export default WorkoutTable;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "column",
  },
});
