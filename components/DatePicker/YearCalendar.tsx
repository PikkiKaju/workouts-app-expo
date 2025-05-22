import React, { Component } from "react";
import { StyleSheet, Pressable, FlatList } from "react-native";
import { Text, View } from "./Themed";
import { PickerWindowState } from "./Types";

interface YearCalendarProps {
  state: PickerWindowState;
  updateSelectedYear: (year: number) => void;
  updateSelectedMonth: (month: string) => void; // month is short name e.g. "Jan"
  changeCalendar: () => void;
}

export class YearCalendar extends Component<YearCalendarProps> {
  constructor(props: YearCalendarProps) {
    super(props);
  }

  render() {
    return (
      <View style={this.styles.calendar}>
        <View style={this.styles.calendarBody}>
          <FlatList
            data={this.props.state.yearCalendarContent}
            renderItem={({ item }) => (
              <YearCalendarTile {...this.props} year={item} />
            )}
            initialScrollIndex={
              this.props.state.selectedYear >= 1900
                ? this.props.state.selectedYear - 1900
                : 0
            } // Adjusted for valid range
            getItemLayout={(data, index) => ({
              length: 20,
              offset: 24 * index,
              index,
            }) // Assuming item height is 20 + margin 4 = 24
            }
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
    calendarBody: {
      flex: 6,
    },
  });
}

interface YearCalendarTileProps {
  state: PickerWindowState;
  year: number;
  updateSelectedYear: (year: number) => void;
  updateSelectedMonth: (month: string) => void;
  changeCalendar: () => void;
}

class YearCalendarTile extends Component<YearCalendarTileProps> {
  constructor(props: YearCalendarTileProps) {
    super(props);
  }

  render() {
    return (
      <View style={this.styles.yearCalendarTile}>
        <Pressable
          onPress={() => this.props.updateSelectedYear(this.props.year)}
          style={({ pressed }) => [
            { backgroundColor: pressed ? "#AAA" : "transparent" },
            {
              pointerEvents: "box-only",
              borderBottomColor: "#555",
              borderBottomWidth:
                this.props.year === this.props.state.selectedYear ? 2 : 1,
            },
          ]}
        >
          <Text theme={this.props.state.theme} selectable={false}>
            {this.props.year}
          </Text>
        </Pressable>
        {this.props.state.selectedYear === this.props.year ? (
          <FlatList
            data={this.props.state.monthCalendarContent} // These are short month names
            renderItem={({ item }) => (
              <MonthCalendarTile {...this.props} month={item} />
            )}
            numColumns={4}
          />
        ) : null}
      </View>
    );
  }

  styles = StyleSheet.create({
    yearCalendarTile: {
      flex: 1,
      flexDirection: "column",
      minHeight: 20,
      marginVertical: 2,
    },
  });
}

interface MonthCalendarTileProps {
  state: PickerWindowState;
  month: string; // Short month name e.g. "Jan"
  updateSelectedMonth: (month: string) => void;
  changeCalendar: () => void;
}

class MonthCalendarTile extends Component<MonthCalendarTileProps> {
  constructor(props: MonthCalendarTileProps) {
    super(props);
  }

  render() {
    const isSelected = this.props.state.selectedMonth.startsWith(
      this.props.month
    ); // Compare short month with full selected month
    return (
      <View
        style={[
          this.styles.calendarTile,
          {
            backgroundColor: isSelected
              ? this.props.state.theme === "light"
                ? "#8789BC"
                : "#B7B7CC"
              : "transparent",
          },
        ]}
      >
        <Pressable
          onPress={() => {
            this.props.updateSelectedMonth(this.props.month);
            this.props.changeCalendar();
          }}
          style={({ pressed }) => [
            { backgroundColor: pressed ? "#999" : "transparent" },
            { pointerEvents: "box-only" },
          ]}
        >
          <Text
            theme={
              isSelected
                ? this.props.state.theme === "light"
                  ? "dark"
                  : "light"
                : this.props.state.theme
            }
            selectable={false}
          >
            {this.props.month}
          </Text>
        </Pressable>
      </View>
    );
  }

  styles = StyleSheet.create({
    calendarTile: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 4,
    },
  });
}
