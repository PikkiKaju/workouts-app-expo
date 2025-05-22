import React, { useState, useEffect, useRef } from 'react';
import { Platform, Pressable, StyleSheet, TextInput as RNTextInput, Animated, Text as DefaultText } from 'react-native';
import { TextInput } from '../../UI/Themed';
import { AntDesign } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface WorkoutNameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  inputRef: React.RefObject<RNTextInput | null>;
  theme: 'light' | 'dark';
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
  const [isSavedVisible, setIsSavedVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For opacity
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const valueOnFocusRef = useRef(value); // Store value when input was focused

  useEffect(() => {
    // Cleanup timer and animation on component unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      fadeAnim.stopAnimation();
    };
  }, [fadeAnim]);


  const showSavedMessage = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    fadeAnim.stopAnimation();

    setIsSavedVisible(true);

    Animated.timing(fadeAnim, { // Fade in
      toValue: 1,
      duration: 200, // Short fade-in duration
      useNativeDriver: Platform.OS !== 'web',
    }).start();

    timeoutRef.current = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500, // Fade out duration
        useNativeDriver: Platform.OS !== 'web', // useNativeDriver is true for native, false for web for opacity
      }).start(() => {
        setIsSavedVisible(false); // Hide after fade out
      });
    }, 2000); // Display for 2 seconds before starting fade out
  };

  const handleFocus = () => {
    setIsFocused(true);
    valueOnFocusRef.current = value; // Store current value on focus
  };

  return (
    <Pressable
      style={[
        styles.namePressable,
        { borderColor: isFocused ? (theme === 'light' ? Colors.light.text : Colors.global.themeColorSecond) : 'transparent' },
      ]}
      onPress={() => inputRef.current?.focus()}
    >
      <AntDesign
        name="edit"
        size={24}
        color={theme === 'light' ? Colors.light.text : Colors.dark.text}
      />
      <TextInput
        ref={inputRef}
        theme={theme}
        style={[
          styles.nameInput,
            { fontSize: textFontSize },
            //@ts-ignore
            Platform.OS === 'web' ? { outlineStyle: 'none' } : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        inputMode="text"
        returnKeyType="done"
        onFocus={handleFocus}
        onBlur={() => {
          setIsFocused(false);
          onBlur();
          // Show "Saved" message only if the value has changed since focus
          if (value !== valueOnFocusRef.current) {
            showSavedMessage();
          }
        }}
      />
      {isSavedVisible && (
        <Animated.View
          style={[
            styles.savedTextContainer,
            { opacity: fadeAnim, backgroundColor: theme === 'light' ? Colors.light.background : Colors.dark.background },
          ]}
        >
          <DefaultText style={[styles.savedText, { color: theme === 'light' ? Colors.light.tint : Colors.dark.tint, fontSize: textFontSize * 0.8 }]}>
            Saved
          </DefaultText>
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  namePressable: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    borderBottomWidth: 1,
  },
  nameInput: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  savedTextContainer: {
    position: 'absolute',
    right: 0, 
    top: 0,
    bottom: 0,
    justifyContent: 'center', // Vertically center the text
    pointerEvents: 'none', // Ensure it doesn't interfere with interactions
    paddingHorizontal: 4, // Add some horizontal padding for the background
    borderRadius: 5, // Optional: round the corners of the background
  },
  savedText: {
    fontWeight: 'bold',
  },
});
