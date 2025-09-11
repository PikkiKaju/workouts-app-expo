import { StatusBar } from "expo-status-bar";
import {
  Animated,
  Platform,
  Pressable,
  Keyboard,
  StyleSheet,
  StatusBar as RNStatusBar,
  useWindowDimensions,
} from "react-native";

import { useTheme } from "context/ThemeProvider";
import { View } from "components/ui/Themed";
import Header from "components/Header";
import Panel from "components/Panel/Panel";
import Colors from "constants/Colors";
import Content from "components/Content/Content";
import Dimensions from "constants/Dimensions";
import { useEffect, useRef } from "react";
import { usePanelContext } from "context/PanelContextProvider";
import { Workout } from "components/Content/WorkoutTable/types";

const examplaryWorkout: Workout = {
  name: "Full Body Workout",
  date: new Date(),
  exercises: [
    {
      name: "Bench Press",
      description: "A great exercise for chest and triceps.",
      sets: [
        { reps: 10, weight: 100 },
        { reps: 8, weight: 110 },
      ],
    },
    {
      name: "Squats",
      description: "A great exercise for legs and glutes.",
      sets: [
        { reps: 15, weight: 150 },
        { reps: 8, weight: 160 },
      ],
    },
    {
      name: "Deadlift",
      description: "Targets the entire posterior chain.",
      sets: [
        { reps: 10, weight: 180 },
        { reps: 6, weight: 200 },
      ],
    },
    {
      name: "Pull Ups",
      description: "Excellent for back and biceps.",
      sets: [
        { reps: 12, weight: 0 },
        { reps: 8, weight: 0 },
      ],
    },
  ],
};

export default function App() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();
  const { panelToggled, togglePanel } = usePanelContext();

  const panelMoveAnim = useRef(new Animated.Value(0)).current;
  const panelWidthAnim = useRef(new Animated.Value(0)).current;
  const contentMarginAnim = useRef(new Animated.Value(0)).current;
  const panelAnimDuration = 300;

  // Panel toggle animations
  useEffect(() => {
    Animated.parallel([
      Animated.timing(panelMoveAnim, {
        toValue: panelToggled
          ? 0
          : Platform.OS === "ios" || Platform.OS === "android"
          ? -width
          : -Dimensions.web.panelWidth,
        duration: panelAnimDuration,
        useNativeDriver: true,
      }),
      Animated.timing(panelWidthAnim, {
        toValue: panelToggled ? Dimensions.web.panelWidth : 0,
        duration: panelAnimDuration,
        useNativeDriver: false,
      }),
      Animated.timing(contentMarginAnim, {
        toValue: panelToggled ? Dimensions.web.panelWidth : 0,
        duration: panelAnimDuration,
        useNativeDriver: false,
      }),
    ]).start();
  }, [panelToggled]);

  return (
    <View
      style={{
        backgroundColor:
          theme === "light" ? Colors.light.background : Colors.dark.background,
        height: height,
        width: width,
        paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
      }}
    >
      <Pressable onPress={Keyboard.dismiss}>
        <Header />
      </Pressable>
      <StatusBar style="auto" />
      <View style={styles.body}>
        <Animated.View
          style={[
            styles.panel,
            {
              width:
                Platform.OS === "ios" || Platform.OS === "android"
                  ? width - 20
                  : Dimensions.web.panelWidth,
              borderRightWidth:
                Platform.OS !== "ios" && Platform.OS !== "android" ? 1 : 0,
              transform: [{ translateX: panelMoveAnim }],
            },
          ]}
        >
          <Panel />
        </Animated.View>
        <Animated.View
          style={[styles.content, { marginLeft: contentMarginAnim }]}
        >
          <Content
            name={examplaryWorkout.name}
            date={examplaryWorkout.date}
            exercises={examplaryWorkout.exercises}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    flexDirection: "row",
  },
  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    height: "100%",
    flexDirection: "row",
    borderRightColor: Colors.global.themeColorSecond,
  },
  content: {
    flex: 1,
    flexDirection: "row",
  },
});
