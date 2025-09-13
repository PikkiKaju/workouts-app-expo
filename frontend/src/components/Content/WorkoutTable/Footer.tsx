import React from "react";
import { StyleSheet } from "react-native";

import { View } from "components/ui/Themed";

interface FooterProps {
  children: React.ReactNode;
  style?: object;
}

export default function Footer({ children, style }: FooterProps) {
  return <View style={[styles.container, style]}></View>;
}

const styles = StyleSheet.create({
  container: {},
});
