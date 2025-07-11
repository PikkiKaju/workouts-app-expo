import {
  Text as DefaultText,
  TextInput as DefaultTextInput,
  View as DefaultView,
  useColorScheme,
} from "react-native";
import Colors from "constants/Colors";
import { forwardRef } from "react";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  theme?: string;
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type TextInputProps = ThemeProps & DefaultTextInput["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#000";
  const darkColor = "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export const TextInput = forwardRef<DefaultTextInput, TextInputProps>(
  (props, ref) => {
    const { style, theme, ...otherProps } = props;
    const lightColor = "#000";
    const darkColor = "#fff";
    const color = theme === "light" ? lightColor : darkColor;

    return (
      <DefaultTextInput ref={ref} style={[{ color }, style]} {...otherProps} />
    );
  }
);

export function View(props: ViewProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#fff";
  const darkColor = "#333"; //"#181818";
  let backgroundColor = "transparent";
  if (theme) {
    backgroundColor = theme === "light" ? lightColor : darkColor;
  }

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}
