
import  React, { Component, createRef, RefObject  } from 'react';
import {
  Platform,
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import NativeDatePicker from 'react-native-date-picker' ;
import { DimensionValue } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type ThemeProps = {
  theme?: string
  lightColor?: string;
  darkColor?: string;
};

type TextInputProps = ThemeProps & DefaultTextInput["props"];
type TextProps = ThemeProps & DefaultText['props'];
type ViewProps = ThemeProps & DefaultView['props'];

type PressEvent = {
  changedTouches: [PressEvent],
  identifier: number,
  locationX: number,
  locationY: number,
  pageX: number,
  pageY: number,
  target: number,
  timestamp: number,
  touches: []
}

function Text(props: TextProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#000";
  const darkColor = "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

function TextInput(props: TextInputProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#000";
  const darkColor = "#fff";
  const color = theme === "light" ? lightColor : darkColor;

  return <DefaultTextInput style={[{ color }, style]} {...otherProps} />;
}

function View(props: ViewProps) {
  const { style, theme, ...otherProps } = props;
  const lightColor = "#fff";
  const darkColor = "#333";
  let backgroundColor = "transparent";
  if (theme) {
    backgroundColor = theme === "light" ? lightColor : darkColor;
  }
  
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

interface YearCalendarProps {
  state: PickerWindowState
  updateSelectedYear: (year: number) => void
  updateSelectedMonth: (month: string) => void
  changeCalendar: () => void
}

class YearCalendar extends Component<YearCalendarProps>{
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <View style={this.styles.calendar}>
        <View style={this.styles.calendarBody}>
          <FlatList
            data={this.props.state.yearCalendarContent}
            renderItem={({ item }) => <YearCalendarTile {...this.props} year={item} />}
            initialScrollIndex={this.props.state.selectedYear - 1901}
            getItemLayout={(data, index) => (
              { length: 20, offset: 24 * index, index }
            )}
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
  state: PickerWindowState
  year: number
  updateSelectedYear: (year: number) => void
  updateSelectedMonth: (month: string) => void
  changeCalendar: () => void
}

class YearCalendarTile extends Component<YearCalendarTileProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <View style={this.styles.yearCalendarTile}>
        <Pressable
          onPress={() => this.props.updateSelectedYear(this.props.year)}
          style={({ pressed }) => [{ backgroundColor: pressed ? "#AAA" : "transparent" },
            {
              pointerEvents: "box-only",
              borderBottomColor: "#555",
              borderBottomWidth: this.props.year === this.props.state.selectedYear ? 2 : 1,
            }
          ]}
        >
          <Text theme={this.props.state.theme} selectable={false} >{this.props.year}</Text>
        </Pressable>
        {this.props.state.selectedYear === this.props.year
          ? (
            <FlatList
              data={this.props.state.monthCalendarContent}
              renderItem={({ item }) => <MonthCalendarTile {...this.props} month={item} />}
              numColumns={4}
            />
          ) : null
        }
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
  state: PickerWindowState
  month: string
  updateSelectedMonth: (month: string) => void
  changeCalendar: () => void
}

class MonthCalendarTile extends Component<MonthCalendarTileProps> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <View style={[
        this.styles.calendarTile,
        {
          backgroundColor: this.props.state.selectedMonth.includes(this.props.month)
          ? this.props.state.theme === "light"
          ? "#8789BC" 
          : "#B7B7CC"
        : "transparent"
        }
      ]} >
        <Pressable
          onPress={() => {
            this.props.updateSelectedMonth(this.props.month);
            this.props.changeCalendar();
          }}
            style={({ pressed }) => [{ backgroundColor: pressed ? "#999" : "transparent" },
            { pointerEvents: "box-only" }]}
        >
          <Text
            theme={
              this.props.state.selectedMonth.includes(this.props.month)
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

interface DayCalendarProps {
  state: PickerWindowState
  updatePickedDate: (day: number, month: number, year: number) => void
  togglePickerWindow: () => void
}

class DayCalendar extends Component<DayCalendarProps> {
  constructor(props: DayCalendarProps) {
    super(props);
  }

  render() {
    return (
      <View style={this.styles.calendar}>
        <View style={this.styles.calendarHeader}>
          <Text theme={this.props.state.theme} > Mo</Text>
          <Text theme={this.props.state.theme} > Tu</Text>
          <Text theme={this.props.state.theme} > We</Text>
          <Text theme={this.props.state.theme} > Th</Text>
          <Text theme={this.props.state.theme} > Fr</Text>
          <Text theme={this.props.state.theme} > Sa</Text>
          <Text theme={this.props.state.theme} > Su</Text>
        </View>
        <View style={this.styles.calendarBody}>
          <FlatList
            data={this.props.state.dayCalendarContent}
            renderItem={({ item }) =>
              <DayCalendarTile {...this.props} day={item.day} month={item.month} year={item.year} />
            }
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
    calendarBody: {
      flex: 6,
    },
  });
}

interface CalendarTileProps {
  day: number
  month: string
  year: number
};

interface DayCalendarTileProps extends CalendarTileProps {
  state: PickerWindowState
  updatePickedDate: (day: number, month: number, year: number) => void
  togglePickerWindow: () => void
}

class DayCalendarTile extends Component<DayCalendarTileProps> {    
  constructor(props: any) {
    super(props);
  }

  render() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return (
      <Pressable
        onPress={() => {          
          this.props.updatePickedDate(this.props.day, months.indexOf(this.props.month) + 1, this.props.year);
          this.props.togglePickerWindow();
        }}
        style={({ pressed }) => [
          this.styles.calendarTile,
          {
            opacity: this.props.state.selectedMonth.includes(this.props.month) ? 1 : 0.5,
            backgroundColor: pressed
              ? "#999"
              : "transparent"
          },
          {
            backgroundColor: (
              this.props.state.selectedYear === this.props.state.pickedYear
              && this.props.state.pickedMonth.includes(this.props.month)
              && this.props.day === this.props.state.pickedDay
            ) ? this.props.state.theme === "light"
                ? "#8789BC" 
                : "#B7B7CC"
              : "transparent"
          },
          { pointerEvents: "box-only" }
        ]}
      >
        <Text
          theme={
            this.props.state.selectedYear === this.props.state.pickedYear
            && this.props.state.pickedMonth.includes(this.props.month)
            && this.props.day === this.props.state.pickedDay
              ? this.props.state.theme === "light"
                ? "dark" 
                : "light"
              : this.props.state.theme
          }
          selectable={false}
        >
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
      marginVertical: 4,
    },
  });
}

interface PickerWindowProps {
  pickedDate: Date
  pickedDay?: number
  pickedMonth?: string
  pickedYear?: number

  theme: "dark" | "light"

  updatePickedDate: (day: number, month: number, year: number) => void
  togglePickerWindow: () => void
}

interface PickerWindowState {
  pickedDate: Date
  pickedDay: number
  pickedMonth: string
  pickedYear: number
  selectedDate: Date
  selectedMonth: string
  selectedYear: number

  selectedCalendar: "DayCalendar" | "YearCalendar"
  dayCalendarContent: CalendarTileProps[]
  monthCalendarContent: string[]
  yearCalendarContent: number[]
  theme: "dark" | "light"
}

class PickerWindow extends Component<PickerWindowProps, PickerWindowState> {
  constructor(props: PickerWindowProps) {
    super(props);

    let currentDate = props.pickedDate;

    this.state = {
      pickedDate: currentDate,
      pickedDay: currentDate.getDate(),
      pickedMonth: currentDate.toLocaleString("locale", { month: "long" }),
      pickedYear: currentDate.getFullYear(),
      selectedDate: currentDate,
      selectedMonth: currentDate.toLocaleString("locale", { month: "long" }),
      selectedYear: currentDate.getFullYear(),
  
      selectedCalendar: "DayCalendar",
      dayCalendarContent: [],
      monthCalendarContent: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      yearCalendarContent: [],
      theme: props.theme,
    }; 
  }

  componentDidUpdate(prevProps: Readonly<PickerWindowProps>): void {
    if (this.props.theme !== prevProps.theme) {
      this.setState({theme: this.props.theme});
    }
  }

  componentDidMount(): void {
    this.updateDayCalendarContent();
    this.updateYearCalendarContent(); 
  }

  changeCalendar = (): void  => {
    this.state.selectedCalendar === "DayCalendar"
      ? this.setState({ selectedCalendar: "YearCalendar" })
      : this.setState({ selectedCalendar: "DayCalendar" });
    
    this.updateDayCalendarContent();
    this.updateYearCalendarContent();
  }
  
  updateDayCalendarContent = (): void => {
    let firstDayDate = new Date(this.state.selectedDate);
    firstDayDate.setDate(1);
    let firstDayPos = firstDayDate.getDay();
    
    let previousMonth = new Date(this.state.selectedDate);
    let nextMonth = new Date(this.state.selectedDate);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const previousMonthShort = previousMonth.toLocaleString("locale", { month: "short" });
    const selectedMonthShort = this.state.selectedDate.toLocaleString("locale", { month: "short" });
    const nextMonthShort = nextMonth.toLocaleString("locale", { month: "short" });
    
    let daysInPreviousMonth = this.Months[previousMonthShort as keyof typeof this.Months].days;
    let daysInSelectedMonth = this.Months[selectedMonthShort as keyof typeof this.Months].days;

    if (firstDayPos === 0) firstDayPos = 7;

    if (selectedMonthShort === "Feb" && this.state.selectedYear % 4 == 0) {
      daysInSelectedMonth = 29;
    }
    if (previousMonthShort === "Feb" && this.state.selectedYear % 4 == 0) {
      daysInPreviousMonth = 29;
    }

    let content: CalendarTileProps[] = [];
    for (let day = daysInPreviousMonth - firstDayPos + 2; day <= daysInPreviousMonth; day++) {
      content.push({
        day: day,
        month: previousMonthShort,
        year: previousMonth.getFullYear()
      });
    }
    for (let day = 1; day <= daysInSelectedMonth; day++) {
      content.push({
        day: day,
        month: selectedMonthShort,
        year: this.state.selectedYear
      });
    }
    for (let day = 1; day <= 42 - (daysInSelectedMonth + (firstDayPos - 1)); day++) {
      content.push({
        day: day,
        month: nextMonthShort,
        year: nextMonth.getFullYear()
      });
    }

    this.setState({ dayCalendarContent: content });
  }
  
  updateYearCalendarContent = (): void => {
    let yearsContent: number[] = []
    for (let year = 1900; year <= 2100; year++) {
      yearsContent.push(year);
    }

    this.setState({ yearCalendarContent: yearsContent });
  }

  previousMonth = (): void => {
    this.state.selectedDate.setMonth(this.state.selectedDate.getMonth() - 1)
    this.setState({ selectedMonth: this.state.selectedDate.toLocaleString("locale", { month: "long" }) });
    this.setState({ selectedYear: this.state.selectedDate.getFullYear() });

    this.updateDayCalendarContent();
  }

  nextMonth = (): void => {
    this.state.selectedDate.setMonth(this.state.selectedDate.getMonth() + 1)
    this.setState({ selectedMonth: this.state.selectedDate.toLocaleString("locale", { month: "long" }) });
    this.setState({ selectedYear: this.state.selectedDate.getFullYear() });
    
    this.updateDayCalendarContent();
  }

  setDateToPresent = (): void => {
    const presentDate = new Date();
    const day = presentDate.getDate();
    const month = presentDate.getMonth() - 1;
    const year = presentDate.getFullYear();

    this.props.updatePickedDate( day, month, year );

    this.setState({
      selectedDate: presentDate,
      selectedMonth: presentDate.toLocaleString("locale", { month: "long" }),
      selectedYear: presentDate.getFullYear()
    });

    this.setState({}, () => {
      this.updateDayCalendarContent();
      this.updateYearCalendarContent();
    });
  }
      
  updateSelectedMonth = (month: string): void => {  
    this.state.selectedDate.setMonth(this.state.monthCalendarContent.indexOf(month));
    this.setState({ selectedMonth: this.Months[month as keyof typeof this.Months].name });
  }

  updateSelectedYear = (year: number): void => {    
    this.state.selectedDate.setFullYear(year);
    this.setState({ selectedYear: year });
  }

  render() {
    return (
      <View theme={this.state.theme} style={[
        this.styles.container,
        { borderColor: this.props.theme === "light" ? "black" : "#666"},
      ]} >
        <View style={this.styles.header}>
          <Pressable
            onPress={this.changeCalendar}
            style={({ pressed }) => [
              { backgroundColor: pressed ? "#AAA" : "transparent" },
              { pointerEvents: "box-only" }
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
                { pointerEvents: "box-only" }
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
                { pointerEvents: "box-only" }
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
          {
            this.state.selectedCalendar === "DayCalendar"
              ? <DayCalendar
                state={this.state}
                updatePickedDate={this.props.updatePickedDate}
                togglePickerWindow={this.props.togglePickerWindow}
              />
              : <YearCalendar
                state={this.state}
                updateSelectedYear={this.updateSelectedYear}
                updateSelectedMonth={this.updateSelectedMonth}
                changeCalendar={this.changeCalendar}
              />
          }
        </View>
        <View style={this.styles.footer}>
          <Pressable
            style={({ pressed }) => [{ backgroundColor: pressed ? "#BBB" : "transparent" }]}
          >
            <Text theme={this.state.theme} selectable={false} >Clear</Text>
          </Pressable>
          <Pressable
            onPress={this.setDateToPresent}
              style={({ pressed }) => [{ backgroundColor: pressed ? "#BBB" : "transparent" },
              { pointerEvents: "box-only" }]}
          >
            <Text theme={this.state.theme} selectable={false} >Today</Text>
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
    headerArrow: {
      margin: "auto",
    },
    changeMonthButtons: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      columnGap: 5,
    },
    calendar: {
      flex: 6,
      paddingHorizontal: 5,
      minHeight: 190,
      maxHeight: 190,
    },
    footer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 15,
      marginVertical: 5,
    }
  });

  Months = {
    "Jan": {
      "name": "January",
      "short": "Jan",
      "number": 1,
      "days": 31
    },
    "Feb": {
      "name": "February",
      "short": "Feb",
      "number": 2,
      "days": 28
    },
    "Mar": {
      "name": "March",
      "short": "Mar",
      "number": 3,
      "days": 31
    },
    "Apr": {
      "name": "April",
      "short": "Apr",
      "number": 4,
      "days": 30
    },
    "May": {
      "name": "May",
      "short": "May",
      "number": 5,
      "days": 31
    },
    "Jun": {
      "name": "June",
      "short": "Jun",
      "number": 6,
      "days": 30
    },
    "Jul": {
      "name": "July",
      "short": "Jul",
      "number": 7,
      "days": 31
    },
    "Aug": {
      "name": "August",
      "short": "Aug",
      "number": 8,
      "days": 31
    },
    "Sep": {
      "name": "September",
      "short": "Sep",
      "number": 9,
      "days": 30
    },
    "Oct": {
      "name": "October",
      "short": "Oct",
      "number": 10,
      "days": 31
    },
    "Nov": {
      "name": "November",
      "short": "Nov",
      "number": 11,
      "days": 30
    },
    "Dec": {
      "name": "December",
      "short": "Dec",
      "number": 12,
      "days": 31
    }
  }
}

interface DatePickerStyles {
  borderWidth?: number
  borderColor?: string
  borderColorFocused?: string
  borderRadius?: number
  fontSize?: number
  backgroundColor?: string
  padding?: number
  margin?: number
}

interface DatePickerProps {
  onDateChange: (date: Date) => void
  selectedDate?: Date
  theme?: "dark" | "light"
  width?: DimensionValue
  height?: DimensionValue
  style?: DatePickerStyles
}

interface DatePickerState {
  pickedDate: Date
  pickedDay: number
  pickedMonth: number
  pickedYear: number

  displayDay: string
  displayMonth: string
  displayYear: string

  monthCalendarContent: string[]

  dayInputWidth: number
  monthInputWidth: number
  yearInputWidth: number
  isDatePickerInputFocused: boolean
  isDayInputFocused: boolean
  isMonthInputFocused: boolean
  isYearInputFocused: boolean
  newYearInputEvent: boolean
  isPickerWindowOpened: boolean
  isNativePickerOpen: boolean
  theme: "dark" | "light"
  width: DimensionValue 
  height: DimensionValue
} 

/**
   * A date picker with mm/dd/yyyy text inputs 
   * as well as a calendar date picker.
   * 
   * @prop onDateChange Date change handler.
   * @prop (optional) selectedDate The currently selected date - default is the present date
   * @prop (optional) theme: "light" | "dark" - default: light 
   * @prop (optional) width: DimensionValue | undefined - default: 100
   * @prop (optional) height: DimensionValue | undefined - default: 20
   * @prop (optional) style: DatePickerStyles 
   * { borderWidth: number
   * , borderColor: string
   * , borderRadius: number
   * , backgroundColor: string
   * , padding: number
   * , margin: number }
   */
export default class DatePicker extends Component<DatePickerProps, DatePickerState> {
  private inputPressableRef: RefObject<any>;

  static defaultProps = {
    theme: "light" as "dark" | "light",
    width: 100,
    height: 20,
    fontSize: 15,
  }

  constructor(props: DatePickerProps) {
    super(props);
    
    let currentDate = props.selectedDate ?? new Date();
    this.inputPressableRef = createRef<any>();
    
    this.state = {
      pickedDate: currentDate,
      pickedDay: currentDate.getDate(),
      pickedMonth: currentDate.getMonth() + 1,
      pickedYear: currentDate.getFullYear(),

      displayDay: currentDate.getDate().toString(),
      displayMonth: currentDate.getMonth().toString(),
      displayYear: currentDate.getFullYear().toString(),

      monthCalendarContent: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

      dayInputWidth: (this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize) * 1.25,
      monthInputWidth: (this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize) * 1.25,
      yearInputWidth: (this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize) * 2.5,
      isDatePickerInputFocused: false,
      isDayInputFocused: false,
      isMonthInputFocused: false,
      isYearInputFocused: false,
      newYearInputEvent: false,
      isPickerWindowOpened: false,
      isNativePickerOpen: false,
      theme: props.theme ?? DatePicker.defaultProps.theme,
      width: props.width ?? DatePicker.defaultProps.width,
      height: props.height ?? DatePicker.defaultProps.height
    }
  }

  componentDidMount(): void {
    this.updateDisplayDate(this.state.pickedDay, this.state.pickedMonth, this.state.pickedYear);
  }

  componentDidUpdate(prevProps: DatePickerProps): void {
    if (this.props.theme !== prevProps.theme && this.props.theme !== undefined) {
      this.setState({theme: this.props.theme});
    }
  }

  togglePickerWindow = (): void => {
    if (this.state.isPickerWindowOpened) {
      this.setState({isPickerWindowOpened: false});
    } else {
      this.setState({isPickerWindowOpened: true});
    }
  }

  closePickerWindow = (): void => {
    this.setState({isPickerWindowOpened: false});
  }

  // Set picked, display and date states to the present date
  setDateToPresent = (): void => {
    const presentDate = new Date();
    const day = presentDate.getDate();
    const month = presentDate.getMonth() + 1;
    const year = presentDate.getFullYear();

    this.updatePickedDate(day, month, year);
    this.updateDisplayDate(day, month, year)
  }

  /**
   * Update display date states
   * 
   * @param day number in range 1-31
   * @param month number in range 1-12
   * @param year number (4-digit)
   */
  updateDisplayDate = (day: number, month: number, year: number): void => {
    if (day < 1 || day > 31 ) {
      throw new Error("Display date update day out of range.");
    }
    if (month < 1 || month > 12) {
      throw new Error("Display date update month out of range.");
    } 
    if (year < 1000 || year > 9999) {
      throw new Error("Display date update year out of range.");
    }

    let dayString = "01";
    let monthString = "01";
    if (day < 10) dayString = "0" + day.toString();
    else dayString = day.toString();
    if (month < 10) monthString = "0" + month.toString();
    else monthString = month.toString();
    this.setState({
      displayDay: dayString,
      displayMonth: monthString,
      displayYear: year.toString()
    });
  }

  /**
   * Update picked date states
   * 
   * @param day number in range 1-31
   * @param month number in range 1-12
   * @param year number (4-digit)
   */
  updatePickedDate = (day: number, month: number, year: number): void => { 
    day < 1 ? day = 1 : day > 31 ? day = 31 : null;
    month < 1 ? month = 1 : month > 12 ? month = 12 : null;
    year < 1000 ? year = 1000 : year > 9999 ? year = 9999 : null;

    const newDate = new Date(year, month-1, day);
    this.setState({
      pickedDate: newDate,
      pickedDay: day,
      pickedMonth: month,
      pickedYear: year,
    });
    this.props.onDateChange(newDate);
    this.updateDisplayDate(day, month, year);
  }

  onDayKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayDay;
    let numbers = '0123456789';
    let months_31_day = [ 1, 3, 5, 7, 8, 10, 12];
    
    if(numbers.indexOf(key) < 0 && key !== "Backspace") {
      return;
    }
    const oldTextInt = parseInt(oldText);
    const keyInt = parseInt(key);
    if (key === "Backspace") {
      newText = "dd";
      this.setState({
        displayDay: newText,
      });
      return;
    }
    else {
      if ((oldTextInt > 3 || oldTextInt <= 0) && keyInt != 0) {
        newText = "0" + key;
      } 
      else if (oldTextInt <= 0 && keyInt <= 0) {
        newText = "01";
      }
      else if (oldTextInt == 3) {
        if (keyInt > 1 || // not a 31-day month
        (months_31_day.indexOf(this.state.pickedMonth) < 0 && keyInt != 0 )) {
          newText = "0" + key;
        }
        else newText = oldTextInt.toString() + key;
      }
      else if (oldTextInt <= 2) {
        if (keyInt == 9 && this.state.pickedMonth == 2 && this.state.pickedYear % 4 != 0) {
          newText = "0" + key;
        }
        else newText = oldTextInt.toString() + key;
      } 
      else if (oldText.length <= 1) {
        newText = oldTextInt.toString() + key;
      } 
      else {
        newText = "01";
      }
    }
    
    this.setState({
      displayDay: newText,
    });
  }

  onMonthKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayMonth;
    let numbers = '0123456789';
    
    if(numbers.indexOf(key) < 0 && key !== "Backspace") {
      return;
    }
    
    if (key === "Backspace") {
      newText = "mm";
      this.setState({
        displayMonth: newText,
      });
      return;
    }
    else {
      if (parseInt(oldText) == 1 && parseInt(key) <= 2 ) {
        newText = parseInt(oldText).toString() + key;
      }
      else if (parseInt(oldText) == 1 && parseInt(key) > 2 ) {
        newText = "0" + key;
      }
      else if (parseInt(oldText) != 1 && parseInt(key) != 0) {
        newText = "0" + key;
      }
      else {
        newText = "01";
      }
    }
    
    this.setState({
      displayMonth: newText,
    });
  }

  onYearKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayYear;
    let numbers = '0123456789';

    if(numbers.indexOf(key) < 0 && key !== "Backspace") {
      return;
    }
    if (key === "Backspace") {
      newText = "yyyy";
      this.setState({
        displayYear: newText,
      });
      return;
    }

    if (this.state.newYearInputEvent) {
      if (parseInt(key) < 1 || parseInt(key) > 2) return;
      newText = "000" + key;
    } 
    else {
      newText = oldText.substring(1, 4) + key;
    } 
    
    this.setState({
      newYearInputEvent: false,
      displayYear: newText,
    });
  }

  render() {
    const inputsBgColor = "#48B";

    return (
      <View
        style={[
          this.styles.container,
          { width: this.state.width },
          { height: this.state.height },
        ]}
      >
        <Pressable
          ref={this.inputPressableRef}
          onPress={() => this.closePickerWindow()}
          onFocus={() => this.setState({ isDatePickerInputFocused: true })}
          onBlur={() => this.setState({ isDatePickerInputFocused: false })}
        >
          <View
            theme={this.state.theme}
            style={[
              this.styles.datePickerInput,
              this.props.style,
              this.state.isDatePickerInputFocused ? this.styles.inputFocused : this.styles.inputUnfocused,
            ]}
          >
            <View style={this.styles.inputsWrapper} >
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.monthInputWidth },
                  { backgroundColor: this.state.isMonthInputFocused ? inputsBgColor : "transparent" },
                  Platform.OS === "web" //@ts-ignore
                  ? { outline: "none" }: null
                ]}
                value={this.state.displayMonth}
                onKeyPress={(e) => { this.onMonthKeyPress(e.nativeEvent.key); }}
                caretHidden={true}
                inputMode="numeric"
                keyboardType="number-pad"
                editable={Platform.OS === "web" ? false : true}
                onFocus={() => this.setState({ 
                  isMonthInputFocused: true,
                  isDatePickerInputFocused: true
                })}
                onBlur={() => {
                  this.setState({ 
                    isMonthInputFocused: false,
                    isDatePickerInputFocused: false 
                  });
                  this.updatePickedDate(
                    parseInt(this.state.displayDay),
                    parseInt(this.state.displayMonth),
                    parseInt(this.state.displayYear)
                  );
                }}
                blurOnSubmit={true}
                maxLength={2}
              />
              <Text theme={this.state.theme} style={this.styles.slash} >/</Text>
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.dayInputWidth },
                  { backgroundColor: this.state.isDayInputFocused ? inputsBgColor : "transparent" },
                  Platform.OS === "web" //@ts-ignore
                  ? { outline: "none" }: null
                ]}
                value={this.state.displayDay}
                onKeyPress={(e) => { this.onDayKeyPress(e.nativeEvent.key); }}
                caretHidden={true}
                inputMode="numeric"
                keyboardType="number-pad"
                returnKeyType='google'
                editable={Platform.OS === "web" ? false : true}
                onFocus={() => this.setState({ 
                  isDayInputFocused: true,
                  isDatePickerInputFocused: true
                })}
                onBlur={() => {
                  this.setState({ 
                    isDayInputFocused: false,
                    isDatePickerInputFocused: false
                  });
                  this.updatePickedDate(
                    parseInt(this.state.displayDay),
                    parseInt(this.state.displayMonth),
                    parseInt(this.state.displayYear)
                  );
                }}
                blurOnSubmit={true}
                maxLength={2}
              />
              <Text theme={this.state.theme} style={this.styles.slash} >/</Text>
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.yearInputWidth },
                  { backgroundColor: this.state.isYearInputFocused ? inputsBgColor : "transparent" },
                  Platform.OS === "web" //@ts-ignore
                  ? { outline: "none" }: null
                ]}
                value={this.state.displayYear}
                onKeyPress={(e) => { this.onYearKeyPress(e.nativeEvent.key); }}
                caretHidden={true}
                //inputMode="numeric"
                keyboardType="number-pad"
                editable={Platform.OS === "web" ? false : true}
                onFocus={() => this.setState({
                  isYearInputFocused: true, 
                  isDatePickerInputFocused: true,
                  newYearInputEvent: true 
                })}
                onBlur={() => {
                  this.setState({
                    isYearInputFocused: false,
                    isDatePickerInputFocused: false
                  });
                  this.updatePickedDate(
                    parseInt(this.state.displayDay),
                    parseInt(this.state.displayMonth),
                    parseInt(this.state.displayYear)
                  );
                }}
                blurOnSubmit={true}
                maxLength={4}
              />
            </View>
            <Pressable 
              onPressIn={() => this.setState({ isDatePickerInputFocused: true })}
              onPress={() => this.togglePickerWindow()}
              style={this.styles.button}
            >
              <AntDesign
                name="calendar"
                size={this.styles.slash.fontSize}
                color={this.state.theme === "light" ? "black" : "white"}
              />
            </Pressable>
          </View>
        </Pressable>
        {
        this.state.isPickerWindowOpened
        ? Platform.OS === ("android")
          ? <NativeDatePicker // Native component works only in development build
              modal={true}
              mode="date"
              open={this.state.isPickerWindowOpened}
              date={this.state.pickedDate}
              onConfirm={(date) => {
                this.updatePickedDate(date.getDay(),date.getMonth() - 1, date.getFullYear());
                this.setState({ isPickerWindowOpened: false });
              }}
              onCancel={() => {
                this.setState({ isPickerWindowOpened: false });
              }}
              theme={this.state.theme}
            />
          : <View 
              style={{ zIndex: 20}}
            >
              <PickerWindow
                pickedDate={this.state.pickedDate}
                theme={this.state.theme}
                updatePickedDate={this.updatePickedDate}
                togglePickerWindow={this.togglePickerWindow}
              />
            </View>
        : null
        }
      </View>
    );  
  }

  styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      zIndex: 10,
      margin: this.props.style?.margin ?? 0,
    },
    datePickerInput: {
      flex: -1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: this.props.style?.borderRadius ?? 3,
      zIndex: 10,
      padding: 0,
    },
    inputsWrapper: {
      flex: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      columnGap: 0,
    },
    inputUnfocused: {
      borderColor: this.props.style?.borderColor ?? "#999",
      borderWidth: this.props.style?.borderWidth ?? 1,
      padding: this.props.style?.padding ?? 2,
    },
    inputFocused: {
      borderColor: this.props.style?.borderColorFocused ?? "#CCC",
      borderWidth:
        this.props.style?.borderWidth === undefined
        ? 2
        : this.props.style.borderWidth === 0 ? 0 : this.props.style.borderWidth + 1,
      padding: 
        this.props.style?.padding === undefined
        ? 1
        : this.props.style?.borderWidth === undefined
          ? this.props.style.padding
          : this.props.style.borderWidth === 0 ? this.props.style?.padding : this.props.style?.padding - 1,
    },
    textInput: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      textAlign: "center",
      verticalAlign: "middle",
      fontSize: this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize,
    },
    slash: {
      margin: 0,
      fontSize: this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize,
      padding: 0,
    },
    button: {
      textAlign: "center",
      paddingVertical: 2,
      paddingHorizontal: 8,
    }
  });
}
