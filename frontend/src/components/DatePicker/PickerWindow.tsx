import React, { Component } from "react";
import { StyleSheet, Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "./Themed";
import { DayCalendar } from "./DayCalendar";
import { YearCalendar } from "./YearCalendar";
import { Months } from "./Calendar";
import { PickerWindowState, CalendarTileProps } from "./Types";

interface PickerWindowProps {
  pickedDate: Date;
  theme: "dark" | "light";
  updatePickedDate: (day: number, month: number, year: number) => void;
  updateDisplayDate: (day: string, month: string, year: string) => void;
  togglePickerWindow: () => void;
  blurDatePicker: () => void;
}

export default class PickerWindow extends Component<
  PickerWindowProps,
  PickerWindowState
> {
  constructor(props: PickerWindowProps) {
    super(props);

    let currentDate = props.pickedDate;

    this.state = {
      pickedDate: currentDate,
      pickedDay: currentDate.getDate(),
      pickedMonth: currentDate.toLocaleString("default", { month: "long" }),
      pickedYear: currentDate.getFullYear(),
      selectedDate: new Date(currentDate), // Ensure selectedDate is a new instance
      selectedMonth: currentDate.toLocaleString("default", { month: "long" }),
      selectedYear: currentDate.getFullYear(),

      selectedCalendar: "DayCalendar",
      dayCalendarContent: [],
      monthCalendarContent: Object.keys(Months), // ["Jan", "Feb", ...]
      yearCalendarContent: [],
      theme: props.theme,
    };
  }

  componentDidMount(): void {
    this.updateDayCalendarContent();
    this.updateYearCalendarContent();
  }

  componentDidUpdate(
    prevProps: Readonly<PickerWindowProps>,
    prevState: Readonly<PickerWindowState>
  ): void {
    if (this.props.theme !== prevProps.theme) {
      this.setState({ theme: this.props.theme });
    }
    if (
      this.props.pickedDate !== prevProps.pickedDate &&
      this.props.pickedDate !== this.state.pickedDate
    ) {
      const newDate = this.props.pickedDate;
      this.setState(
        {
          pickedDate: newDate,
          pickedDay: newDate.getDate(),
          pickedMonth: newDate.toLocaleString("default", { month: "long" }),
          pickedYear: newDate.getFullYear(),
          selectedDate: new Date(newDate),
          selectedMonth: newDate.toLocaleString("default", { month: "long" }),
          selectedYear: newDate.getFullYear(),
        },
        () => {
          this.updateDayCalendarContent();
        }
      );
    }
  }

  changeCalendar = (): void => {
    this.setState(
      (prevState) => ({
        selectedCalendar:
          prevState.selectedCalendar === "DayCalendar"
            ? "YearCalendar"
            : "DayCalendar",
      }),
      () => {
        if (this.state.selectedCalendar === "DayCalendar") {
          this.updateDayCalendarContent();
        } else {
          this.updateYearCalendarContent();
        }
      }
    );
  };

  updateDayCalendarContent = (): void => {
    let firstDayDate = new Date(
      this.state.selectedYear,
      this.state.selectedDate.getMonth(),
      1
    );
    let firstDayPos = firstDayDate.getDay(); // 0 (Sun) - 6 (Sat)
    if (firstDayPos === 0) firstDayPos = 7; // Adjust to 1 (Mon) - 7 (Sun)

    const currentMonthShort = this.state.selectedDate.toLocaleString(
      "default",
      { month: "short" }
    ) as keyof typeof Months;

    let previousMonthDate = new Date(this.state.selectedDate);
    previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
    const previousMonthShort = previousMonthDate.toLocaleString("default", {
      month: "short",
    }) as keyof typeof Months;

    let nextMonthDate = new Date(this.state.selectedDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    const nextMonthShort = nextMonthDate.toLocaleString("default", {
      month: "short",
    }) as keyof typeof Months;

    let daysInPreviousMonth = Months[previousMonthShort].days;
    if (
      previousMonthShort === "Feb" &&
      previousMonthDate.getFullYear() % 4 === 0
    ) {
      daysInPreviousMonth = 29;
    }

    let daysInSelectedMonth = Months[currentMonthShort].days;
    if (currentMonthShort === "Feb" && this.state.selectedYear % 4 === 0) {
      daysInSelectedMonth = 29;
    }

    let content: CalendarTileProps[] = [];
    // Days from previous month
    for (
      let day = daysInPreviousMonth - firstDayPos + 2;
      day <= daysInPreviousMonth;
      day++
    ) {
      content.push({
        day,
        month: previousMonthShort,
        year: previousMonthDate.getFullYear(),
      });
    }
    // Days from current month
    for (let day = 1; day <= daysInSelectedMonth; day++) {
      content.push({
        day,
        month: currentMonthShort,
        year: this.state.selectedYear,
      });
    }
    // Days from next month
    const remainingCells = 42 - content.length;
    for (let day = 1; day <= remainingCells; day++) {
      content.push({
        day,
        month: nextMonthShort,
        year: nextMonthDate.getFullYear(),
      });
    }

    this.setState({ dayCalendarContent: content });
  };

  updateYearCalendarContent = (): void => {
    let yearsContent: number[] = [];
    for (let year = 1900; year <= 2100; year++) {
      yearsContent.push(year);
    }
    this.setState({ yearCalendarContent: yearsContent });
  };

  previousMonth = (): void => {
    this.setState((prevState) => {
      const newSelectedDate = new Date(prevState.selectedDate);
      newSelectedDate.setMonth(newSelectedDate.getMonth() - 1);
      return {
        selectedDate: newSelectedDate,
        selectedMonth: newSelectedDate.toLocaleString("default", {
          month: "long",
        }),
        selectedYear: newSelectedDate.getFullYear(),
      };
    }, this.updateDayCalendarContent);
  };

  nextMonth = (): void => {
    this.setState((prevState) => {
      const newSelectedDate = new Date(prevState.selectedDate);
      newSelectedDate.setMonth(newSelectedDate.getMonth() + 1);
      return {
        selectedDate: newSelectedDate,
        selectedMonth: newSelectedDate.toLocaleString("default", {
          month: "long",
        }),
        selectedYear: newSelectedDate.getFullYear(),
      };
    }, this.updateDayCalendarContent);
  };

  setDateToPresent = (): void => {
    const presentDate = new Date();
    this.props.updatePickedDate(
      presentDate.getDate(),
      presentDate.getMonth() + 1,
      presentDate.getFullYear()
    );
    // The parent's updatePickedDate will trigger a prop change, which componentDidUpdate will handle.
  };

  updateSelectedMonth = (monthShort: string): void => {
    // monthShort is "Jan", "Feb", etc.
    this.setState((prevState) => {
      const newSelectedDate = new Date(prevState.selectedDate);
      const monthIndex = prevState.monthCalendarContent.indexOf(monthShort);
      newSelectedDate.setMonth(monthIndex);
      return {
        selectedDate: newSelectedDate,
        selectedMonth: newSelectedDate.toLocaleString("default", {
          month: "long",
        }),
        // selectedYear might change if month wraps around, e.g. Dec -> Jan
        selectedYear: newSelectedDate.getFullYear(),
      };
    });
  };

  updateSelectedYear = (year: number): void => {
    this.setState((prevState) => {
      const newSelectedDate = new Date(prevState.selectedDate);
      newSelectedDate.setFullYear(year);
      return {
        selectedDate: newSelectedDate,
        selectedYear: year,
        // selectedMonth might need update if date was e.g. Feb 29 and year changes to non-leap
        selectedMonth: newSelectedDate.toLocaleString("default", {
          month: "long",
        }),
      };
    });
  };

  render() {
    return (
      <View
        theme={this.state.theme}
        style={[
          this.styles.container,
          { borderColor: this.props.theme === "light" ? "black" : "#666" },
        ]}
      >
        <View style={this.styles.header}>
          <Pressable
            onPress={this.changeCalendar}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#AAA" : "transparent" },
              { pointerEvents: "box-only" },
            ]}
          >
            <View style={this.styles.dateButton}>
              <Text theme={this.state.theme}> {this.state.selectedMonth} </Text>
              <Text theme={this.state.theme}> {this.state.selectedYear} </Text>
              <AntDesign
                name="caretdown"
                size={8}
                color={this.state.theme === "light" ? "black" : "white"}
                style={this.styles.headerArrow}
              />
            </View>
          </Pressable>
          <View style={this.styles.changeMonthButtons}>
            <Pressable
              onPress={this.previousMonth}
              style={({ pressed }) => [
                { backgroundColor: pressed ? "#AAA" : "transparent" },
                { pointerEvents: "box-only" },
              ]}
            >
              <AntDesign
                name="up"
                size={20}
                color={this.state.theme === "light" ? "black" : "white"}
                style={this.styles.headerArrow}
              />
            </Pressable>
            <Pressable
              onPress={this.nextMonth}
              style={({ pressed }) => [
                { backgroundColor: pressed ? "#AAA" : "transparent" },
                { pointerEvents: "box-only" },
              ]}
            >
              <AntDesign
                name="down"
                size={20}
                color={this.state.theme === "light" ? "black" : "white"}
                style={this.styles.headerArrow}
              />
            </Pressable>
          </View>
        </View>
        <View style={this.styles.calendar}>
          {this.state.selectedCalendar === "DayCalendar" ? (
            <DayCalendar
              state={this.state}
              updatePickedDate={this.props.updatePickedDate}
              togglePickerWindow={this.props.togglePickerWindow}
              blurDatePicker={this.props.blurDatePicker}
            />
          ) : (
            <YearCalendar
              state={this.state}
              updateSelectedYear={this.updateSelectedYear}
              updateSelectedMonth={this.updateSelectedMonth}
              changeCalendar={this.changeCalendar}
            />
          )}
        </View>
        <View style={this.styles.footer}>
          <Pressable
            onPress={() => this.props.updateDisplayDate("dd", "mm", "yyyy")}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#BBB" : "transparent" },
            ]}
          >
            <Text theme={this.state.theme} selectable={false}>
              Clear
            </Text>
          </Pressable>
          <Pressable
            onPress={this.setDateToPresent}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#BBB" : "transparent" },
              { pointerEvents: "box-only" },
            ]}
          >
            <Text theme={this.state.theme} selectable={false}>
              Today
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  styles = StyleSheet.create({
    container: {
      width: 200,
      borderWidth: 1,
      borderRadius: 3,
      position: "absolute",
      zIndex: 999,
    },
    header: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 5,
      marginVertical: 5,
    },
    dateButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    headerArrow: { marginHorizontal: 2 }, // Adjusted margin for better spacing
    changeMonthButtons: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      columnGap: 5,
    },
    calendar: { flex: 6, paddingHorizontal: 5, minHeight: 190, maxHeight: 190 },
    footer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginVertical: 5,
    },
  });
}
