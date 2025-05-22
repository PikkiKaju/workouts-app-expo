import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Platform,
  StyleSheet,
  Animated,
  Text as DefaultText,
} from "react-native"
import { View } from "../../UI/Themed";
import DatePicker from "../../DatePicker/DatePicker";
import { useTheme } from "../../Providers/ThemeProvider";
import Colors from "@/constants/Colors";

import MenuButton, { MenuItem } from "./MenuButton"; 
import DescriptionInput from "./DescriptionInput"; 
import WorkoutNameInput from "./WorkoutNameInput";
import DescriptionToggle from "./DescriptionToggle";
import { useResponsiveLayout } from "../../Hooks/useResponsiveLayout"; 
import { useWorkoutForm } from "../../Hooks/useWorkoutForm"; 


interface ContentHeaderProps {
  name: string 
}

const textFontSizeMobile = 22;
const textFontSizeWeb = 18;
const textFontSize = Platform.OS === "web" ? textFontSizeWeb : textFontSizeMobile;


export default function ContentHeader(props: ContentHeaderProps) {
  const { theme } = useTheme(); 
  const { isRowLayout, handleLayout } = useResponsiveLayout();
  const {
    refs,
    workoutName, workoutDate, workoutDescription,
    handleWorkoutNameChange, saveWorkoutName,
    handleWorkoutDateChange,
    setWorkoutDescription, saveWorkoutDescription,
    requestFocusNameInput, requestFocusDateInput, requestFocusDescriptionInput,
  } = useWorkoutForm();

  const [descriptionToggled, setDescriptionToggled] = useState(true);
  // State and refs for DatePicker "Saved" message
  const [isDateSavedVisible, setIsDateSavedVisible] = useState(false);
  const dateFadeAnim = useRef(new Animated.Value(0)).current;
  const dateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 

  function toggleDescription() {
    setDescriptionToggled(!descriptionToggled);
  }
  
  function deleteWorkout() {
    console.log("Delete workout action (implement logic)");
    // Add logic to delete the workout
  }

  // Cleanup for DatePicker "Saved" message animation
  useEffect(() => {
    return () => {
      if (dateTimeoutRef.current) {
        clearTimeout(dateTimeoutRef.current);
      }
      dateFadeAnim.stopAnimation();
    };
  }, [dateFadeAnim]);

  const showDateSavedMessage = useCallback(() => {
    if (dateTimeoutRef.current) {
      clearTimeout(dateTimeoutRef.current);
    }
    dateFadeAnim.stopAnimation();
    setIsDateSavedVisible(true);

    Animated.timing(dateFadeAnim, {
      toValue: 1,
      duration: 200, // Short fade-in duration
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    dateTimeoutRef.current = setTimeout(() => {
      Animated.timing(dateFadeAnim, {
        toValue: 0,
        duration: 500, // Fade out duration
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setIsDateSavedVisible(false); // Hide after fade out
      });
    }, 2000); // Display for 2 seconds before starting fade out
  }, [dateFadeAnim]);

  // Define menu items for the MenuButton component
  const menuItems: MenuItem[] = [
    {
      text: "Rename",
      onPressAction: requestFocusNameInput,
    },
    {
      text: "Change date",
      onPressAction: requestFocusDateInput,
    },
    {
      text: "Edit description",
      onPressAction: requestFocusDescriptionInput,
    },
    {
      isSeparator: true,
      text: 'sep1', onPressAction: () => { }
    }, // Separator item
    {
      text: "Delete",
      onPressAction: deleteWorkout,
    },
  ];

  return(
    <View
      style={[
        styles.container,
        Platform.OS === "web" ? { marginVertical: 15 } : { marginVertical: 30 },
      ]}
      onLayout={handleLayout}
    >
      <View style={styles.visibleWrap}>
        <View style={[
          styles.inputs,
          Platform.OS === "web"
            ? { flexDirection: isRowLayout ? "row" : "column" }
            : { flexDirection: "column" },
        ]}>
          {/* Name Input */}
          <WorkoutNameInput
            inputRef={refs.nameInputRef}
            value={workoutName}
            onChangeText={handleWorkoutNameChange}
            onBlur={saveWorkoutName}
            theme={theme}
            textFontSize={textFontSize}
          />

          {/* Date Picker with Saved Message */}
          <View style={styles.datePickerContainer}>
            <DatePicker
              ref={refs.dateInputRef}
              onDateChange={(newDate) => {
                const currentDate = workoutDate; // Get current date before state update
                handleWorkoutDateChange(newDate); // Call original handler
                if (currentDate && newDate.getTime() !== currentDate.getTime()) {
                  showDateSavedMessage();
                }
              }}
              selectedDate={workoutDate}
              theme={theme}
              width={170}
              height={30}
              style={{
                ...styles.datePicker,
                fontSize: textFontSize,
                borderColorFocused: theme === "light" ? Colors.light.text : Colors.global.themeColorSecond,
              }}
            />
            {isDateSavedVisible && (
              <Animated.View
                style={[
                  styles.dateSavedMessageContainer,
                  {
                    opacity: dateFadeAnim,
                    backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background,
                  },
                ]}
              >
                <DefaultText style={[styles.dateSavedMessageText, { color: theme === 'light' ? Colors.light.tint : Colors.dark.tint, fontSize: textFontSize * 0.8 }]}>
                  Saved
                </DefaultText>
              </Animated.View>
            )}
          </View>

          {/* Description Toggle */}
          <DescriptionToggle
            toggled={descriptionToggled}
            onPress={toggleDescription}
            theme={theme}
            textFontSize={textFontSize}
          />
        </View>

        {/* Menu Button */}
        <MenuButton
          theme={theme}
          menuItems={menuItems}
        />
      </View>

      {/* Description Input Area */}
      {descriptionToggled && (
        <DescriptionInput
          inputRef={refs.descInputRef}
          theme={theme}
          value={workoutDescription}
          onChangeText={setWorkoutDescription}
          onFocus={requestFocusDescriptionInput}
          onBlur={saveWorkoutDescription}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    rowGap: 15, 
    marginHorizontal: 20, 
    padding: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.global.tableLines,
  },
  visibleWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
    justifyContent: "space-between",
    zIndex: 10,
  },
  inputs: {
    flex: 1, 
    rowGap: 15,
    columnGap: 30, 
    marginRight: 15, 
  },
  datePickerContainer: {
    position: 'relative',
  },
  datePicker: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: "transparent", // Default border color when not focused
    backgroundColor: "transparent", 
    paddingTop: 3,
    minWidth: 150, 
  },
  dateSavedMessageContainer: {
    position: 'absolute',
    right: 0, 
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none', // So it doesn't interfere with DatePicker interactions
    paddingHorizontal: 6,
    borderRadius: 5,
    zIndex: 15,
  },
  dateSavedMessageText: {
    fontWeight: 'bold',
  },
});
