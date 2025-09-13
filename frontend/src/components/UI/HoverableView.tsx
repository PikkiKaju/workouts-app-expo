import React from "react";
import { View, ViewProps } from "components/ui/Themed";
import {
  Animated,
  ColorValue,
  Platform,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

interface HoverableViewStyle extends ViewStyle {
  scale?: number;
  backgroundColor?: ColorValue;
}

interface HoverableViewProps extends ViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle> | StyleProp<HoverableViewStyle>;
  hoverStyle?: StyleProp<HoverableViewStyle>;
  transitionDuration?: number; // Duration for hover effect
  onHoverIn?: () => void;
  onHoverOut?: () => void;
}

interface HoverableViewState {
  isHovered: boolean;
}

export default class HoverableView extends React.Component<
  HoverableViewProps,
  HoverableViewState
> {
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

    const flatStyle = StyleSheet.flatten(style) as ViewStyle;
    // Combine the default hoverStyle with the one from props
    const flatHoverStyle = StyleSheet.flatten([
      HoverableView.defaultProps.hoverStyle,
      hoverStyleProp,
    ]) as HoverableViewStyle;

    const scale = this.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, flatHoverStyle?.scale || 1.04],
    });

    const backgroundColor = this.animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (flatStyle?.backgroundColor as string) ||
          HoverableView.defaultProps.hoverStyle.backgroundColor,
        (flatHoverStyle?.backgroundColor as string) ||
          (flatStyle?.backgroundColor as string) ||
          HoverableView.defaultProps.hoverStyle.backgroundColor,
      ],
    });

    const hoverProps = {};

    return (
      <View
        style={[Platform.OS === "web" ? { cursor: "auto" } : {}]}
        onPointerEnter={this.handleHoverIn}
        onPointerLeave={this.handleHoverOut}
      >
        <Animated.View
          style={[
            style,
            flatHoverStyle.backgroundColor && { backgroundColor },
            flatHoverStyle.scale !== 1 ? { transform: [{ scale: scale }] } : {},
          ]}
          {...(Platform.OS === "web" ? hoverProps : {})}
        >
          {children}
        </Animated.View>
      </View>
    );
  }
}
