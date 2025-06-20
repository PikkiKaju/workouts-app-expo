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

import { useTheme } from "providers/ThemeProvider";
import { View } from "components/UI/Themed";
import Header from "components/Header";
import Panel from "components/Panel/Panel";
import Colors from "constants/Colors";
import PanelToggler from "components/Panel/PanelToggler";
import Content from "components/Content/Content";
import Dimensions from "constants/Dimensions";
import { useEffect, useRef } from "react";
import { usePanelContext } from "providers/PanelContextProvider";

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
          {Platform.OS !== "ios" && Platform.OS !== "android" ? (
            <PanelToggler />
          ) : null}
          <Content name="" date={new Date()} />
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
