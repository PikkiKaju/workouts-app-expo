import React, { useEffect } from "react";
import { StyleSheet, ViewStyle } from "react-native";

import { View } from "components/ui/Themed";
import Header from "./Header";
import Row from "./Row";
import Footer from "./Footer";
import {
  WorkoutTableContextProvider,
  useWorkoutTableContext,
} from "./WorkoutTableContextProvider";
import { Exercise } from "./types";

type HeaderElement = React.ReactElement<React.ComponentProps<typeof Header>>;
export type RowElement = React.ReactElement<React.ComponentProps<typeof Row>>;
type FooterElement = React.ReactElement<React.ComponentProps<typeof Footer>>;

type AllowedChildren = HeaderElement | RowElement | FooterElement;

interface WorkoutTableProps {
  exercises: Exercise[];
  children: React.ReactNode;
  style?: ViewStyle;
}

const WorkoutTableContent = ({ children, style }: WorkoutTableProps) => {
  const {
    exercises,
    setExercises,
    setTableRowsPositions,
    registerRowRef,
    tableVersion,
  } = useWorkoutTableContext();
  const childrenArray = React.Children.toArray(children);

  // Type guard function to check if a child is an allowed type
  const isAllowedChild = (child: React.ReactNode): child is AllowedChildren => {
    return (
      React.isValidElement(child) &&
      (child.type === Header || child.type === Row || child.type === Footer)
    );
  };

  useEffect(() => {
    // Validate that all children are of allowed types
    const invalidChildren = childrenArray.filter(
      (child) => !isAllowedChild(child)
    );
    if (invalidChildren.length > 0) {
      throw new Error(
        "WorkoutTable only accepts Header, Row, and Footer components as children."
      );
    }

    // Initialize exercises from children's props
    const rows = childrenArray.filter(
      (child) => React.isValidElement(child) && child.type === Row
    ) as RowElement[];

    const initialExercises = rows.map((row) => ({
      ...row.props,
      isExpanded: row.props.isExpanded ?? true,
    }));

    setExercises(initialExercises);
    setTableRowsPositions(
      initialExercises.map((_, index) => ({
        index: index,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }))
    );
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

  return (
    <View style={[styles.container, style]}>
      {header}
      <View style={styles.container}>
        {exercises.map((exerciseProps, index) => {
          const stableKey = `${tableVersion}-${
            exerciseProps.id ?? `row-${index}`
          }`;
          return (
            <Row
              key={stableKey}
              ref={(ref) => registerRowRef(index, ref)}
              {...exerciseProps}
              exerciseIndex={index}
            />
          );
        })}
      </View>
      {footer}
    </View>
  );
};

// Public component that provides the context
const WorkoutTable = ({ children, style, exercises }: WorkoutTableProps) => {
  return (
    <WorkoutTableContextProvider>
      <WorkoutTableContent style={style} exercises={exercises}>
        {children}
      </WorkoutTableContent>
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
    zIndex: 1,
  },
});
