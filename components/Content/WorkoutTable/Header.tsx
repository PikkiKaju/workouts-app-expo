import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/UI/Themed";

import { useTranslation } from 'react-i18next';

export type HeaderType = typeof Header

interface HeaderProps {
  children: React.ReactNode;
  style?: object;
}

export default function Header({ children, style }: HeaderProps): React.ReactElement {
  const { t } = useTranslation();
  return (
    <View style={[styles.container, style]}>
      <Text style={ styles.header }>{t('workout_table_header.exercise_name')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});