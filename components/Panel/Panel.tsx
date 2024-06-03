
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';

import { useTheme } from '@/components/ThemeProvider';
import { View } from '../Themed';
import Colors from '@/constants/Colors';
import NewWorkoutWindow from './NewWorkoutWindow';
import { NewWorkoutWindowToggler } from './NewWorkoutWindowToggler';
import WorkoutList from './WorkoutList';
import Dimensions from '@/constants/Dimensions';


export default function Panel() {
  const { theme, toggleTheme } = useTheme();
  const [isNewWorkoutWindowOpen, setIsNewWorkoutWindowOpen] = useState(false);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState(1);
  const moveAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;
  const animDuration = 300;

  const toggleNewWorkoutWindow = () => {
    if (isNewWorkoutWindowOpen) {
      setIsNewWorkoutWindowOpen(false);
    } else {
      setIsNewWorkoutWindowOpen(true);
    }
  }

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isNewWorkoutWindowOpen ? 140 : 0,
      duration: animDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(moveAnim, {
      toValue: isNewWorkoutWindowOpen ? 0 : -200,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
    Animated.timing(opacityAnim, {
      toValue: isNewWorkoutWindowOpen ? 1 : 0,
      duration: animDuration,
      useNativeDriver: true,
    }).start();
  }, [isNewWorkoutWindowOpen]);

  return (
    <View style={[
      styles.container,
      {
        width: Platform.OS === ("ios" || "android")
          ? "100%"
          : Dimensions.web.panelWidth
      }
    ]}>
      <View style={styles.newWorkoutWindowSection}>
        <Animated.View style={[
          {
            opacity: opacityAnim,
            transform: [{ translateY: moveAnim }],
            maxHeight: (Platform.OS !== "ios" && Platform.OS !== "android")
              ? heightAnim
              : isNewWorkoutWindowOpen ? 500 : 0,
          },

        ]}>
          <NewWorkoutWindow />
        </Animated.View>
        <NewWorkoutWindowToggler
          theme={theme}
          isNewWorkoutWindowOpen={isNewWorkoutWindowOpen}
          toggleNewWorkoutWindow={toggleNewWorkoutWindow}
        />
      </View>
      <WorkoutList selectedWorkoutID={selectedWorkoutID} setSelectedWorkoutID={setSelectedWorkoutID} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: Colors.global.themeColorSecond,
    overflow: "hidden",
  },
  newWorkoutWindowSection: {
    flex: -1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
    zIndex: 10,
  },
});


