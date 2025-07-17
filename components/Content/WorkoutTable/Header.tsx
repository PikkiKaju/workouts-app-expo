import React from "react";

import { StyleSheet } from "react-native";

import { View, Text } from "@/components/UI/Themed";

export type HeaderType = typeof Header

interface HeaderProps {
  children: React.ReactNode;
  style?: object;
}

export default function Header({ children, style }: HeaderProps): React.ReactElement {
  return (
    <View style={[styles.container, style]}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
  }
});