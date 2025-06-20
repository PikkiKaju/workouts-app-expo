import React, { useState, useRef, useEffect } from "react";
import {
  TextInput as RNTextInput,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInputFocusEventData,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
  InputAccessoryView,
  Button,
  Keyboard,
  View as RNView,
} from "react-native";
import { TextInput } from "components/UI/Themed";
import Colors from "constants/Colors";

interface DescriptionInputProps
  extends Omit<
    TextInputProps,
    | "onChangeText"
    | "style"
    | "multiline"
    | "scrollEnabled"
    | "onContentSizeChange"
  > {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onBlur?: () => void;
  onPress?: () => void;
  theme: "light" | "dark";
  inputRef?: React.RefObject<RNTextInput | null>;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  placeholder?: string;
  placeholderTextColor?: string;
}

const inputAccessoryViewID = "descriptionInputAccessoryView";

export default function DescriptionInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onPress,
  theme,
  inputRef,
  style,
  containerStyle,
  placeholder = "Add description here...",
  placeholderTextColor,
  ...restProps
}: DescriptionInputProps) {
  const [inputHeight, setInputHeight] = useState<number | undefined>(undefined);
  const previousLengthRef = useRef(value?.length ?? 0);

  // Update previous length ref if the value prop changes externally
  useEffect(() => {
    previousLengthRef.current = value?.length ?? 0;
    // Reset height if value becomes empty externally? Optional.
    if (!value) {
      setInputHeight(undefined);
    }
  }, [value]);

  // Handler for content size changes (expansion)
  function handleContentSizeChange(
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) {
    const newHeight = event.nativeEvent.contentSize.height;
    setInputHeight(newHeight);
  }

  // Handler for text changes (handles shrinking)
  function handleChangeText(newText: string) {
    const currentLength = newText.length;
    const previousLength = previousLengthRef.current;

    // Update parent state first
    onChangeText(newText);

    // --- Only reset height if text length decreased ---
    if (currentLength < previousLength) {
      setInputHeight(undefined); // Reset height to allow recalculation on shrink
    }

    // Update the ref *after* comparison
    previousLengthRef.current = currentLength;
  }

  const handleDonePress = () => {
    if (onBlur) {
      onBlur(); // Trigger the save/blur action
    }
    Keyboard.dismiss();
  };

  const defaultPlaceholderColor =
    theme === "light" ? Colors.light.textMuted : Colors.dark.textMuted;

  return (
    <>
      <TextInput
        ref={inputRef}
        theme={theme}
        style={[
          styles.descriptionInput,
          //@ts-ignore
          Platform.OS === "web" ? { outlineStyle: "none" } : null,
          inputHeight !== undefined ? { height: inputHeight } : {},
          style,
        ]}
        value={value}
        onChangeText={handleChangeText}
        onContentSizeChange={handleContentSizeChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onPress={onPress}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
        inputMode="text"
        returnKeyType="done"
        multiline={true}
        scrollEnabled={false}
        textAlignVertical="top"
        submitBehavior="newline"
        onSubmitEditing={handleDonePress}
        inputAccessoryViewID={
          Platform.OS === "ios" ? inputAccessoryViewID : undefined
        }
        {...restProps}
      />
      {Platform.OS === "ios" && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <RNView
            style={[
              styles.accessoryView,
              {
                backgroundColor:
                  theme === "light"
                    ? Colors.light.backgroundAccessory
                    : Colors.dark.backgroundAccessory,
                borderTopColor:
                  theme === "light" ? Colors.light.border : Colors.dark.border,
              }, // Assuming Colors.light/dark.border exists
            ]}
          >
            <Button
              onPress={handleDonePress}
              title="Done"
              color={theme === "light" ? Colors.light.tint : Colors.dark.tint}
            />
          </RNView>
        </InputAccessoryView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  descriptionInput: {
    fontSize: 15,
    padding: 8,
    textAlignVertical: "top",
  },
  accessoryView: {
    padding: 4,
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
