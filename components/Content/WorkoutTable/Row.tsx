import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";

import { useWorkoutTableContext } from "./WorkoutTableContextProvider";
import {
  Animated,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ViewStyle,
  PanResponder,
  Platform,
} from "react-native";
import { View, Text } from "@/components/UI/Themed";
import { Exercise, RowHandle } from "./types";
import SetRow from "./SetRow";
import AnimatedArrow from "@/components/UI/AnimatedArrow";
import { useTheme } from "@/components/Providers/ThemeProvider";
import Colors from "@/constants/Colors";
import HoverableView from "@/components/UI/HoverableView";
import { rowPositionType } from "./types";

export interface RowProps extends Exercise {
  exerciseIndex: number;
  style?: ViewStyle;
}

export default React.forwardRef<RowHandle, RowProps>(function Row(
  { ...props }: RowProps,
  ref
) {
  const { theme } = useTheme();
  const {
    tableStyles,
    tableRows,
    setTableRows,
    tableRowsPositions,
    setTableRowsPositions,
    setTableRowPosition,
    getRowRef,
    incrementTableVersion,
  } = useWorkoutTableContext();
  const columnWidths = tableStyles.columns?.widths || {};
  const [isExpanded, setIsExpanded] = useState(true);
  const pan = useRef(new Animated.ValueXY()).current;
  const displaceY = useRef(new Animated.Value(0)).current; // Animated displacement applied when another row is being dragged
  const isDraggedRef = useRef(false);
  const dragHandleRef = useRef<any>(null);
  const pressingHandleRef = useRef(false);
  const initialPositionRef = useRef({ x: 0, y: 0 });
  const newPositionRef = useRef({ x: 0, y: 0 });
  const targetIndexRef = useRef<number>(props.exerciseIndex);
  const lastAnimatedTargetIndexRef = useRef<number>(props.exerciseIndex);
  const tableRowsPositionsRef = useRef<rowPositionType[]>(tableRowsPositions);
  const [isOnPlace, setIsOnPlace] = useState(true);
  const scaleAnim = useState(new Animated.Value(0))[0];
  const scaleRef = useRef(
    scaleAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1] })
  );

  const moveDuration = 100; // Duration for moveUp/moveDown animations
  const animate = true; // Toggle to enable/disable animations for displacement

  useEffect(() => {
    tableRowsPositionsRef.current = tableRowsPositions;
  }, [tableRowsPositions]);

  // Imperative API for siblings/parent
  useImperativeHandle(ref, () => {
    const setDisplacement = (to: number) => {
      // Stop any existing animation before applying a new displacement
      (displaceY as any).stopAnimation?.();
      if (animate) {
        Animated.timing(displaceY, {
          toValue: to,
          duration: moveDuration,
          useNativeDriver: true,
        }).start();
      } else {
        displaceY.setValue(to);
      }
    };
    return {
      // Set this row's temporary displacement explicitly each frame
      moveUp: (draggedIndex: number) => {
        const h = tableRowsPositionsRef.current[draggedIndex]?.height ?? 0;
        setDisplacement(-h);
      },
      moveDown: (draggedIndex: number) => {
        const h = tableRowsPositionsRef.current[draggedIndex]?.height ?? 0;
        setDisplacement(h);
      },
      resetDisplacement: () => {
        setDisplacement(0);
      }
    };
  });

  function toggleExpanded() {
    setIsExpanded(!isExpanded);
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => handlePanResponderStart(evt),
      onMoveShouldSetPanResponder: (evt) => handlePanResponderStart(evt),
      onPanResponderGrant: (evt) => handlePanResponderGrant(evt),
      onPanResponderMove: (evt) => handlePanResponderMove(evt),
      onPanResponderRelease: handlePanResponderRelease,
      onPanResponderTerminate: handlePanResponderRelease,
      onPanResponderTerminationRequest: () => false,
    })
  ).current;

  const handlePanResponderStart = (evt: GestureResponderEvent) => {
    if (!tableRows) return false;
    return true; // pan handlers are attached to the handle, so always start
  };

  const handlePanResponderGrant = (evt: GestureResponderEvent) => {
    if (!tableRows) return;
    setIsOnPlace(false);
    isDraggedRef.current = true;
    const { pageX, pageY } = evt.nativeEvent;
    initialPositionRef.current = { x: pageX, y: pageY };
    newPositionRef.current = { x: 0, y: 0 };
    lastAnimatedTargetIndexRef.current = props.exerciseIndex;
    // Use offset pattern so repeated drags start from current position without jump
    pan.extractOffset();
    pan.setValue({ x: 0, y: 0 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // Trigger haptic feedback
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: scaleAnimTransition,
      useNativeDriver: false,
    }).start();
  };

  const handlePanResponderMove = (evt: GestureResponderEvent) => {
    if (!tableRows) return;
    if (isDraggedRef.current && tableRows) {
      setIsOnPlace(false);
      const { pageY } = evt.nativeEvent;

      // Create an array of row positions fowr easier processing
      let positions = [];
      for (let i = 0; i < tableRowsPositionsRef.current.length; i++) {
        positions.push({
          index: i,
          top: tableRowsPositionsRef.current[i].y,
          height: tableRowsPositionsRef.current[i].height,
          middle:
            tableRowsPositionsRef.current[i].y +
            tableRowsPositionsRef.current[i].height / 2,
          bottom:
            tableRowsPositionsRef.current[i].y +
            tableRowsPositionsRef.current[i].height,
        });
      }

      // Calculate the maximum distance to move up or down based on the current row positions
      // to ensure the row can only be dragged within the bounds of the other rows
      let maxBefore = 0;
      let maxAfter = 0;
      for (let i = 0; i < positions.length; i++) {
        const height = positions[i].height ?? 0;
        if (i < props.exerciseIndex) maxBefore += height;
        else if (i > props.exerciseIndex) maxAfter += height;
      }
      let deltaY = pageY - initialPositionRef.current.y;
      if (deltaY < -maxBefore) deltaY = -maxBefore;
      else if (deltaY > maxAfter) deltaY = maxAfter;

      pan.setValue({ x: 0, y: deltaY });

      // Compute the dragged row midpoint in the list coordinate space
      let rowMiddleY = maxBefore + deltaY + positions[props.exerciseIndex].height / 2;
      const draggedRowBottomY = maxBefore + deltaY + positions[props.exerciseIndex].height;

      // Compute target index using row midpoints
      let targetIndex = props.exerciseIndex; // Default to current position

      // Check if dragged above all rows
      if (positions.length > 0 && maxBefore + deltaY < positions[0].middle) {
        targetIndex = 0;
      }
      // Check if dragged below all rows
      else if (positions.length > 0 && draggedRowBottomY > positions[positions.length - 1].middle) {
        targetIndex = positions.length - 1;
      }
      // Check over which row the dragged row is being dragged
      else {
        for (let i = 0; i < positions.length; i++) {
          if (positions[i].top <= rowMiddleY && rowMiddleY < positions[i].top + positions[i].height) {
            targetIndex = positions[i].index;
            break;
          }
        }
      }

      // Compute displacement from original index to target index using row heights
      let displacement = 0;
      if (targetIndex > props.exerciseIndex) {
        for (let i = props.exerciseIndex + 1; i <= targetIndex; i++) {
          displacement += positions[i].height;
        }
      } else if (targetIndex < props.exerciseIndex) {
        for (let i = targetIndex; i < props.exerciseIndex; i++) {
          displacement -= positions[i].height;
        }
      }
      targetIndexRef.current = targetIndex;
      newPositionRef.current = { x: 0, y: displacement };

      if (targetIndexRef.current !== lastAnimatedTargetIndexRef.current) {
        // Set each sibling's displacement based on index ranges
        const from = props.exerciseIndex;
        const to = targetIndexRef.current;
        for (let i = 0; i < tableRows.length; i++) {
          if (i === from) continue;
          if (to > from && i >= from + 1 && i <= to) {
            // Dragging down: rows between from+1..to move up to make space
            getRowRef(i)?.moveUp(from);
          } else if (to < from && i >= to && i <= from - 1) {
            // Dragging up: rows between to..from-1 move down to make space
            getRowRef(i)?.moveDown(from);
          } else {
            // Not involved: ensure displacement is cleared
            getRowRef(i)?.resetDisplacement?.();
          }
        }
        lastAnimatedTargetIndexRef.current = targetIndexRef.current;
      }
    }
  };

  function handlePanResponderRelease() {
    if (isDraggedRef.current) {
      // Ensure any running animation is stopped before starting a new one
      pan.stopAnimation();
      // Merge any offset accumulated during previous drags
      pan.flattenOffset();
      // Immediately clear siblings' temporary displacements so they don't animate post-drop
      if (tableRows) {
        for (let i = 0; i < tableRows.length; i++) {
          if (i === props.exerciseIndex) continue;
          getRowRef(i)?.resetDisplacement?.();
        }
      }
      // Commit the new order in context by moving the dragged row to targetIndex
      const from = props.exerciseIndex;
      const to = targetIndexRef.current;
      if (to !== from) {
        // Commit rows order
        setTableRows((prev) => {
          const next = prev.slice();
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return next;
        });

        // After state updates, force table refresh
        incrementTableVersion();

        // Normalize measured positions to the new order so the next drag uses correct data
        setTableRowsPositions((prev) => {
          const next = prev.slice();
          const [movedPos] = next.splice(from, 1);
          next.splice(to, 0, movedPos);
          // Recompute sequential y and index to avoid stale layout until onLayout fires
          let y = 0;
          for (let i = 0; i < next.length; i++) {
            const h = next[i]?.height ?? 0;
            next[i] = {
              ...next[i],
              index: i,
              y,
            };
            y += h;
          }
          return next;
        });
      }

      // Reset transient animations and flags immediately to avoid post-drop animation
      pan.setValue({ x: 0, y: 0 });
      displaceY.setValue(0);
      newPositionRef.current = { x: 0, y: 0 };
      setIsOnPlace(true);
      isDraggedRef.current = false;
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: scaleAnimTransition,
        useNativeDriver: false,
      }).start(() => {});
    }
    pressingHandleRef.current = false;
  }

  const scaleAnimTransition = 50; // Duration for scale animation

  scaleRef.current = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, Platform.OS === "web" ? 1.01 : 1.02],
  });

  // Compute string forms of number of sets and weight range for summary display
  const setsNumber = String(props.sets.length);
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
            { translateY: Animated.add(pan.y, displaceY) },
          ],
        },
      ]}
      onLayout={(event) => {
        setTableRowPosition(props.exerciseIndex, {
          index: props.exerciseIndex,
          x: event.nativeEvent.layout.x,
          y: event.nativeEvent.layout.y,
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        });
      }}
    >
      <HoverableView
        style={[
          styles.container,
          isDraggedRef.current
            ? {
                backgroundColor: Colors[theme].backgroundHover,
                borderRadius: 10,
              }
            : {},
        ]}
        hoverStyle={{ backgroundColor: Colors[theme].backgroundHover }}
      >
        <View
          style={[
            styles.header,
            { borderBottomColor: Colors[theme].textMuted },
          ]}
        >
          <View
            ref={dragHandleRef}
            style={[styles.dragButton, { width: columnWidths.dragColumn }]}
            {...panResponder.panHandlers}
          >
            <Pressable
              style={styles.dragButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPressIn={() => {
                pressingHandleRef.current = true;
              }}
              onPressOut={() => {
                pressingHandleRef.current = false;
              }}
            >
              <MaterialIcons
                name="drag-handle"
                size={24}
                color={Colors[theme].textMuted}
              />
            </Pressable>
          </View>
          <Text style={[styles.text, { width: columnWidths.keyColumn }]}>
            {props.exerciseIndex + 1}
          </Text>
          <Text style={[styles.text, { flex: columnWidths.nameColumn.flex }]}>
            {props.name}
          </Text>
          <View
            style={[
              styles.headerRepsColumn,
              { flex: columnWidths.repsColumn.flex },
            ]}
          >
            <View style={[styles.arrowLinker]}>
              <AnimatedArrow
                direction="down"
                size={styles.arrowLinker.width}
                color={Colors[theme].text}
                onPress={toggleExpanded}
                toggled={isExpanded}
              />
            </View>
            <Text style={styles.text}>{setsNumber}</Text>
          </View>
          <Text
            style={[styles.text, { flex: columnWidths.weightsColumn.flex }]}
          >
            {weightsString}
          </Text>
          <Pressable
            style={[{ width: columnWidths.deleteColumn }]}
            onPress={() => console.log("Delete exercise")}
          >
            <Ionicons name="close" size={20} color={Colors[theme].text} />
          </Pressable>
        </View>
        {isExpanded && (
          <View style={[styles.expandableArea]}>
            <View style={[{ width: columnWidths.dragColumn }]}></View>
            <View style={[{ width: columnWidths.keyColumn }]}></View>
            <Text
              style={[
                styles.text,
                styles.description,
                { flex: columnWidths.nameColumn.flex },
              ]}
            >
              {props.description}
            </Text>
            <View
              style={[
                styles.setsColumns,
                { flex: columnWidths.repsColumn.flex },
              ]}
            >
              {props.sets.map((set, index) => (
                <SetRow
                  key={index}
                  reps={set.reps}
                  linker={true}
                  style={styles.headerRepsColumn}
                  textStyle={styles.text}
                  linkerStyle={styles.arrowLinker}
                  last={index === props.sets.length - 1}
                />
              ))}
            </View>
            <View
              style={[
                styles.setsColumns,
                { flex: columnWidths.weightsColumn.flex },
              ]}
            >
              {props.sets.map((set, index) => (
                <SetRow
                  key={index}
                  weight={set.weight}
                  linker={false}
                  textStyle={styles.text}
                />
              ))}
            </View>
            <View
              style={[styles.setsColumns, { width: columnWidths.deleteColumn }]}
            >
              {props.sets.map((set, index) => (
                <SetRow
                  key={index}
                  remove={true}
                  linker={false}
                  textStyle={styles.text}
                />
              ))}
            </View>
          </View>
        )}
      </HoverableView>
    </Animated.View>
  );
});

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
