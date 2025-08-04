import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native"
import { View } from "@/components/UI/Themed";
import DatePicker from "@/components/DatePicker/DatePicker";
import { useTheme } from "@/components/Providers/ThemeProvider";
import Colors from "@/constants/Colors";

import MenuButton from "./MenuButton";
import { MenuItem } from "./Menu";
import WorkoutNameInput from "./WorkoutNameInput";
import DescriptionToggle from "./DescriptionToggle";
import { useResponsiveLayout } from "@/components/Hooks/useResponsiveLayout"; 
import { useWorkoutForm } from "@/components/Hooks/useWorkoutForm"; 
import AutoExpandingTextInput from "@/components/UI/AutoExpandingTextInput";
import { useTranslation } from "react-i18next";


interface ContentHeaderProps {
  name: string 
}

const textFontSizeMobile = 22;
const textFontSizeWeb = 18;
const textFontSize = Platform.OS === "web" ? textFontSizeWeb : textFontSizeMobile;


export default function ContentHeader(props: ContentHeaderProps) {
  const { theme } = useTheme(); 
  const { t } = useTranslation();
  const { isRowLayout, handleLayout } = useResponsiveLayout();
  const {
    refs,
    workoutName, workoutDate, workoutDescription,
    handleWorkoutNameChange, saveWorkoutName,
    handleWorkoutDateChange,
    setWorkoutDescription, saveWorkoutDescription,
    deleteWorkout,
    requestFocusNameInput, requestFocusDateInput, requestFocusDescriptionInput,
  } = useWorkoutForm();

  const [descriptionToggled, setDescriptionToggled] = useState(true);

   function toggleDescription() {
    setDescriptionToggled(!descriptionToggled);
  }
  
  // Define menu items for the MenuButton component
  const menuItems: MenuItem[] = [
    {
      text: t('content.header.menu.edit_name'),
      onPressAction: requestFocusNameInput,
    },
    {
      text: t('content.header.menu.edit_date'),
      onPressAction: requestFocusDateInput,
    },
    {
      text: t('content.header.menu.edit_description'),
      onPressAction: requestFocusDescriptionInput,
    },
    {
      isSeparator: true,
      text: 'sep1', onPressAction: () => { }
    }, // Separator item
    {
      text: t('content.header.menu.delete.title'),
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
            height={30} 
            style={{ 
              ...styles.datePicker,
              fontSize: textFontSize, 
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
        <AutoExpandingTextInput
          inputRef={refs.descInputRef}
          theme={theme}
          style={[
            //@ts-ignore
            Platform.OS === "web" ? { outlineStyle: "none" } : null
          ]}
          value={workoutDescription}
          placeholder={t('content.header.description_input_placeholder')}
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
    padding: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.global.tableLines,
    zIndex: 2,
  },
  visibleWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 5,
    justifyContent: "space-between",
  },
  inputs: {
    flex: 1, 
    rowGap: 15,
    columnGap: 30, 
    marginRight: 15, 
  },
  datePicker: {
    flexDirection: "row-reverse",
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: "transparent", // Default border color when not focused
    backgroundColor: "transparent", 
    paddingTop: 3,
    minWidth: 150, 
  },
});
