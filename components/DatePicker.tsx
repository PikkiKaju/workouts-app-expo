
import  React, { Component, RefObject  } from 'react';
import {
  Platform,
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableWithoutFeedback as DefaultTouchableWithoutFeedback,
} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import NativeDatePicker from 'react-native-date-picker' ;
import { DimensionValue, TextStyle, ViewStyle } from 'react-native/Libraries/StyleSheet/StyleSheetTypes';

type ThemeProps = {
  theme?: string
  lightColor?: string;
  darkColor?: string;
};

type TextInputProps = ThemeProps & DefaultTextInput["props"];
type TextProps = ThemeProps & DefaultText['props'];
type ViewProps = ThemeProps & DefaultView['props'];
type TouchableWithoutFeedbackProps = ThemeProps & DefaultTouchableWithoutFeedback['props'];

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
  const darkColor = "#333";//"#181818";
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
  updatePickedDate: ({ day, month, year }: CalendarTileProps) => void
  togglePickerWindow: () => void
}

class DayCalendar extends Component<DayCalendarProps> {
  constructor(props: any) {
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
  updatePickedDate: ({ day, month, year }: CalendarTileProps) => void
  togglePickerWindow: () => void
}

class DayCalendarTile extends Component<DayCalendarTileProps> {    
  constructor(props: any) {
    super(props);
  }

