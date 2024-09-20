
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { useTheme } from "@/components//ThemeProvider";

interface SwitchProps {
  onValueChange: () => void
  value: boolean
  trackColor?: string
  thumbColor?: string
  animated?: boolean
}

export default function Switch(props: SwitchProps) {
  const { theme, toggleTheme } = useTheme();
  const moveAnim = useRef(new Animated.Value(0)).current;
  const animatedColor = useRef(new Animated.Value(0)).current;

  const interpolatedColor = animatedColor.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgb(223, 223, 223)", "rgb(85, 85, 85)"]
  });

  useEffect(() => {
    Animated.timing(moveAnim, {
      toValue: props.value ? 21 : 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
    Animated.timing(animatedColor, {
      toValue: props.value ? 1 : 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [theme]);

  return (
    <View style={styles.container} >
      <Pressable onPress={props.onValueChange} >
        <Animated.View
          style={[styles.shell, {backgroundColor: interpolatedColor}]}
        >
          <Animated.View
            style={[
              styles.circle,
              { transform: [{ translateX: moveAnim }]} 
            ]} 
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 20,
    alignContent: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  shell: {
    width: 40,
    height: 20,
    justifyContent: "center",
    borderRadius: 9, 
    borderWidth: 1,
    borderColor: "black",
    padding: 1,
  },
  circle: {
    width: "40%",
    aspectRatio: 1,
    backgroundColor: "#ea6",
    borderRadius: 9, 
    borderWidth: 1,
    borderColor: "#d59555"
  }
});