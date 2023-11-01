/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  useColorScheme
} from 'react-native';
import { TextInput as DefaultTextInput, } from 'react-native-gesture-handler';
import Colors from '@/constants/Colors';

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
  const lightColor = "#000";
  const darkColor = "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#000";
  const darkColor = "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return <DefaultTextInput style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#fff";
  const darkColor = "#333";//"#181818";
  let backgroundColor = "transparent";
  if (theme) {
    backgroundColor = theme === "light" ? lightColor : darkColor;
  }
  
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}