  render() {
    const updateDateData: CalendarTileProps = {
      day: this.props.day,
      month: this.props.month,
      year: this.props.year
    }
   
    return (
      <Pressable
        onPress={() => {
          this.props.updatePickedDate(updateDateData);
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

  updatePickedDate: ({ day, month, year }: CalendarTileProps) => void
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
    const month = presentDate.toLocaleString("locale", { month: "long" });
    const year = presentDate.getFullYear();

    this.props.updatePickedDate({ day, month, year });

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

interface DatePickerProps {
  theme: "dark" | "light"
  width: DimensionValue | undefined
  height: DimensionValue | undefined
  style: ViewStyle & TextStyle 
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
} 

export default class DatePicker extends Component<DatePickerProps, DatePickerState> {
  private componentRef: RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    
    let currentDate = new Date();
    
    this.state = {
      pickedDate: currentDate,
      pickedDay: currentDate.getDate(),
      pickedMonth: currentDate.getMonth() + 1, //currentDate.toLocaleString("locale", { month: "long" }),
      pickedYear: currentDate.getFullYear(),

      displayDay: currentDate.getDate().toString(),
      displayMonth: currentDate.getMonth().toString(),
      displayYear: currentDate.getFullYear().toString(),

      monthCalendarContent: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],

      dayInputWidth: 20,
      monthInputWidth: 20,
      yearInputWidth: 40,
      isDatePickerInputFocused: false,
      isDayInputFocused: false,
      isMonthInputFocused: false,
      isYearInputFocused: false,
      newYearInputEvent: false,
      isPickerWindowOpened: false,
      isNativePickerOpen: false,
      theme: props.theme
    }

    this.componentRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount(): void {
    let dayString = "01";
    let monthString = "01";
    if (this.state.pickedDay < 10) dayString = "0" + this.state.pickedDay.toString()
    else dayString = this.state.pickedDay.toString()
    if (this.state.pickedMonth < 10) monthString = "0" + this.state.pickedMonth.toString()
    else monthString = this.state.pickedMonth.toString()
    this.setState({
      displayDay: dayString,
      displayMonth: monthString
    });
  }

  componentDidUpdate(prevProps: Readonly<{ theme: "dark" | "light"; }>): void {
    if (this.props.theme !== prevProps.theme) {
      this.setState({
        theme: this.props.theme,
      });
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

  handleOutsidePress = (): void => {
    if (this.state.isPickerWindowOpened) {
      this.setState({ isPickerWindowOpened: false });
    }
  };

  setDateToPresent = (): void => {
    const presentDate = new Date();
    const day = presentDate.getDate();
    const month = presentDate.toLocaleString("locale", { month: "long" });
    const year = presentDate.getFullYear();

    this.updatePickedDate({ day, month, year });
  }
      
  updatePickedDate = ({ day, month, year }: CalendarTileProps): void => { 
    const newDate = new Date(year, this.state.monthCalendarContent.indexOf(month), day);
    this.setState({
      pickedDate: newDate,
      pickedDay: day,
      pickedMonth: this.state.monthCalendarContent.indexOf(month),
      pickedYear: year,

      displayDay: day.toString(),
      displayMonth: (this.state.monthCalendarContent.indexOf(month) + 1).toString(),
      displayYear: year.toString(),
    });
  }

  onDayKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayDay;
    let numbers = '0123456789';
    let months_31_day = [ 1, 3, 5, 7, 8, 10, 12]

    if(numbers.indexOf(key) < 0 ) {
      key = "";
      return;
    }

    if (parseInt(oldText) > 3) {
      newText = "0" + key;
    } 
    else if (parseInt(oldText) <= 2
      && parseInt(key) <= 8
    ) { // for every month
      newText = parseInt(oldText).toString() + key;
    }
    else if (this.state.pickedMonth == 2
      && parseInt(oldText) < 3
      && parseInt(key) != 0
    ) { // for February 
      newText = parseInt(oldText).toString() + key;
    }
    else if (months_31_day.indexOf(this.state.pickedMonth) < 0
      && this.state.pickedMonth != 2
      && parseInt(oldText) <= 3
      && parseInt(key) == 0
    ) { //for every 30-day month 
      newText = parseInt(oldText).toString() + key;
    }
    else if (months_31_day.indexOf(this.state.pickedMonth) > -1
      && this.state.pickedMonth != 2
      && parseInt(oldText) <= 3
      && parseInt(key) <= 1
    ) { //for every 31-day month 
      newText = parseInt(oldText).toString() + key;
    } else {
      newText = "00";
    }

    this.setState({
      displayDay: newText,
    });
    this.updatePickedDate({ day: parseInt(newText), month: this.state.monthCalendarContent[this.state.pickedMonth], year: this.state.pickedYear});
  }

  onMonthKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayMonth;
    let numbers = '0123456789';

    if(numbers.indexOf(key) < 0 ) {
      key = "";
      return;
    }

    if (parseInt(oldText) > 1) {
      newText = "0" + key;
    } 
    else if (parseInt(oldText) == 0) { // for every month
      newText = parseInt(oldText).toString() + key;
    }
    else if (parseInt(oldText) == 1 && parseInt(key) <= 2) { // for months 10, 11 and 12 
      newText = parseInt(oldText).toString() + key;
    }
    else {
      newText = oldText;
    }
    
    this.setState({
      displayMonth: newText,
    });
    this.updatePickedDate({ day: this.state.pickedDay, month: this.state.monthCalendarContent[parseInt(newText) - 1], year: this.state.pickedYear});
  }

  onYearKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayYear;
    let numbers = '0123456789';

    if(numbers.indexOf(key) < 0 ) {
      key = "";
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
    this.updatePickedDate({ day: this.state.pickedDay, month: this.state.monthCalendarContent[this.state.pickedMonth], year: parseInt(newText) });
  }

  render() {
    return (
      <View
        style={[
          this.styles.container,
          { width: this.props.width },
          { height: this.props.height },
        ]}
      >
        <Pressable
          onFocus={() => { this.setState({ isDatePickerInputFocused: true }) }}
          onBlur={() => { this.setState({ isDatePickerInputFocused: false }) }}
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
                  { backgroundColor: this.state.isMonthInputFocused ? "#44F" : "transparent" },
                  Platform.OS === "web"
                    ?
                    //@ts-ignore 
                    { outline: "none" }
                    : null,
                ]}
                value={this.state.displayMonth}
                onKeyPress={(e) => { this.onMonthKeyPress(e.nativeEvent.key); }}
                inputMode="numeric"
                keyboardType="number-pad"
                editable={Platform.OS === "web" ? false : true}
                onFocus={() => this.setState({ isMonthInputFocused: true })}
                onBlur={() => this.setState({ isMonthInputFocused: false })}
                maxLength={2}
              />
              <Text theme={this.state.theme} style={this.styles.slash} >/</Text>
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.dayInputWidth },
                  { backgroundColor: this.state.isDayInputFocused ? "#44F" : "transparent" },
                  Platform.OS === "web"
                    ?
                    //@ts-ignore 
                    { outline: "none" }
                    : null,
                ]}
                value={this.state.displayDay}
                onKeyPress={(e) => { this.onDayKeyPress(e.nativeEvent.key); }}
                inputMode="numeric"
                keyboardType="number-pad"
                editable={Platform.OS === "web" ? false : true}
                onFocus={() => this.setState({ isDayInputFocused: true })}
                onBlur={() => this.setState({ isDayInputFocused: false })}
                maxLength={2}
              />
              <Text theme={this.state.theme} style={this.styles.slash} >/</Text>
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.yearInputWidth },
                  { backgroundColor: this.state.isYearInputFocused ? "#44F" : "transparent" },
                  Platform.OS === "web"
                    ?
                    //@ts-ignore 
                    { outline: "none" }
                    : null,
                ]}
                value={this.state.displayYear}
                onKeyPress={(e) => { this.onYearKeyPress(e.nativeEvent.key); }}
                inputMode="numeric"
                keyboardType="number-pad"
                editable={Platform.OS === "web" ? false : true}
                onFocus={() => this.setState({ isYearInputFocused: true, newYearInputEvent: true })}
                onBlur={() => this.setState({ isYearInputFocused: false })}
                maxLength={4}
              />
            </View>
            <Pressable
              onPress={this.togglePickerWindow}
            >
              <AntDesign
                name="calendar"
                size={15}
                color={this.state.theme === "light" ? "black" : "white"}
                style={this.styles.icon}
              />
            </Pressable>
          </View>
        </Pressable>
        {
        this.state.isPickerWindowOpened
        ? Platform.OS === "ios"
          ? <NativeDatePicker
              modal={true}
              mode="date"
              open={this.state.isPickerWindowOpened}
              date={this.state.pickedDate}
              onConfirm={(date) => {
                this.updatePickedDate({
                  day: date.getDay(),
                  month: date.toLocaleString("locale", { month: "short" }),
                  year: date.getFullYear(),
                });
                this.setState({ isPickerWindowOpened: false });
              }}
              onCancel={() => {
                this.setState({ isPickerWindowOpened: false });
              }}
              theme={this.state.theme}
            />
          : <View style={{ zIndex: 20 }}>
              <Pressable
                style={[
                  this.styles.overlay,
                  //@ts-ignore 
                  { cursor: "default" }
                ]}
                onPress={this.closePickerWindow}
              />
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
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 19,
      backgroundColor: 'transparent',
    },
    datePickerInput: {
      flex: -1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 3,
      zIndex: 10,
    },
    inputsWrapper: {
      flex: 5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      columnGap: 0,
    },
    inputUnfocused: {
      borderColor: "#999",
      borderWidth: 1,
    },
    inputFocused: {
      borderColor: "#CCC",
      borderWidth: 2,
      padding: 2,
    },
    textInput: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      textAlign: "center",
      verticalAlign: "middle",
    },
    slash: {
      margin: 0,
      fontSize: this.props.style.fontSize,
      padding: 0,
    },
    icon: {
      marginRight: 8,
    },
  });
}
