import React from "react";
import { StyleSheet } from "react-native";

import { View, Text } from "@/components/UI/Themed";
import Header, { HeaderType } from "./Header";
import Footer from "./Footer";
import Row from "./Row";

interface WorkoutTableState {}

type AllowedChildren = 
  React.ReactElement<typeof Header> 
  | React.ReactElement<typeof Footer> 
  | React.ReactElement<typeof Row>;

interface WorkoutTableProps {
  children: AllowedChildren | AllowedChildren[];
  style?: React.CSSProperties;
}

const WorkoutTable = ({ children, style }: WorkoutTableProps) => {


  const header = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === Header
  ) as React.ReactElement | undefined;
  
  if (!header) {
    console.warn("WorkoutTable requires a Header component as a child.");
    throw new Error("WorkoutTable requires a Header component as a child.");
  }

  const rows = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === typeof Row
  );

  const footer = React.Children.toArray(children).find(
    (child) => React.isValidElement(child) && child.type === typeof Footer
  );
  
  return(
    <View>
      <View style={[styles.container, style]}>
        {header}
        {rows.map((RowComponent, index) => (
          <Row key={index} {...RowComponent.props} />
        ))}
        {footer}
      </View>
    </View>
  );
}

export default WorkoutTable;

const styles = StyleSheet.create({
  container: {},
});
