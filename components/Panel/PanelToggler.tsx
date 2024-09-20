import React, { useEffect, useRef, useState } from "react";
import { usePanelContext } from "@/components/Providers/PanelContextProvider";
import AnimatedArrow from "@/components/UI/AnimatedArrow";
import { useTheme } from "@/components/Providers/ThemeProvider";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";

export default function PanelToggler() {
  const { theme, toggleTheme } = useTheme();
  const { panelToggled, togglePanel } = usePanelContext();
  const [ hover, setHover ] = useState<boolean>(false); 
  const transformAnim = useRef(new Animated.Value(panelToggled ? 1 : 0)).current;

  const interpolatedAnim = transformAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"]
  });

  useEffect(() => {
    Animated.timing(transformAnim, {
      toValue: panelToggled ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [panelToggled]);

  return (
    <View style={styles.container}>
      <Pressable 
        style={[
          styles.button,
          {
            backgroundColor: hover ? theme === "dark" 
            ? "#3F3F3F" : "#FFF5F5"
            : "transparent"
          }
        ]}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        onPress={togglePanel}
      >
        <Animated.View
          style={{
            transform: [{ rotateY: interpolatedAnim }]
          }}
        >
          <AntDesign
            name={"right"}
            size={12}
            color={theme === "light" ? "black" : "white"}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: 'center',
  },
  button: {
    height: 38,
    width: 14,
    flexDirection: "row",
    alignItems: "center",
    borderTopRightRadius: 100,
    borderBottomRightRadius: 100,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderColor: Colors.global.themeColorSecond,
  }
});