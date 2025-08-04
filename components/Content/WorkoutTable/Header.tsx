import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "@/components/UI/Themed";

import { useTranslation } from 'react-i18next';
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/Providers/ThemeProvider";
import { useWorkoutTableContext } from "./WorkoutTableContextProvider";

export type HeaderType = typeof Header

interface HeaderProps {
  style?: object;
}

export default function Header({ style }: HeaderProps): React.ReactElement {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { tableStyles } = useWorkoutTableContext();
  
  const columnWidths = tableStyles.columns.widths;
  
  return (
    <View style={[
      styles.container, style,
      { borderBottomColor: Colors.global.themeColorFirst },
    ]}>
      <View style={{ width: columnWidths.dragColumn }}></View>
      <View style={{ width: columnWidths.keyColumn || 'auto' }}></View>
      <Text style={[styles.header, { flex: columnWidths.nameColumn.flex }]}>{t('workout_table_header.exercise_name')}</Text>
      <Text style={[styles.header, { flex: columnWidths.repsColumn.flex }]}>{t('workout_table_header.sets')}</Text>
      <Text style={[styles.header, { flex: columnWidths.weightsColumn.flex }]}>{t('workout_table_header.weights')}</Text>
      <View style={[{ width: columnWidths.deleteColumn || 'auto' }]}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignContent: "space-between",
    borderBottomWidth: 2,
    paddingVertical: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: "left",
  },
});