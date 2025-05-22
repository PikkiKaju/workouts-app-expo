import React, { forwardRef } from 'react';
import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  StyleSheet,
} from 'react-native';

export type ThemeProps = {
  theme?: string;
  lightColor?: string;
  darkColor?: string;
};

export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const {
    style,
    theme,
    lightColor: customLightColor,
    darkColor: customDarkColor,
    ...otherProps
  } = props;
  const lightColor = customLightColor || "#000";
  const darkColor = customDarkColor || "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export const TextInput = forwardRef<DefaultTextInput, TextInputProps>((props, ref) => {
  const {
    style,
    theme,
    lightColor: customLightColor,
    darkColor: customDarkColor,
    ...otherProps
  } = props;
  const lightColor = customLightColor || "#000";
  const darkColor = customDarkColor || "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return (
    <DefaultTextInput ref={ref} style={[{ color }, style]} {...otherProps} />
  );
});

export function View(props: ViewProps) {
  const {
    style,
    theme,
    lightColor: customLightColor,
    darkColor: customDarkColor,
    ...otherProps
  } = props;
  const backgroundColor = theme === "light" ? (customLightColor || "#fff") : (customDarkColor || "#333");
  return (
    <DefaultView
      style={[
        { backgroundColor: theme ? backgroundColor : "transparent" },
        style,
      ]}
      {...otherProps}
    />
  );
}