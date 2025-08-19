import React, { useState, useEffect, useRef } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useWorkoutTableContext } from "./WorkoutTableContextProvider";
import { Animated, GestureResponderEvent, Pressable, StyleSheet, ViewStyle, PanResponder, Platform } from "react-native";
import { View, Text } from "@/components/UI/Themed";
import { Exercise } from "./types";
import SetRow from "./SetRow";
import AnimatedArrow from "@/components/UI/AnimatedArrow";
import { useTheme } from "@/components/Providers/ThemeProvider";
import Colors from "@/constants/Colors";
import HoverableView from "@/components/UI/HoverableView";


interface RowProps extends Exercise {
  exerciseIndex: number;
  style?: ViewStyle;
}


export default function Row({ ...props }: RowProps) {
  const { theme } = useTheme();
  const { tableStyles } = useWorkoutTableContext();
  const columnWidths = tableStyles.columns?.widths || {};
  const [ isExpanded, setIsExpanded ] = useState(true);
  const [ isDragged, setIsDragged ] = useState(false);
  const isDraggedRef = useRef(false);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const [ isOnPlace, setIsOnPlace ] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const scaleAnim = useState(new Animated.Value(0))[0];
  const scaleRef = useRef(scaleAnim.interpolate({ inputRange: [0,1], outputRange: [1,1] }));

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (event) => {
        setIsOnPlace(false);
        handleDragStart(event);
      },
      onPanResponderMove: (evt) => {
        if (isDraggedRef.current) {
          setIsOnPlace(false);
          const { pageX, pageY } = evt.nativeEvent;
          const deltaX = pageX - initialPositionRef.current.x;
          const deltaY = pageY - initialPositionRef.current.y;
          pan.setValue({ x: deltaX, y: deltaY });
        }
      },
      onPanResponderRelease: (event) => {
        if (isDraggedRef.current) {
          pan.flattenOffset();
          // Snap back to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            bounciness: 4,
            useNativeDriver: false,
          }).start(() => setIsOnPlace(true));
          handleDragEnd(event);
        }
      },
    })
  ).current;

  const scaleAnimTransition = 50; // Duration for scale animation

  function handleDragStart(e: GestureResponderEvent) {
    setIsDragged(true);
    isDraggedRef.current = true;
    const { pageX, pageY } = e.nativeEvent;
    initialPositionRef.current = { x: pageX, y: pageY };
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: scaleAnimTransition,
      useNativeDriver: false,
    }).start();
  }

  function handleDragEnd(e: GestureResponderEvent) {
    setIsDragged(false);
    isDraggedRef.current = false;
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: scaleAnimTransition,
      useNativeDriver: false,
    }).start(() => {});
  }

  scaleRef.current = scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1, Platform.OS === "web" ? 1.01 : 1.02],
    });

  const setsNumber = props.sets.length;
  const weightsString = `${props.sets[0].weight} - ${props.sets[props.sets.length - 1].weight}`;

  return (
    <Animated.View
      style={[ 
        styles.container, 
        props.style,
        !isOnPlace ? { zIndex: 1000 } : {},
        { 
          transform: [
            { scale: scaleRef.current },
            { translateY: pan.y },
          ]
        }
      ]}  
      {...panResponder.panHandlers}
    >
      <HoverableView
        style={[styles.container]}
        hoverStyle={{ backgroundColor: Colors[theme].backgroundHover }}
      >
      <View style={[
        styles.header, 
        { borderBottomColor: Colors[theme].textMuted },
      ]}>
        <View style={[styles.dragButton, { width: columnWidths.dragColumn }]}>
          <Pressable 
            style={styles.dragButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons 
              name="drag-handle" 
              size={24} 
              color={Colors[theme].textMuted}
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
      </HoverableView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
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