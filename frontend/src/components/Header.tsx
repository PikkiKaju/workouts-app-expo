import { Platform, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons";

import { Text, View } from "components/UI/Themed";
import { useTheme } from "providers/ThemeProvider";
import Switch from "components/UI/Switch";
import { usePanelContext } from "providers/PanelContextProvider";

function Label({ showLabel }: { showLabel: boolean }) {
  if (showLabel) {
    return (
      <Pressable>
        <Text style={styles.label}>Add new workout</Text>
      </Pressable>
    );
  }
}

interface HeaderProps {
  style?: {
    flex?: number;
  };
}

SplashScreen.preventAutoHideAsync();

export default function Header(props: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { panelToggled, togglePanel } = usePanelContext();

  const statusBarHeight = Constants.statusBarHeight || 0;
  const headerHeight = 50;

  return (
    <View
      style={[
        styles.container,
        { flex: props?.style?.flex ?? -1 },
        {
          height: headerHeight + statusBarHeight,
        },
      ]}
    >
      <View
        style={[
          styles.gradientWrapper,
          {
            height: headerHeight + statusBarHeight,
            paddingTop: Platform.OS === "ios" ? statusBarHeight : 0,
          },
        ]}
      >
        <LinearGradient
          style={[styles.gradientOverlay]}
          colors={["#F66", "#F76", "#FA6", "#FB6", "#FC6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 5 }}
        />
        <View style={styles.leftSection}>
          <Pressable onPress={togglePanel}>
            <Feather name="menu" size={30} color="white" />
          </Pressable>
          <Text style={styles.title}>Puero</Text>
          <Label showLabel={true} />
        </View>
        <Switch onValueChange={toggleTheme} value={theme === "dark"} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  gradientWrapper: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    gap: 50,
    marginHorizontal: 20,
    backgroundColor: "transparent",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    fontSize: 15,
    fontFamily: "Comfortaa",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Comfortaa",
  },
});
