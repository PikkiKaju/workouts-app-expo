import React, { forwardRef, useState } from 'react';
import { TextInput as DefaultTextInput, StyleSheet } from 'react-native';
import { TextInput, TextInputProps } from './Themed';

export const AutoExpandingTextInput = forwardRef<DefaultTextInput, TextInputProps>((props, ref) => {
  const [inputHeight, setInputHeight] = useState(0); // Initial height
  const [text, setText] = useState(''); // Store text input
  const { style, theme, ...otherProps } = props; 

  const handleContentSizeChange = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    setInputHeight(contentHeight); // Dynamically set height based on content size
    console.log("Content Height:", event.nativeEvent.contentSize.height)
  };

  const handleTextChange = (newText: string) => {
    setText(newText); // Update text state
    if (newText.length === 0) {
      setInputHeight(40); // Reset to minimum height if no text
    }
  };

  const styles = StyleSheet.create({
    textInput: {
      padding: 10,
      textAlignVertical: 'top',
    },
  });

  
  return (
    <TextInput
      ref={ref}
      style={[styles.textInput, style, { height: Math.max(0, inputHeight) }]}
      multiline
      placeholder="Type your text here..."
      onChangeText={handleTextChange} // Handle text change
      onContentSizeChange={handleContentSizeChange} // Adjust height dynamically
      scrollEnabled={false}
      {...otherProps}
    />
  );
});

export default AutoExpandingTextInput;
