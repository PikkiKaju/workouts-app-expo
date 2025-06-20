import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Animated } from "react-native";

interface AnimatedArrowProps {
  direction: "up" | "down" | "left" | "right"
  size: number
  color: string
  onPress?: () => void 
  toggled?: boolean
}

export default function AnimatedArrow(props: AnimatedArrowProps) {
  const [isToggled, setIsToggled] = useState(props.toggled ?? false);
  const transformAnim = useRef(new Animated.Value(props.toggled ? 1 : 0)).current;

  function toggleButton() {
    if (isToggled) {
      setIsToggled(false);
    } else {
      setIsToggled(true);
    }
  }

  const interpolatedAnim = transformAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"]
  });

  useEffect(() => {
    Animated.timing(transformAnim, {
      toValue: isToggled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isToggled]);

  useEffect(() => {
    if (props.toggled !== undefined) {
      setIsToggled(props.toggled);
    }
  }, [props.toggled]);

  return (
    <Pressable
      style={[styles.button, { height: props.size, width: props.size }]}
      onPress={() => {
        toggleButton();
        if (props.onPress) {
          props.onPress();
        }
      }}
    >
      <Animated.View
        style={{
          transform: props.direction === "up" || props.direction === "down"
            ? [{ rotateX: interpolatedAnim }]
            : [{ rotateY: interpolatedAnim }]
        }}
      >
        <AntDesign
          name={props.direction}
          size={props.size}
          color={props.color}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "transparent",
  },
}); 
