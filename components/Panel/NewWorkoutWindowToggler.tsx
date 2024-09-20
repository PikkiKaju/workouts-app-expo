import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { View } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";

interface NewWorkoutWindowTogglerProps {
  theme: string
  isNewWorkoutWindowOpen: boolean
  toggleNewWorkoutWindow: () => void
}

export function NewWorkoutWindowToggler(props: NewWorkoutWindowTogglerProps) {
  const moveAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(moveAnim, {
      toValue: props.isNewWorkoutWindowOpen ? 2 : styles.toggleWindowButton.height - 5,
      duration: 200,
      useNativeDriver: false,
    }).start();    
  }, [props.isNewWorkoutWindowOpen]);

  return (
    <Pressable
      style={[
        styles.toggleWindowButton,
        {
          backgroundColor: props.theme === "light"
            ? Colors.light.background
            : Colors.dark.background
        }
      ]}
      onPress={props.toggleNewWorkoutWindow}
    >
      <View style={styles.buttonParts}>
        <View
          style={{
            position: "absolute",
            width: styles.toggleWindowButton.height - 5,
            height: 3,
            borderRadius: 1,
            backgroundColor: props.theme === "light" ? Colors.global.themeColorFirst : "white"
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            width: 3,
            height: moveAnim,
            borderRadius: 1,
            backgroundColor: props.theme === "light" ? Colors.global.themeColorFirst : "white"
          }}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggleWindowButton: {
    height: 25,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: Colors.global.themeColorFirst,
  },
  buttonParts: {
    justifyContent: "center",
    alignItems: "center",
  },
});