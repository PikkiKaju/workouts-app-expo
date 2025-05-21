import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Text } from '../../UI/Themed';
import AnimatedArrow from '../../UI/AnimatedArrow'; // Path relative to this file
import Colors from '@/constants/Colors';

interface DescriptionToggleProps {
  toggled: boolean;
  onPress: () => void;
  theme: 'light' | 'dark';
  textFontSize: number;
}

export default function DescriptionToggle({ toggled, onPress, theme, textFontSize }: DescriptionToggleProps) {
  return (
    <Pressable style={styles.descriptionToggle} onPress={onPress}>
      <AnimatedArrow
        direction="down"
        size={20}
        color={theme === 'light' ? Colors.light.text : Colors.dark.text}
        onPress={onPress} // Can be removed if Pressable handles the action sufficiently
        toggled={toggled}
      />
      <Text theme={theme} style={{ fontSize: textFontSize }}>
        Description
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  descriptionToggle: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
  }
});
