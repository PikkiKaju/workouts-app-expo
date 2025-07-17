import React from "react";
import { StyleSheet } from "react-native";

import { View, Text } from "@/components/UI/Themed";

class ContentTable extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Content Table</Text>
            </View>
        );
    }
};

export default ContentTable;

const styles = StyleSheet.create({
    container: {
    }
});