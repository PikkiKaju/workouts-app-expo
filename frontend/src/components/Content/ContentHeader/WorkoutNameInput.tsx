import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
} from "react-native";
import { TextInput } from "components/UI/Themed";
import { AntDesign } from "@expo/vector-icons";
import Colors from "constants/Colors";

interface WorkoutNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  inputRef: React.RefObject<RNTextInput | null>;
  theme: "light" | "dark";
  textFontSize: number;
}

export default function WorkoutNameInput({
  value,
  onChangeText,
  onBlur,
  inputRef,
  theme,
  textFontSize,
}: WorkoutNameInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Pressable
      style={[
        styles.namePressable,
        {
          borderColor: isFocused
            ? theme === "light"
              ? Colors.light.text
              : Colors.global.themeColorSecond
            : "transparent",
        },
      ]}
      onPress={() => inputRef.current?.focus()}
    >
      <AntDesign
        name="edit"
        size={24}
        color={theme === "light" ? Colors.light.text : Colors.dark.text}
      />
      <TextInput
        ref={inputRef}
        theme={theme}
        style={[
          styles.nameInput,
          { fontSize: textFontSize },
          //@ts-ignore
          Platform.OS === "web" ? { outlineStyle: "none" } : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        inputMode="text"
        returnKeyType="done"
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  namePressable: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    borderBottomWidth: 1,
  },
  nameInput: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
});
