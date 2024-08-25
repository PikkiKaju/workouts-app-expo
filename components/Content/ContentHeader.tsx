import React, { Component, useContext, useRef, useState } from "react";
import { Animated, Platform, Pressable, StyleSheet } from "react-native";
import { Text, TextInput, View } from "../Themed";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import DatePicker from "../DatePicker";
import { useTheme } from "../ThemeProvider";
import Colors from "@/constants/Colors";

interface ContentHeaderProps {
  name: string
  date: Date
}

const menuButtonSize = 30;
const description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "

export default function ContentHeader(props: ContentHeaderProps) {
  const nameInputRef = useRef<any>();
  const dateInputRef = useRef<any>();
  const descInputRef = useRef<any>();
  const [descriptionHeight, setDescriptionHeight] = useState(40);

  const { theme, toggleTheme } = useTheme();
  const [nameInputFocused, setNameInputFocused] = useState(false);
  const [descriptionToggled, setDescriptionToggled] = useState(true);
  const [menuToggled, setMenuToggled] = useState(false);

  const [workoutName, setWorkoutName] = useState("Name");
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [workoutDescription, setWorkoutDescription] = useState(description);

  function toggleMenu() {
    setMenuToggled(menuToggled ? false : true);
  }

  function changeWorkoutName() {

  }

  function changeWorkoutDate() {

  }

  function changeWorkoutDesription() {

  }

  function deleteWorkout() {

  }

  function onDescriptionChange(height: number) {
    setDescriptionHeight(height);
    console.log(height);
    
  } 

  return(
    <View style={[
      styles.container,
      { maxHeight: 120 + descriptionHeight},
      Platform.OS === "web" ? { marginVertical: 15 } : { marginVertical: 30 },
    ]}>
      <View style={styles.visibleWrap}>
        <View style={[
          styles.inputs,
          Platform.OS === "web" ? { flexDirection: "row" } : { flexDirection: "column" },
        ]}>
          <Pressable
            style={[
              styles.namePressable,
              { borderColor: nameInputFocused ? theme === "light" ? "#000" : Colors.global.themeColorSecond : "transparent" }
            ]}
            onFocus={() => setNameInputFocused(true)}
            onBlur={() => setNameInputFocused(false)}
          >
            <AntDesign 
              name="edit" 
              size={24} 
              color={theme === "light" ? "black" : "white"} 
            />
            <TextInput
              ref={nameInputRef}
              theme={theme}
              style={[
                styles.nameInput,
                Platform.OS === "web" //@ts-ignore
                  ? { outline: "none" } : null,                
              ]}
              defaultValue={workoutName}
              onKeyPress={() => { }}
              inputMode="text"
              returnKeyType='google'
              onFocus={() => setNameInputFocused(true)}
              onBlur={() => setNameInputFocused(false)}
              blurOnSubmit={true}
              onEndEditing={changeWorkoutName}
            />
          </Pressable>
          <DatePicker
            ref={dateInputRef}
            onDateChange={() => {changeWorkoutDate}}
            selectedDate={workoutDate}
            theme={theme} 
            width={150} 
            height={30}
            style={{
              ...styles.datePicker, 
              borderColorFocused: theme === "light" ? "#000" : Colors.global.themeColorSecond,
            }}
          />
        </View>
        <View style={ styles.menuWrap }>
          <Pressable
            onPress={toggleMenu}
            style={[
              styles.menuButton,
              menuToggled ? theme === "light" ? { backgroundColor: "#CCC" } :  { backgroundColor: "#444" } : null
            ]}>
            <MaterialCommunityIcons 
              name="dots-horizontal" 
              size={menuButtonSize} 
              color={theme === "light" ? "black" : "white"}
            />
          </Pressable>
          {menuToggled ?
          <View style={[
            styles.menu,
            theme === "light" ? { backgroundColor: "#FBFBFB" } : { backgroundColor: "#444" },
            theme === "light" ? { borderColor: Colors.global.tableLines } : { borderColor: "#333" }
          ]}>
            <Pressable
              onPress={() => nameInputRef.current.focus()}
              style={({ pressed }) => [
                styles.menuElem,
                pressed ? theme === "light" ? { backgroundColor: "#CCC" } : { backgroundColor: "#666" } : null 
              ]}
            >
              <Text theme={theme} style={styles.menuText}>Rename</Text>
            </Pressable>
            <Pressable
              onPress={() => dateInputRef.current.focus()} // Not yet implemented in DatePicker
              style={({ pressed }) => [
                styles.menuElem,
                pressed ? theme === "light" ? { backgroundColor: "#CCC" } : { backgroundColor: "#666" } : null 
              ]}
            >
              <Text theme={theme} style={styles.menuText}>Change date</Text>
            </Pressable>
            <Pressable
              onPress={() => descInputRef.current.focus()}
              style={({ pressed }) => [
                styles.menuElem,
                pressed ? theme === "light" ? { backgroundColor: "#CCC" } : { backgroundColor: "#666" } : null 
              ]}
            >
              <Text theme={theme} style={styles.menuText}>Edit description</Text>
            </Pressable>
            <View style={styles.menuElem}>
              <View style={styles.menuLine}></View>
            </View>
              <Pressable
                onPress={deleteWorkout}
                style={({ pressed }) => [
                  styles.menuElem,
                  pressed ? theme === "light" ? { backgroundColor: "#CCC" } : { backgroundColor: "#666" } : null 
                ]}
              >
              <Text theme={theme} style={styles.menuText}>Delete</Text>
            </Pressable>
          </View> : null }
        </View>
      </View>
      {descriptionToggled ?
        <View style={[
          styles.description,
          Platform.OS === "web" ? { width: "50%" } : { width: "100%" } ,
        ]}>
          <TextInput
            ref={descInputRef}
            theme={theme}
            style={[
              styles.nameInput,
              { height: Math.max(40, descriptionHeight) },
              Platform.OS === "web" //@ts-ignore
                ? { outline: "none" } : null,
            ]}
            value={workoutDescription}
            onKeyPress={() => { }}
            inputMode="text"
            returnKeyType='send'
            onFocus={() => { }}
            onBlur={() => { }}
            blurOnSubmit={true}
            onEndEditing={changeWorkoutDesription}
            multiline={true}
            onChangeText={(newDesc) => setWorkoutDescription(newDesc) }
            onContentSizeChange={(event) => onDescriptionChange(event.nativeEvent.contentSize.height)}
          />
      </View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignContent: "flex-start",
    rowGap: 20,
    margin: 20,
    padding: 5,
    borderBottomWidth: 1,
    borderColor: Colors.global.tableLines,
    height: "auto",
  },
  visibleWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  inputs: {
    flex: 1,
    rowGap: 10,
  },
  namePressable: {
    flexDirection: "row",
    columnGap: 10,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
  },
  nameInput: {
    fontSize: 18,
  },
  datePicker: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    fontSize: 18,
  },
  description: {
    zIndex: 9,
    fontSize: 15,
  },
  menuWrap: {
    zIndex: 10,
  },
  menuButton: {
    borderRadius: 5,
  },
  menu: {
    position: "absolute",
    top: menuButtonSize + 5,
    right: 0,
    width: 150,
    padding: 5,
    zIndex: 11,
    borderWidth: 1,
    borderRadius: 5,
  },
  menuElem: {
    flex: 1,
    marginVertical: 2,
    padding: 4,
    borderRadius: 4,
    textAlign: "center",
  },
  menuText: {
    fontSize: 16,
  },
  menuLine: {
    height: 1,
    backgroundColor: "#AAA",
    marginVertical: 5,
  },
});





