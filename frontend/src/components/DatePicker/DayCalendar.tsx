import React, { Component } from "react";
import { StyleSheet, Pressable, FlatList } from "react-native";
import { Text, View } from "./Themed";
import {
  PickerWindowState,
  CalendarTileProps as BaseCalendarTileProps,
} from "./Types";

export interface CalendarTileProps extends BaseCalendarTileProps {}

interface DayCalendarProps {
  state: PickerWindowState;
  updatePickedDate: (day: number, month: number, year: number) => void;
  togglePickerWindow: () => void;
  blurDatePicker: () => void;
}

export class DayCalendar extends Component<DayCalendarProps> {
  constructor(props: DayCalendarProps) {
    super(props);
  }

  render() {
    const weekdaysNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    return (
      <View style={this.styles.calendar}>
        <View style={this.styles.calendarHeader}>
          <FlatList
            data={weekdaysNames}
            renderItem={({ item }) => (
              <Text
                style={this.styles.weekdayTile}
                theme={this.props.state.theme}
              >
                {item}
              </Text>
            )}
            numColumns={7}
          />
        </View>
        <View style={this.styles.calendarBody}>
          <FlatList
            data={this.props.state.dayCalendarContent}
            renderItem={({ item }) => (
              <DayCalendarTile
                {...this.props}
                day={item.day}
                month={item.month}
                year={item.year}
              />
            )}
            numColumns={7}
          />
        </View>
      </View>
    );
  }

  styles = StyleSheet.create({
    calendar: {
      flex: 6,
      paddingHorizontal: 5,
    },
    calendarHeader: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    weekdayTile: {
      flex: 1,
      textAlign: "center",
    },
    calendarBody: {
      flex: 6,
    },
  });
}

interface DayCalendarTileProps extends CalendarTileProps {
  state: PickerWindowState;
  updatePickedDate: (day: number, month: number, year: number) => void;
  togglePickerWindow: () => void;
  blurDatePicker: () => void;
}

class DayCalendarTile extends Component<
  DayCalendarTileProps,
  { isHovered: boolean }
> {
  constructor(props: DayCalendarTileProps) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  render() {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return (
      <Pressable
        onPress={() => {
          this.props.updatePickedDate(
            this.props.day,
            months.indexOf(this.props.month) + 1,
            this.props.year
          );
          this.props.togglePickerWindow();
          this.props.blurDatePicker();
        }}
        style={({ pressed }) => [
          this.styles.calendarTile,
          {
            opacity: this.props.state.selectedMonth.includes(this.props.month)
              ? 1
              : 0.5, // Note: selectedMonth is full name, month is short. This logic might need review.
            backgroundColor: pressed ? "#999" : "transparent",
          },
          {
            backgroundColor:
              this.props.state.selectedYear === this.props.state.pickedYear &&
              this.props.state.pickedMonth.includes(this.props.month) && // Note: pickedMonth is full name, month is short.
              this.props.day === this.props.state.pickedDay
                ? this.props.state.theme === "light"
                  ? "#99E"
                  : "#B7B7DD"
                : this.state.isHovered
                ? this.props.state.theme === "light"
                  ? "#DDF"
                  : "#668"
                : "transparent",
          },
          { pointerEvents: "box-only" },
        ]}
        onHoverIn={() => this.setState({ isHovered: true })}
        onHoverOut={() => this.setState({ isHovered: false })}
      >
        <Text theme={this.props.state.theme} selectable={false}>
          {this.props.day}
        </Text>
      </Pressable>
    );
  }

  styles = StyleSheet.create({
    calendarTile: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      aspectRatio: 1,
      borderRadius: 3,
    },
  });
}
