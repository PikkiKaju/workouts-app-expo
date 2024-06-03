
import { StatusBar } from 'expo-status-bar';
import {
  Animated,
  Platform,
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import { useTheme } from '@/components/ThemeProvider';
import { View } from '@/components/Themed';
import Header from '@/components/Header';
import Panel from '@/components/Panel/Panel';
import Colors from '@/constants/Colors';
import PanelToggler from '@/components/Panel/PanelToggler';

export default function App() {
  const { height, width, scale, fontScale } = useWindowDimensions();
  const { theme, toggleTheme } = useTheme();

  return (
    <View style={{
      backgroundColor: theme === "light" ? "#FFF" : Colors.dark.background,
      height: height,
      width: width
    }} >
      <Header />
      <StatusBar style="auto" />
      <View style={styles.body}>
        <Panel />
        { Platform.OS !== "ios" && Platform.OS !== "android" 
          ? <PanelToggler /> : null }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  body: {
    flex: 1,
    flexDirection: "row",
  },
});
