import React from "react";
import { ViewProps } from "@/components/UI/Themed";
import { Animated, Platform, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

interface HoveredViewStyle extends ViewStyle {
  scale?: number;
  backgroundColor?: string;
}

interface HoverableViewProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  hoverStyle?: StyleProp<HoveredViewStyle>;
  transitionDuration?: number; // Duration for hover effect
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

interface HoverableViewState {
  isHovered: boolean;
}

export default class HoverableView extends React.Component<HoverableViewProps, HoverableViewState> {
  static defaultProps = {
    hoverStyle: {
      backgroundColor: "transparent", // will be overwritten if theme colors are provided
      scale: 1,
    },
    transitionDuration: 100,
    onHoverIn: () => {},
    onHoverOut: () => {},
  };

  private animValue: Animated.Value;

  constructor(props: HoverableViewProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
    this.animValue = new Animated.Value(0);
  }

  componentDidUpdate(_: HoverableViewProps, prevState: HoverableViewState) {
    if (prevState.isHovered !== this.state.isHovered) {
      Animated.timing(this.animValue, {
        toValue: this.state.isHovered ? 1 : 0,
        duration: this.props.transitionDuration,
        useNativeDriver: false, // Color animations are not supported by the native driver
      }).start();
    }
  }

  handleHoverIn = () => {
    this.setState({ isHovered: true });
    this.props.onHoverIn?.();
  };

  handleHoverOut = () => {
    this.setState({ isHovered: false });
    this.props.onHoverOut?.();
  };

  render() {
    const { children, style, hoverStyle: hoverStyleProp } = this.props;
    const { isHovered } = this.state;

    const flatStyle = StyleSheet.flatten(style) as ViewStyle;
    // Combine the default hoverStyle with the one from props
    const flatHoverStyle = StyleSheet.flatten([
      HoverableView.defaultProps.hoverStyle, 
      hoverStyleProp
    ]) as HoveredViewStyle;

    const scale = this.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, flatHoverStyle?.scale || 1.04],
    });

    const themeBackgroundColor = 
      this.props.theme 
      ? this.props.theme === "light" 
        ? this.props.lightColor 
        : this.props.darkColor 
      : flatStyle?.backgroundColor || HoverableView.defaultProps.hoverStyle.backgroundColor;

    const backgroundColor = this.animValue.interpolate({
      
      inputRange: [0, 1],
      outputRange: [
        (flatStyle?.backgroundColor as string) || HoverableView.defaultProps.hoverStyle.backgroundColor,
        (flatHoverStyle?.backgroundColor as string) || (flatStyle?.backgroundColor as string) || HoverableView.defaultProps.hoverStyle.backgroundColor,
      ],
    });

    return (
      <Pressable
        style={[Platform.OS === "web" ? { cursor: "auto" } : {}]}
        onHoverIn={this.handleHoverIn}
        onHoverOut={this.handleHoverOut}
      >
        <Animated.View
          style={[
            style,
            { 
              backgroundColor,
              transform: [{ scale: scale }] 
            },
          ]}
        >
          {children}
        </Animated.View>
      </Pressable>
    );
  }
}
