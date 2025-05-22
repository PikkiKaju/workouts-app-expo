import React, { useState, useCallback } from "react";
import {
  Platform,
  StyleSheet,
} from "react-native"
import { View } from "../../UI/Themed";
import DatePicker from "../../DatePicker/DatePicker";
import { useTheme } from "../../Providers/ThemeProvider";
import Colors from "@/constants/Colors";

// import WorkoutData from "@/data/sample_workout_data/workout_data.json";
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

   function toggleDescription() {
    setDescriptionToggled(!descriptionToggled);
  }
  
    function deleteWorkout() {
    console.log("Delete workout action (implement logic)");
    // Add logic to delete the workout
  }

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

          {/* Date Picker */}
          <DatePicker
            ref={refs.dateInputRef}
            onDateChange={handleWorkoutDateChange}
            selectedDate={workoutDate}
            theme={theme}
            width={170}
            height={30} // Consider making height dynamic or using padding
            style={{ 
              ...styles.datePicker,
              fontSize: textFontSize, // Ensure font size is consistent
              borderColorFocused: theme === "light" ? Colors.light.text : Colors.global.themeColorSecond, 
            }}
          />

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
  datePicker: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: "transparent", // Default border color when not focused
    backgroundColor: "transparent", 
    paddingTop: 3,
    minWidth: 150, 
  },
});
