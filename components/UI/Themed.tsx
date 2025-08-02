
import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  useColorScheme
} from 'react-native';
import Colors from '@/constants/Colors';
import { forwardRef } from 'react';
import { useTheme } from '../Providers/ThemeProvider';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  theme?: string
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, theme, ...otherProps } = props;
  let providerTheme = undefined;

  if (!theme) {
    // if theme is not provided, use the default theme from the context
    try {
      providerTheme = useTheme().theme;
    } catch (error) {
      console.warn("useTheme is not available, using default 'light' theme");
      providerTheme = "light"; // fallback to light theme if context is not available
    }
  }
  const lightColor = "#000";
  const darkColor = "#fff";
  const color = theme 
    ? (theme === "light" ? lightColor : darkColor) // use the props theme if provided
    : (providerTheme === "light" ? lightColor : darkColor); // use the context theme if available

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export const TextInput = forwardRef<DefaultTextInput, TextInputProps>((props, ref) => {
  const { style, theme, ...otherProps } = props;
  let providerTheme = undefined;

  if (!theme) {
    // if theme is not provided, use the default theme from the context
    try {
      providerTheme = useTheme().theme;
    } catch (error) {
      console.warn("useTheme is not available, using default 'light' theme");
      providerTheme = "light"; // fallback to light theme if context is not available
    }
  }

  const lightColor = "#000";
  const darkColor = "#fff";
   const color = theme 
    ? (theme === "light" ? lightColor : darkColor) // use the props theme if provided
    : (providerTheme === "light" ? lightColor : darkColor); // use the context theme if available

  return <DefaultTextInput ref={ref} style={[{ color }, style]} {...otherProps} />;
});

export const View = forwardRef<DefaultView, ViewProps>((props, ref) => {
  const { style, theme, ...otherProps } = props;
  
  const lightColor = "#fff";
  const darkColor = "#333";//"#181818";
  let backgroundColor = "transparent";
  if (theme) {
    backgroundColor = theme === "light" ? lightColor : darkColor;
  }
  
  return <DefaultView ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
});