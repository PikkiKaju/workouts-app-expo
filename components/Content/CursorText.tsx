import React from "react";
import { StyleSheet, View, Platform } from "react-native";
import { Text, TextProps } from "@/components/UI/Themed";
import { CursorValue } from "react-native";

// Themed Text component with cursor style for web
export const CursorText = (props: TextProps) => {
    const { style, ...otherProps } = props; // Apply cursor style only on web
    const cursorStyle = Platform.OS === 'web' ? { cursor: 'text' } : { cursor: "auto" };
    return <Text style={[style, cursorStyle as any]} {...otherProps} />
}
