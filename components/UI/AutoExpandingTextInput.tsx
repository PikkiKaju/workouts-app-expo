import React, { useState, useEffect, useRef, forwardRef, use } from "react";
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
import { TextInput } from "@/components/UI/Themed";
import Colors from "@/constants/Colors";


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
  placeholder: string;
  placeholderTextColor?: string;
  inputRef?: React.RefObject<RNTextInput | null>;
  style?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const inputAccessoryViewID = "descriptionInputAccessoryView";

export default function AutoExpandingTextInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onPress,
  theme,
  inputRef,
  style,
  containerStyle,
  placeholder,
  placeholderTextColor,
  ...restProps
}: DescriptionInputProps) {
  const [inputHeight, setInputHeight] = useState<number | undefined>(undefined);
  const previousLengthRef = useRef(value?.length ?? 0);
  const [onFocusInputValue, setOnFocusInputValue] = useState(value); 

  // Update previous length ref if the value prop changes externally
  useEffect(() => {
    previousLengthRef.current = value?.length ?? 0;
    if (!value) {
      setInputHeight(undefined);
    }
  }, [value]);

  // Handler for content size changes
  function handleContentSizeChange(
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) {
    const newHeight = event.nativeEvent.contentSize.height;
    setInputHeight(newHeight);
  }

  // Handler for text changes
  function handleChangeText(newText: string) {
    onChangeText(newText);

    setInputHeight(undefined); // Reset height to undefined to allow auto-expansion

    previousLengthRef.current = newText.length;
  }

  const handleOnFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    if (onFocus) {
      onFocus(e);
    }
    setOnFocusInputValue(e.nativeEvent.text); // Store the focused input value
  }

  const handleCancelPress = () => {
    onChangeText(onFocusInputValue); // Rewind to the previous value
    handleDonePress();
  }

  const handleDonePress = () => {
    if (onBlur) {
      onBlur(); 
    }
    Keyboard.dismiss();
  };

  return (
    <>
      <TextInput
        ref={inputRef}
        theme={theme}
        style={[
          styles.textInput,
          inputHeight !== undefined ? { height: inputHeight } : {},
          style,
        ]}
        value={value}
        onChangeText={handleChangeText}
        onContentSizeChange={handleContentSizeChange}
        onFocus={handleOnFocus}
        onBlur={onBlur}
        onPress={onPress}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor ?? Colors[theme].textMuted}
        inputMode="text"
        returnKeyType="done"
        multiline={true}
        scrollEnabled={false}
        textAlignVertical="top"
        submitBehavior="newline"
        enterKeyHint="enter"
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
                backgroundColor: Colors[theme].backgroundAccessory,
                borderTopColor: Colors[theme].border,
              }, 
            ]}
          >
            <Button
              onPress={handleCancelPress}
              title="Cancel"
              color={Colors[theme].tint}
            />
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
  textInput: {
    textAlignVertical: "top",
  },
  accessoryView: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
