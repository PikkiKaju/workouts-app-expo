import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  LayoutChangeEvent,
  TextInput as RNTextInput 
} from "react-native"
import { Text, TextInput, View } from "../../UI/Themed";
import { AntDesign } from "@expo/vector-icons";
import DatePicker from "../../DatePicker/DatePicker";
import { useTheme } from "../../Providers/ThemeProvider";
import Colors from "@/constants/Colors";

// import WorkoutData from "@/data/sample_workout_data/workout_data.json";
import AnimatedArrow from "../../UI/AnimatedArrow";
import MenuButton, { MenuItem } from "./MenuButton"; 
import DescriptionInput from "./DescriptionInput"; 

interface ContentHeaderProps {
  name: string // This prop seems unused, consider removing or using it
}

const textFontSize = 18;
const RESPONSIVE_BREAKPOINT = 650; 


export default function ContentHeader(props: ContentHeaderProps) {
  const nameInputRef = useRef<RNTextInput>(null); 
  const dateInputRef = useRef<DatePicker>(null); 
  const descInputRef = useRef<RNTextInput>(null); 

  const { theme } = useTheme(); 
  const [nameInputFocused, setNameInputFocused] = useState(false);
  const [descriptionToggled, setDescriptionToggled] = useState(true);

  const [workoutName, setWorkoutName] = useState<string>("Workout Name");
  const [workoutDate, setWorkoutDate] = useState<Date>(new Date());
  const [workoutDescription, setWorkoutDescription] = useState<string>("");
 
  // Get header width
  const [headerWidth, setHeaderWidth] = useState<number | null>(null);

  // Determine if the layout should be row or column based on width
  const isRowLayout = headerWidth !== null && headerWidth >= RESPONSIVE_BREAKPOINT;

  // Handler for onLayout event 
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    // Only update state if the width has actually changed to avoid potential loops
    if (width !== headerWidth) {
      setHeaderWidth(width);
    }
  };

  useEffect(() => {
    getWorkoutData();
  }, [])

  function requestFocusNameInput() {
    dateInputRef.current?.blur();
    descInputRef.current?.blur();
    nameInputRef.current?.focus();  
  }
  function requestFocusDateInput() {
    nameInputRef.current?.blur();
    descInputRef.current?.blur();
    dateInputRef.current?.focus();
  }
  function requestFocusDescriptionInput() {
    nameInputRef.current?.blur();
    dateInputRef.current?.blur();
    descInputRef.current?.focus();
  }

  function toggleDescription() {
    setDescriptionToggled(!descriptionToggled);
  }
  
  function getWorkoutData() {
    // Replace with actual data fetching logic if needed
    setWorkoutName("Workout 1");
    setWorkoutDate(new Date());
    setWorkoutDescription("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ");
  }

  function changeWorkoutName() {
    console.log("Workout name changed (implement save logic)");
    // Add logic to save the workout name
  }

  function changeWorkoutDate() {
    console.log("Workout date changed (implement save logic)");
     // Add logic to save the workout date
  }

  function changeWorkoutDesription() {
    console.log("Workout description changed (implement save logic)");
    // Add logic to save the workout description
  }

  function deleteWorkout() {
    console.log("Delete workout action (implement logic)");
    // Add logic to delete the workout
  }

  function onDescriptionChange(event: any) {
    console.log(event.nativeEvent.contentSize);
  }

  // Define menu items for the MenuButton component
  const menuItems: MenuItem[] = [
    {
      text: "Rename",
      onPressAction: requestFocusNameInput,
    },
    {
      text: "Change date",
      onPressAction: requestFocusDateInput, // Assuming DatePicker exposes focus
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
          <Pressable
            style={[
              styles.namePressable,
              { borderColor: nameInputFocused ? theme === "light" ? Colors.light.text : Colors.global.themeColorSecond : "transparent" }
            ]}
            onPress={() => nameInputRef.current?.focus()} // Focus input on press
          >
            <AntDesign
              name="edit"
              size={24}
              color={theme === "light" ? Colors.light.text : Colors.dark.text } 
            />
            <TextInput
              ref={nameInputRef}
              theme={theme}
              style={[
                styles.nameInput,
                //@ts-ignore
                Platform.OS === "web"
                  ? { outlineStyle: "none" } : null, // Use outlineStyle for web
              ]}
              value={workoutName} // Use value for controlled component
              onChangeText={setWorkoutName} // Update state on change
              inputMode="text"
              returnKeyType='done'
              onFocus={() => setNameInputFocused(true)}
              onBlur={() => {
                setNameInputFocused(false);
                changeWorkoutName(); // Trigger save on blur
              }}
            />
          </Pressable>

          {/* Date Picker */}
          <DatePicker
            ref={dateInputRef}
            onDateChange={(newDate) => { // Get the new date from the callback
                setWorkoutDate(newDate);
                changeWorkoutDate(); // Trigger save logic
            }}
            selectedDate={workoutDate}
            theme={theme}
            width={150}
            height={30} // Consider making height dynamic or using padding
            style={{ 
              ...styles.datePicker,
              borderColorFocused: theme === "light" ? Colors.light.text : Colors.global.themeColorSecond, 
            }}
          />

          {/* Description Toggle */}
          <Pressable style={styles.descriptionToggle} onPress={toggleDescription}>
            <AnimatedArrow
              direction={"down"}
              size={20}
              color={theme === "light" ? Colors.light.text : Colors.dark.text} 
              onPress={toggleDescription}
              toggled={descriptionToggled}
            />
            <Text theme={theme} style={styles.descriptionText}>Description</Text>
          </Pressable>
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
          inputRef={descInputRef}
          theme={theme}
          value={workoutDescription}
          onChangeText={setWorkoutDescription}
          onFocus={requestFocusDescriptionInput}
          onBlur={changeWorkoutDesription}
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
  namePressable: {
    flexDirection: "row",
    alignItems: 'center', 
    columnGap: 10, 
    borderBottomWidth: 1,
  },
  nameInput: {
    flex: 1, 
    fontSize: textFontSize,
    paddingVertical: 0, 
    paddingHorizontal: 0,
  },
  datePicker: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: "transparent", // Default border color when not focused
    backgroundColor: "transparent", 
    fontSize: textFontSize,
    paddingTop: 3,
    minWidth: 150, 
  },
  descriptionToggle: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
  },
  descriptionText: {
    fontSize: textFontSize,
  },
});
