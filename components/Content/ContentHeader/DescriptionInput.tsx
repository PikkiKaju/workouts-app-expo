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
  Animated,
  Text as DefaultText,
} from "react-native";
import { TextInput } from "../../UI/Themed";
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

  // "Saved" message state and refs
  const [isSavedVisible, setIsSavedVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueOnFocusRef = useRef(value);

  // Update previous length ref if the value prop changes externally
  useEffect(() => {
    previousLengthRef.current = value?.length ?? 0;
    // Reset height if value becomes empty externally? Optional.
    if (!value) {
      setInputHeight(undefined);
    }
  }, [value]);

  // Cleanup timer and animation for "Saved" message on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim]);

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

  const showSavedMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fadeAnim.stopAnimation();

    setIsSavedVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200, // Fade-in duration
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    timeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade-out duration
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        setIsSavedVisible(false);
      });
    }, 2000); // Display for 2 seconds
  };

  const handleFocusInternal = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    valueOnFocusRef.current = value; // Store current value on focus
    if (onFocus) {
      onFocus(event);
    }
  };

  const handleBlurInternal = () => {
    // Show "Saved" message only if the value has changed since focus
    if (value !== valueOnFocusRef.current) {
      showSavedMessage();
    }
    if (onBlur) {
      onBlur(); // Call original onBlur prop
    }
  };

  const handleDonePress = () => {
    handleBlurInternal(); // This will trigger save and "Saved" message if needed
    Keyboard.dismiss();
  };

  const defaultPlaceholderColor =
    theme === "light" ? Colors.light.textMuted : Colors.dark.textMuted;

  // Infer base font size for "Saved" message
  const flatStyle = StyleSheet.flatten(style);
  const baseFontSize =
    typeof flatStyle.fontSize === "number"
      ? flatStyle.fontSize
      : styles.descriptionInput.fontSize; // Default from styles
  const savedTextFontSize = baseFontSize * 0.8;

  return (
    <>
      <RNView style={[styles.inputWrapper, containerStyle]}>
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
          onFocus={handleFocusInternal}
          onBlur={handleBlurInternal}
          onPress={onPress}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
          inputMode="text"
          returnKeyType="done"
          multiline={true}
          scrollEnabled={false}
          textAlignVertical="top"
          submitBehavior="newline"
          onSubmitEditing={handleDonePress} // Uses handleBlurInternal
          inputAccessoryViewID={
            Platform.OS === "ios" ? inputAccessoryViewID : undefined
          }
          {...restProps}
        />
        {isSavedVisible && (
          <Animated.View
            style={[
              styles.savedTextContainer,
              { opacity: fadeAnim, backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background },
            ]}
          >
            <DefaultText style={[styles.savedText, { color: theme === 'light' ? Colors.light.tint : Colors.dark.tint, fontSize: savedTextFontSize }]}>
              Saved
            </DefaultText>
          </Animated.View>
        )}
      </RNView>
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
  inputWrapper: {
    position: "relative", // For absolute positioning of the "Saved" message
    // containerStyle prop will be applied here
  },
  descriptionInput: {
    fontSize: 15,
    padding: 8,
    textAlignVertical: "top",
  },
  accessoryView: {
    padding: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  savedTextContainer: {
    position: 'absolute',
    top: 5, // Position at the top-right corner of the input area
    right: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 1, // Ensure it's above the text input content if necessary
    pointerEvents: 'none',
  },
  savedText: {
    fontWeight: 'bold',
    // fontSize and color are applied dynamically
  },
});
