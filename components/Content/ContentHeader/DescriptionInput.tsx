import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  Platform,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
  TextInputProps,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { TextInput } from '../../UI/Themed';
import Colors from '@/constants/Colors';

interface DescriptionInputProps extends Omit<TextInputProps, 'onChangeText' | 'style' | 'multiline' | 'scrollEnabled' | 'onContentSizeChange'> {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void; 
  theme: 'light' | 'dark';
  inputRef?: React.RefObject<RNTextInput>; 
  style?: StyleProp<TextStyle>; 
  containerStyle?: StyleProp<ViewStyle>; 
}

export default function DescriptionInput({
  value,
  onChangeText,
  onBlur,
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
  function handleContentSizeChange(event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) {
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


  const defaultPlaceholderColor = theme === 'light' ? Colors.light.textMuted : Colors.dark.textMuted;

  return (
    <TextInput
      ref={inputRef}
      theme={theme}
      style={[
        styles.descriptionInput,
          Platform.OS === 'web' //@ts-ignore
              ? { outlineStyle: 'none' } : null,
        inputHeight !== undefined ? { height: inputHeight } : {},
        style, 
      ]}
      value={value}
      onChangeText={handleChangeText} 
      onContentSizeChange={handleContentSizeChange} 
      onBlur={onBlur} 
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
      multiline={true}
      scrollEnabled={false} 
      textAlignVertical="top"
      blurOnSubmit={false} 
      returnKeyType='default'
      {...restProps} 
    />
  );
}

const styles = StyleSheet.create({
  descriptionInput: {
    fontSize: 15,
    padding: 8,
    textAlignVertical: 'top',
  },
});
