
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, Animated } from 'react-native';

import { useTheme } from '@/components/ThemeProvider';
import { View } from '../Themed';
import Colors from '@/constants/Colors';
import NewWorkoutWindow from './NewWorkoutWindow';
import { NewWorkoutWindowToggler } from './NewWorkoutWindowToggler';
import WorkoutList from './WorkoutList';
import Dimensions from '@/constants/Dimensions';
import { usePanelContext } from '../PanelContextProvider';


export default function Panel() {
  const { theme, toggleTheme } = useTheme();
  const { panelToggled, togglePanel } = usePanelContext();
  const [isNewWorkoutWindowOpen, setIsNewWorkoutWindowOpen] = useState(false);
  const [selectedWorkoutID, setSelectedWorkoutID] = useState(1);

  const windowMoveAnim = useRef(new Animated.Value(0)).current;
  const windowOpacityAnim = useRef(new Animated.Value(0)).current;
  const windowHeightAnim = useRef(new Animated.Value(0)).current;
  const windowpanelAnimDuration = 300;

  const panelMoveAnim = useRef(new Animated.Value(0)).current;
  const panelWidthAnim = useRef(new Animated.Value(0)).current;
  const panelAnimDuration = 300;

  useEffect(() => {
    Animated.timing(panelWidthAnim, {
      toValue: panelToggled ? Dimensions.web.panelWidth : 0,
      duration: panelAnimDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(panelMoveAnim, {
      toValue: panelToggled ? 0 : -Dimensions.web.panelWidth,
      duration: panelAnimDuration,
      useNativeDriver: true,
    }).start();
  }, [panelToggled]);

  useEffect(() => {
    Animated.timing(windowHeightAnim, {
      toValue: isNewWorkoutWindowOpen ? 140 : 0,
      duration: windowpanelAnimDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(windowMoveAnim, {
      toValue: isNewWorkoutWindowOpen ? 0 : -200,
      duration: windowpanelAnimDuration,
      useNativeDriver: true,
    }).start();
    Animated.timing(windowOpacityAnim, {
      toValue: isNewWorkoutWindowOpen ? 1 : 0,
      duration: windowpanelAnimDuration,
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
    <Animated.View style={[
      styles.container,
      {
        width: Platform.OS === ("ios" || "android")
          ? "100%"
          : Dimensions.web.panelWidth,
        transform: [{ translateX: panelMoveAnim }],
        maxWidth: (Platform.OS !== "ios" && Platform.OS !== "android")
          ? panelWidthAnim
          : panelToggled ? Dimensions.web.panelWidth : 0,
      },
    ]}>
      <View style={styles.newWorkoutWindowSection}>
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
      <WorkoutList selectedWorkoutID={selectedWorkoutID} setSelectedWorkoutID={setSelectedWorkoutID} />
    </Animated.View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
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


