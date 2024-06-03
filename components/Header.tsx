import { Platform, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import Constants from 'expo-constants';

import { Text, View } from '@/components/Themed';
import { useTheme } from '@/components//ThemeProvider';
import Switch from '@/components//Switch'

function Label({ showLabel }: { showLabel: boolean }) {
  if (showLabel) {
    return (
      <Pressable>
        <Text style={styles.label}>Add new workout</Text>
      </Pressable>
    );
  }
}

interface MyProps {
  flex?: number;
}

interface MyProps {
  style?: {
    flex?: number
  }
}

SplashScreen.preventAutoHideAsync();

export default function Header(props: MyProps) {
  const { theme, toggleTheme } = useTheme();
  
  const statusBarHeight = Constants.statusBarHeight || 0; 
  const headerHeight = 50;

  return (
    <View
      style={[
        styles.container,
        { flex: props?.style?.flex ?? -1 },
        {
          height: headerHeight + statusBarHeight
        }
      ]}
    >
      <View style={[
        styles.gradientWrapper,
        {
          height: headerHeight + statusBarHeight,
          paddingTop: Platform.OS === 'ios'
          ? statusBarHeight
          : 0,
        }
      ]}>
        <LinearGradient
          style={[styles.gradientOverlay]}
          colors={["#F66", "#F76", "#FA6", "#FB6", "#FC6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 5 }}
        />
        <View style={styles.leftSection}>
          
          <Text style={styles.title}>Puero</Text>
          <Label showLabel={true} />
        </View>
        <Switch
          onValueChange={toggleTheme}
          value={theme === "dark"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: 'center',
  },
  gradientWrapper: {
    width: '100%',
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: "row",
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
    fontFamily: "Comfortaa",
  },
});