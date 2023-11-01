
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { Text, View, TextInput } from '../Themed';
import DatePicker from '../DatePicker';
import { useTheme } from '../ThemeProvider';
import Colors from '@/constants/Colors';


export default function NewWorkoutWindow() {
  const { theme, toggleTheme } = useTheme();
  const [ isInputValid, setIsInputValid ] = useState(true);
  const [ isTextInputFocused, setIsTextInputFocused ] = useState(false);

  function validateInput(input: string) {
    if (input.includes("<") || input.includes(">")) {
      setIsInputValid(false);
    } else {
      setIsInputValid(true);
    } 
  } 

  return (
    <View theme={theme} style={[
      styles.container,
      {
        borderColor: theme === "light" ? Colors.global.themeColorFirst : Colors.global.themeColorSecond
      }
    ]}>
      <TextInput
        theme={theme}
        style={[
          styles.inputs,
          styles.textInput,
          isTextInputFocused ? styles.inputFocused : styles.inputUnfocused,
          Platform.OS === "web"
            ?
            //@ts-ignore 
            { outline: "none" }
            : null,
        ]}
        inputMode="text"
        placeholder="Workout name"
        autoComplete="off"
        onChangeText={validateInput}
        onFocus={() => setIsTextInputFocused(true)}
        onBlur={() => setIsTextInputFocused(false)}
      />
      <DatePicker
        theme={theme}
        width={styles.inputs.width}
        height={styles.inputs.height}
        style={styles.dateInput}
      />
      <View style={styles.lowerSection}>
        <View style={styles.validationSection}>
          {
            isInputValid
              ? null
              : <Text style={styles.validationText}>Can't use: {"<"} or {">"}</Text>
          }
        </View>
        <Pressable style={styles.submit}>
          <Text style={styles.submitText}>Add</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: -1,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 8,
    width: 300,
    padding: 10,
  },
  inputs: {
    width: "100%",
    height: 30,
  },
  textInput: {
    borderRadius: 3,
    padding: 3,
    marginBottom: 10,
  },
  dateInput: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 3,
  },
  inputUnfocused: {
    borderColor: "#999",
    borderWidth: 1,
  },
  inputFocused: {
    borderColor: "#CCC",
    borderWidth: 2,
    padding: 2,
  },
  lowerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  validationSection: {
    height: 30,
    justifyContent: "center",
    alignItems: "flex-start",

  },
  validationText: {
    color: "red",
    fontFamily: "Comfortaa",
    textAlign: "center",
    fontSize: 15,
  },
  workoutDate: {

  },
  submit: {
    justifyContent: "center",
    right: 0,
    width: 60,
    height: 25,
    backgroundColor: "#F99",
    borderWidth: 1,
    borderRadius: 3,
  },
  submitText: {
    color: "black",
    fontFamily: "Comfortaa",
    textAlign: "center",
    fontSize: 15,
  },
});