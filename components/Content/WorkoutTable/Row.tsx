import React, { useState, useEffect } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useWorkoutTableContext } from "./WorkoutTableContextProvider";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { View, Text } from "@/components/UI/Themed";
import { Exercise } from "./types";
import SetRow from "./SetRow";
import AnimatedArrow from "@/components/UI/AnimatedArrow";
import { useTheme } from "@/components/Providers/ThemeProvider";
import Colors from "@/constants/Colors";


interface RowProps extends Exercise {
  exerciseIndex: number;
  style?: ViewStyle;
}

export default function Row({ ...props }: RowProps) {
  const { theme } = useTheme();
  const { tableStyles } = useWorkoutTableContext();
  const columnWidths = tableStyles.columns?.widths || {};
  const [ isExpanded, setIsExpanded ] = useState(true);
 
  const setsNumber = props.sets.length;
  const weightsString = `${props.sets[0].weight} - ${props.sets[props.sets.length - 1].weight}`;

  return (
    <View style={[
      styles.container, 
      props.style,
    ]}>
      <View style={[
        styles.header, 
        { borderBottomColor: Colors[theme].textMuted },
      ]}>
        <View style={[{ width: columnWidths.dragColumn }]}>
          <Pressable 
          >
            <MaterialIcons 
              name="drag-handle" 
              size={24} 
    <View style={[styles.container, style]}>
              } 
            />
          </Pressable>
        </View>
        <Text style={[styles.text, { width: columnWidths.keyColumn }]}>{props.exerciseIndex + 1}</Text>
        <Text style={[styles.text, { flex: columnWidths.nameColumn.flex }]}>{props.name}</Text>
        <View style={[styles.headerRepsColumn, { flex: columnWidths.repsColumn.flex }]}>
          <View style={[styles.arrowLinker]}>
            <AnimatedArrow direction="down" size={styles.arrowLinker.width} color={Colors[theme].text } onPress={toggleExpanded} toggled={isExpanded} />
          </View>
          <Text style={styles.text}>{setsNumber}</Text>
        </View>
        <Text style={[styles.text, { flex: columnWidths.weightsColumn.flex }]}>{weightsString}</Text>
        <Pressable style={[{ width: columnWidths.deleteColumn }]} onPress={() => console.log("Delete exercise")}>
          <Ionicons name="close" size={20} color={Colors[theme].text } />
        </Pressable>
      </View>
      { isExpanded && (
      <View style={[styles.expandableArea]}>
        <View style={[{ width: columnWidths.dragColumn }]}></View>
        <View style={[{ width: columnWidths.keyColumn }]}></View>
        <Text style={[styles.text, styles.description, { flex: columnWidths.nameColumn.flex }]}>{props.description}</Text>
        <View style={[styles.setsColumns, { flex: columnWidths.repsColumn.flex }]}>
          { props.sets.map((set, index) => (
            <SetRow key={index} reps={set.reps} linker={true} style={styles.headerRepsColumn} textStyle={styles.text} linkerStyle={styles.arrowLinker} last={index === props.sets.length - 1} />
          ))}
        </View>
        <View style={[ styles.setsColumns,{ flex: columnWidths.weightsColumn.flex }]}>
          { props.sets.map((set, index) => (
            <SetRow key={index} weight={set.weight} linker={false} textStyle={styles.text}/>
          ))}
        </View>
        <View style={[ styles.setsColumns,{ width: columnWidths.deleteColumn }]}>
          { props.sets.map((set, index) => (
            <SetRow key={index} remove={true} linker={false} textStyle={styles.text}/>
          ))}
        </View>
        
      </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  description: {
    paddingVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 300,
  },
  dragButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  headerRepsColumn: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 10,
  },
  expandableArea: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  arrowLinker: {
    width: 20,
  },
  setsColumns: {
    flexDirection: "column",
    justifyContent: "flex-start",
    rowGap: 0,
  },
});