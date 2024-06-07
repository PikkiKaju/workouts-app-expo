import React, { Component, useContext } from "react";
import { Animated, StyleSheet } from "react-native";
import { View } from "../Themed";
import ContentHeader from "./ContentHeader";

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
      <View style={[ this.styles.container ]}>
        <ContentHeader name={this.props.name} date={this.props.date} />
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
