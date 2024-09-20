
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';

import { useTheme } from '@/components/Providers/ThemeProvider';
import { View } from '@/components/UI/Themed';
import Colors from '@/constants/Colors';
import NewWorkoutWindow from './NewWorkoutWindow';
import { NewWorkoutWindowToggler } from './NewWorkoutWindowToggler';
import WorkoutList from './WorkoutList';
import Dimensions from '@/constants/Dimensions';
import { usePanelContext } from '@/components/Providers/PanelContextProvider';

export default function Panel() {
  const { theme, toggleTheme } = useTheme();
  const { panelToggled, togglePanel } = usePanelContext();
  const [isNewWorkoutWindowOpen, setIsNewWorkoutWindowOpen] = useState(false);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState(1);

  const windowMoveAnim = useRef(new Animated.Value(0)).current;
  const windowOpacityAnim = useRef(new Animated.Value(0)).current;
  const windowHeightAnim = useRef(new Animated.Value(0)).current;
  const windowAnimDuration = 300;

  // New workout window toggle animations
  useEffect(() => {
    Animated.timing(windowHeightAnim, {
      toValue: isNewWorkoutWindowOpen ? 140 : 0,
      duration: windowAnimDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(windowMoveAnim, {
      toValue: isNewWorkoutWindowOpen ? 0 : -200,
      duration: windowAnimDuration,
      useNativeDriver: true,
    }).start();
    Animated.timing(windowOpacityAnim, {
      toValue: isNewWorkoutWindowOpen ? 1 : 0,
      duration: windowAnimDuration,
      useNativeDriver: true,
    }).start();
  }, [isNewWorkoutWindowOpen]);

  const toggleNewWorkoutWindow = () => {
    if (isNewWorkoutWindowOpen) {
      setIsNewWorkoutWindowOpen(false);
    } else {
      setIsNewWorkoutWindowOpen(true);
    }
  }

  return (
    <View style={[ styles.container ]}>
      <View style={ styles.newWorkoutWindowSection }>
        <Animated.View style={[
          {
            opacity: windowOpacityAnim,
            transform: [{ translateY: windowMoveAnim }],
            maxHeight: (Platform.OS !== "ios" && Platform.OS !== "android")
              ? windowHeightAnim
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
      <WorkoutList 
        selectedWorkoutID={selectedWorkoutID} 
        setSelectedWorkoutID={setSelectedWorkoutID} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    overflow: "hidden",
    margin: 10,
  },
  newWorkoutWindowSection: {
    flex: -1,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
    margin: 20
  },
});
