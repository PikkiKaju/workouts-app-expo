import React, { Component } from "react"; 
import { StyleSheet, Pressable, Keyboard, Platform } from "react-native";
import { View } from "@/components/UI/Themed";
import ContentHeader from "./ContentHeader/ContentHeader";

interface ContentProps {
  name: string
  date: Date 
}

interface ContentState {
  
}

export default class Content extends Component<ContentProps, ContentState>{
  constructor(props: ContentProps) {
    super(props);
  }

  render() {
    return (
      <Pressable
        style={[
          this.styles.pressableContainer, //@ts-ignore
          Platform.OS === "web"
          ? { cursor: "default" } : null
        ]}
        onPress={() => {
          // Dismiss keyboard on non-web platforms when clicked outside of inputs
          if (Platform.OS !== 'web') Keyboard.dismiss();
        }}
      >
        <View style={this.styles.innerContainer}>
          <ContentHeader name={this.props.name} />
        </View>
      </Pressable>
    );
  }

  styles = StyleSheet.create({
    pressableContainer: {
      flex: 1,
    },
    innerContainer: {
      flex: 1, 
      paddingHorizontal: 5,
      minWidth: 400, 
    },
  });
}
