import React, { Component, useContext } from "react";
import { Animated, StyleSheet } from "react-native";
import { View } from "../Themed";

interface ContentProps {
  
}

interface ContentState {
  
}

export default class Content extends Component<ContentProps, ContentState>{
  constructor(props: ContentProps) {
    super(props);
  }

  render() {
    return (
      <View style={[ this.styles.container ]}>
        
      </View>
    );
  }

  styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 5, 
    },
  });
}
