
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  useWindowDimensions
} from 'react-native';

import { useTheme } from '@/components/ThemeProvider';
import { View } from '@/components/Themed';
import Header from '@/components/Header';
import Panel from '@/components/panel/Panel';
import Colors from '@/constants/Colors';

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
