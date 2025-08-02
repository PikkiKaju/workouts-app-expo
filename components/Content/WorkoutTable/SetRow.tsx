import React from "react";
import { Pressable, StyleSheet, TextStyle, ViewStyle } from "react-native";

import { View, Text } from "@/components/UI/Themed";
import { Set } from "./types";
import { useTheme } from "@/components/Providers/ThemeProvider";
import Colors from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

interface SetRowProps {
    key?: number;
    reps?: number;
    weight?: number;
    remove?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    linkerStyle?: ViewStyle;
    linker?: boolean;
    last?: boolean; 
}

const SetRow = ({ ...props }: SetRowProps ) => {
    const { theme } = useTheme();

    if (props.reps === undefined && props.weight === undefined && !props.remove) {
        return null; // If no reps or weight, do not render the row
    }

    return (
    <View key={props.key} style={[ styles.setRow, props.style ]}>
        { props.linker && (
        <View style={[styles.linker, props.linkerStyle ]}>
            <View style={[styles.linkerVerticalLine, {backgroundColor: Colors.global.tableLines}]}></View>
            <View style={[styles.linkerHorizontalLine, {backgroundColor: Colors.global.tableLines}]}></View>
            { !props.last && (
            <View style={[styles.linkerVerticalLine, {backgroundColor: Colors.global.tableLines}]}></View>
            )}
        </View>
        )}
        { props.weight && <Text style={props.textStyle}>{props.weight}</Text>}
        { props.reps && <Text style={props.textStyle}>{props.reps}</Text>}
        { props.remove && (
        <Pressable onPress={() => console.log("Delete set")}>
            <Ionicons name="close" size={20} color={Colors[theme].text} />
        </Pressable>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
    setRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        height: 30,
        paddingVertical: 0,
        marginVertical: 0,
    },
    linker: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100%",
        width: "100%",
        padding: 0,
        margin: 0,
    },
    linkerVerticalLine: {
        width: 1,
        height: "50%",
    },
    linkerHorizontalLine: {
        width: "51%",
        alignSelf: "flex-end",
        height: 1,
    },
});

export default SetRow;