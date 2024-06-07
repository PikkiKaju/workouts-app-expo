import React, { Component, useContext, useState } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";
import { Text, TextInput, View } from "../Themed";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import DatePicker from "../DatePicker";
import { useTheme } from "../ThemeProvider";

interface ContentHeaderProps {
  name: string
  date: Date
}

export default function ContentHeader(props: ContentHeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [ menuToggled, setMenuToggled] = useState(false);

  function toggleMenu() {
    setMenuToggled(menuToggled ? false : true);
  }

  return(
    <View style={ styles.container }>
      <Pressable style={styles.nameInput}>
        <AntDesign 
          name="edit" 
          size={24} 
          color={theme === "light" ? "black" : "white"} 
        />
        <TextInput defaultValue="anem" />
      </Pressable>
      <DatePicker theme={theme} width={200} height={20} 
        style={styles.datePicker}
      />
      <View>
        <Pressable>
          <MaterialCommunityIcons 
            name="dots-horizontal" 
            size={24} 
            color={theme === "light" ? "black" : "white"}
          />
        </Pressable>
        <View style={styles.menu}>
          <Pressable style={styles.menuElem}>
            <Text>Rename</Text>
          </Pressable>
          <Pressable style={styles.menuElem}>
            <Text>Change date</Text>
          </Pressable>
          <Pressable style={styles.menuElem}>
            <Text>Edit description</Text>
          </Pressable>
          <View style={styles.menuLine}></View>
          <Pressable style={styles.menuElem}>
            <Text>Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    margin: 20,
    paddingHorizontal: 5, 
  },
  nameInput: {
    flexDirection: "row",
  },
  datePicker: {
    borderWidth: 0,
    backgroundColor: "transparent",
  },
  menu: {

  },
  menuElem: {

  },
  menuLine: {

  },
});





