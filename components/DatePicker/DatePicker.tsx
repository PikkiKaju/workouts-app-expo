import React, { Component, createRef, RefObject } from "react";
import {
  Platform,
  TextInput as DefaultTextInput,
  StyleSheet,
  Pressable,
  StyleProp,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import NativeDatePicker from "react-native-date-picker";
import {
  DimensionValue,
  ViewStyle,
} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

import { Text, TextInput, View } from "./Themed";
import PickerWindow from "./PickerWindow";

interface DatePickerStyles {
  borderWidth?: number;
  borderColor?: string;
  borderColorFocused?: string;
  borderRadius?: number;
  fontSize?: number;
  backgroundColor?: string;
  padding?: number;
  margin?: number;
}

interface DatePickerProps {
  onDateChange: (date: Date) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  selectedDate?: Date;
  theme?: "dark" | "light";
  width?: DimensionValue;
  height?: DimensionValue;
  icon: boolean;
  iconPosition?: "start" | "end";
  style?: DatePickerStyles & ViewStyle;
}

interface DatePickerState {
  pickedDate: Date;
  pickedDay: number;
  pickedMonth: number;
  pickedYear: number;

  displayDay: string;
  displayMonth: string;
  displayYear: string;

  dayInputWidth: number;
  monthInputWidth: number;
  yearInputWidth: number;
  isDatePickerInputFocused: boolean;
  isDayInputFocused: boolean;
  isMonthInputFocused: boolean;
  isYearInputFocused: boolean;
  newYearInputEvent: boolean;
  isPickerWindowOpened: boolean;
  isNativePickerOpen: boolean;
  theme: "dark" | "light";
  width: DimensionValue;
  height: DimensionValue;
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
 * @prop (optional) icon: boolean - default: true
 * @prop (optional) iconPosition: "start" | "end" - default: end
 * @prop (optional) style: DatePickerStyles
 * { borderWidth: number
 * , borderColor: string
 * , borderRadius: number
 * , backgroundColor: string
 * , padding: number
 * , margin: number
 * } & ViewStyle
 */
export default class DatePicker extends Component<
  DatePickerProps,
  DatePickerState
> {
  inputPressableRef: RefObject<any>;
  monthInputRef: RefObject<DefaultTextInput | null>;
  dayInputRef: RefObject<DefaultTextInput | null>;
  yearInputRef: RefObject<DefaultTextInput | null>;
  pickerWindowRef: RefObject<any>;

  static defaultProps = {
    theme: "light" as "dark" | "light",
    width: 100,
    height: 20,
    icon: true,
    iconPosition: "end",
    fontSize: 15,
  };

  constructor(props: DatePickerProps) {
    super(props);

    let currentDate = props.selectedDate ?? new Date();
    this.inputPressableRef = createRef<any>();
    this.monthInputRef = createRef<DefaultTextInput>();
    this.dayInputRef = createRef<DefaultTextInput>();
    this.yearInputRef = createRef<DefaultTextInput>();
    this.pickerWindowRef = createRef<any>();

    if (props.style && props.style.fontSize && props.height) {
      if (Number.isInteger(props.height)) {
        //@ts-ignore
        if (props.style.fontSize > props.height) props.style.fontSize = props.height;
      } else {
        props.style.fontSize = DatePicker.defaultProps.fontSize;
      }
    }

    this.state = {
      pickedDate: currentDate,
      pickedDay: currentDate.getDate(),
      pickedMonth: currentDate.getMonth() + 1,
      pickedYear: currentDate.getFullYear(),

      displayDay: currentDate.getDate().toString(),
      displayMonth: currentDate.getMonth().toString(),
      displayYear: currentDate.getFullYear().toString(),

      dayInputWidth:
        (this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize) * 1.25,
      monthInputWidth:
        (this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize) * 1.25,
      yearInputWidth:
        (this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize) * 2.5,
      isDatePickerInputFocused: false,
      isDayInputFocused: false,
      isMonthInputFocused: false,
      isYearInputFocused: false,
      newYearInputEvent: false,
      isPickerWindowOpened: false,
      isNativePickerOpen: false,
      theme: props.theme ?? DatePicker.defaultProps.theme,
      width: props.width ?? DatePicker.defaultProps.width,
      height: props.height ?? DatePicker.defaultProps.height,
    };

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  }

  componentDidMount(): void {
    if (Platform.OS === "web") {
      document.addEventListener("mousedown", this.handleOutsideClick);
    }
    this.updateDisplayDate(
      this.state.pickedDay,
      this.state.pickedMonth,
      this.state.pickedYear
    );
  }

  componentWillUnmount(): void {
    if (Platform.OS === "web") {
      document.removeEventListener("mousedown", this.handleOutsideClick);
    }
  }

  componentDidUpdate(prevProps: DatePickerProps): void {
    if (
      this.props.theme !== prevProps.theme &&
      this.props.theme !== undefined
    ) {
      this.setState({ theme: this.props.theme });
    }
  }

  togglePickerWindow = (): void => {
    if (this.state.isPickerWindowOpened) {
      this.setState({ isPickerWindowOpened: false });
      this.focus();
    } else {
      this.setState({ isPickerWindowOpened: true });
    }
  };

  closePickerWindow = (): void => {
    this.setState({ isPickerWindowOpened: false });
  };

  blurDatePicker = (): void => {
    this.setState({ isDatePickerInputFocused: false });
  };

  handleOutsideClick = (event: MouseEvent) => {
    if (
      this.pickerWindowRef.current &&
      !this.pickerWindowRef.current.contains(event.target as Node) &&
      this.inputPressableRef.current &&
      !this.inputPressableRef.current.contains(event.target as Node)
    ) {
      this.setState({
        isPickerWindowOpened: false,
        isDatePickerInputFocused: false,
      });
    }
  };

  // Set picked, display and date states to the present date
  setDateToPresent = (): void => {
    const presentDate = new Date();
    const day = presentDate.getDate();
    const month = presentDate.getMonth() + 1;
    const year = presentDate.getFullYear();

    this.updatePickedDate(day, month, year);
    this.updateDisplayDate(day, month, year);
  };

  /**
   * Update display date states
   *
   * @param day number in range 1-31
   * @param month number in range 1-12
   * @param year number (4-digit)
   *
   * @Override
   * Update display date states with string values
   *
   * @param day string 2-characters
   * @param month string 2-characters
   * @param year string 4-characters
   */
  updateDisplayDate: {
    (day: number, month: number, year: number): void;
    (day: string, month: string, year: string): void;
  } = (
    day: number | string,
    month: number | string,
    year: number | string
  ): void => {
    if (
      typeof day === "string" &&
      typeof month === "string" &&
      typeof year === "string"
    ) {
      this.setState({
        displayDay: day,
        displayMonth: month,
        displayYear: year,
      });
    } else if (
      typeof day === "number" &&
      typeof month === "number" &&
      typeof year === "number"
    ) {
      if (day < 1 || day > 31) {
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
        displayYear: year.toString(),
      });
    }
  };

  /**
   * Update picked date states
   *
   * @param day number in range 1-31
   * @param month number in range 1-12
   * @param year number (4-digit)
   */
  updatePickedDate = (day: number, month: number, year: number): void => {
    day < 1 ? (day = 1) : day > 31 ? (day = 31) : null;
    month < 1 ? (month = 1) : month > 12 ? (month = 12) : null;
    year < 1000 ? (year = 1000) : year > 9999 ? (year = 9999) : null;

    const newDate = new Date(year, month - 1, day);
    this.setState({
      pickedDate: newDate,
      pickedDay: day,
      pickedMonth: month,
      pickedYear: year,
    });
    this.updateDisplayDate(day, month, year);
    this.props.onDateChange(newDate);
  };

  onDayKeyPress(key: string) {
    let newText = "";
    let oldText = this.state.displayDay;
    let numbers = "0123456789";
    let months_31_day = [1, 3, 5, 7, 8, 10, 12];

    if (numbers.indexOf(key) < 0 && key !== "Backspace") {
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
    } else {
      if ((oldTextInt > 3 || oldTextInt <= 0) && keyInt != 0) {
        newText = "0" + key;
      } else if (oldTextInt <= 0 && keyInt <= 0) {
        newText = "01";
      } else if (oldTextInt == 3) {
        if (
          keyInt > 1 || // not a 31-day month
          (months_31_day.indexOf(this.state.pickedMonth) < 0 && keyInt != 0)
        ) {
          newText = "0" + key;
        } else newText = oldTextInt.toString() + key;
      } else if (oldTextInt <= 2) {
        if (
          keyInt == 9 &&
          this.state.pickedMonth == 2 &&
          this.state.pickedYear % 4 != 0
        ) {
          newText = "0" + key;
        } else newText = oldTextInt.toString() + key;
      } else if (oldText.length <= 1) {
        newText = oldTextInt.toString() + key;
      } else {
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
    let numbers = "0123456789";

    if (numbers.indexOf(key) < 0 && key !== "Backspace") {
      return;
    }

    if (key === "Backspace") {
      newText = "mm";
      this.setState({
        displayMonth: newText,
      });
      return;
    } else {
      if (parseInt(oldText) == 1 && parseInt(key) <= 2) {
        newText = parseInt(oldText).toString() + key;
      } else if (parseInt(oldText) == 1 && parseInt(key) > 2) {
        newText = "0" + key;
      } else if (parseInt(oldText) != 1 && parseInt(key) != 0) {
        newText = "0" + key;
      } else {
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
    let numbers = "0123456789";

    if (numbers.indexOf(key) < 0 && key !== "Backspace") {
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
    } else {
      newText = oldText.substring(1, 4) + key;
    }

    this.setState({
      newYearInputEvent: false,
      displayYear: newText,
    });
  }

  public blur() {
    this.inputPressableRef.current.blur();
  }

  public focus() {
    this.monthInputRef.current?.focus();
  }

  render() {
    const inputsBgColor = this.state.theme === "light" ? "#6AD" : "#48B";

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
          onFocus={() => {
            this.setState({ isDatePickerInputFocused: true });
            this.props.onFocus;
          }}
          onBlur={() => {
            this.setState({ isDatePickerInputFocused: false });
            this.setState({ isPickerWindowOpened: false });
            this.props.onBlur;
          }}
        >
          <View
            theme={this.state.theme}
            style={[
              this.styles.datePickerInput,
              this.props.style,
              this.state.isDatePickerInputFocused
                ? this.styles.inputFocused
                : this.styles.inputUnfocused,
            ]}
          >
            <View style={this.styles.inputsWrapper}>
              <TextInput
                ref={this.monthInputRef}
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.monthInputWidth },
                  {
                    backgroundColor: this.state.isMonthInputFocused
                      ? inputsBgColor
                      : "transparent",
                  },
                  Platform.OS === "web" //@ts-ignore
                    ? { outline: "none" }
                    : null,
                ]}
                value={this.state.displayMonth}
                onKeyPress={(e) => {
                  this.onMonthKeyPress(e.nativeEvent.key);
                }}
                caretHidden={true}
                inputMode="numeric"
                enterKeyHint="next"
                readOnly={Platform.OS === "web" ? true : false}
                onFocus={() =>
                  this.setState({
                    isMonthInputFocused: true,
                    isDatePickerInputFocused: true,
                  })
                }
                onBlur={() => {
                  this.setState({
                    isMonthInputFocused: false,
                    isDatePickerInputFocused: false,
                  });
                  this.updatePickedDate(
                    parseInt(this.state.displayDay),
                    parseInt(this.state.displayMonth),
                    parseInt(this.state.displayYear)
                  );
                }}
                submitBehavior="submit"
                onSubmitEditing={() => this.dayInputRef.current?.focus()}
                maxLength={2}
              />
              <Text theme={this.state.theme} style={this.styles.slash}>
                /
              </Text>
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.dayInputWidth },
                  {
                    backgroundColor: this.state.isDayInputFocused
                      ? inputsBgColor
                      : "transparent",
                  },
                  Platform.OS === "web" //@ts-ignore
                    ? { outline: "none" }
                    : null,
                ]}
                value={this.state.displayDay}
                ref={this.dayInputRef}
                onKeyPress={(e) => {
                  this.onDayKeyPress(e.nativeEvent.key);
                }}
                caretHidden={true}
                inputMode="numeric"
                enterKeyHint="next"
                readOnly={Platform.OS === "web" ? true : false}
                onFocus={() =>
                  this.setState({
                    isDayInputFocused: true,
                    isDatePickerInputFocused: true,
                  })
                }
                onBlur={() => {
                  this.setState({
                    isDayInputFocused: false,
                    isDatePickerInputFocused: false,
                  });
                  this.updatePickedDate(
                    parseInt(this.state.displayDay),
                    parseInt(this.state.displayMonth),
                    parseInt(this.state.displayYear)
                  );
                }}
                submitBehavior="submit"
                onSubmitEditing={() => this.yearInputRef.current?.focus()}
                maxLength={2}
              />
              <Text theme={this.state.theme} style={this.styles.slash}>
                /
              </Text>
              <TextInput
                theme={this.state.theme}
                style={[
                  this.styles.textInput,
                  { width: this.state.yearInputWidth },
                  {
                    backgroundColor: this.state.isYearInputFocused
                      ? inputsBgColor
                      : "transparent",
                  },
                  Platform.OS === "web" //@ts-ignore
                    ? { outline: "none" }
                    : null,
                ]}
                value={this.state.displayYear}
                ref={this.yearInputRef}
                onKeyPress={(e) => {
                  this.onYearKeyPress(e.nativeEvent.key);
                }}
                caretHidden={true}
                inputMode="numeric"
                enterKeyHint="done"
                readOnly={Platform.OS === "web" ? true : false}
                onFocus={() =>
                  this.setState({
                    isYearInputFocused: true,
                    isDatePickerInputFocused: true,
                    newYearInputEvent: true,
                  })
                }
                onBlur={() => {
                  this.setState({
                    isYearInputFocused: false,
                    isDatePickerInputFocused: false,
                  });
                  this.updatePickedDate(
                    parseInt(this.state.displayDay),
                    parseInt(this.state.displayMonth),
                    parseInt(this.state.displayYear)
                  );
                }}
                maxLength={4}
              />
            </View>
            {this.props.icon ? (
              <Pressable
                onPressIn={() =>
                  this.setState({ isDatePickerInputFocused: true })
                }
                onPress={() => this.togglePickerWindow()}
                style={[
                  this.styles.button,
                  {
                    backgroundColor: this.state.isPickerWindowOpened
                      ? this.state.theme === "dark"
                        ? "#777"
                        : "#FBB"
                      : "transparent",
                  },
                ]}
              >
                <AntDesign
                  name="calendar"
                  size={this.styles.slash.fontSize}
                  color={this.state.theme === "light" ? "black" : "white"}
                />
              </Pressable>
            ) : null}
          </View>
        </Pressable>
        {this.state.isPickerWindowOpened ? (
          Platform.OS === "android" ? (
            <NativeDatePicker // Native component works only in development build
              modal={true}
              mode="date"
              open={this.state.isPickerWindowOpened}
              date={this.state.pickedDate}
              onConfirm={(date: Date) => {
                this.updatePickedDate(
                  date.getDay(),
                  date.getMonth() - 1,
                  date.getFullYear()
                );
                this.setState({ isPickerWindowOpened: false });
              }}
              onCancel={() => {
                this.setState({ isPickerWindowOpened: false });
              }}
              theme={this.state.theme}
            />
          ) : (
              <View
                // @ts-ignore: ref type mismatch with View component from Themed.tsx vs. DefaultView for contains
                ref={this.pickerWindowRef} style={{ zIndex: 20 }}
              >
              <PickerWindow
                pickedDate={this.state.pickedDate}
                theme={this.state.theme}
                updatePickedDate={this.updatePickedDate}
                updateDisplayDate={this.updateDisplayDate}
                togglePickerWindow={this.togglePickerWindow}
                blurDatePicker={this.blurDatePicker}
              />
            </View>
          )
        ) : null}
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
      flexDirection: this.props.iconPosition === "end" ? "row" : "row-reverse",
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
          : this.props.style.borderWidth === 0
          ? 0
          : this.props.style.borderWidth + 1,
      padding:
        this.props.style?.padding === undefined
          ? this.props.style?.borderWidth === 0
            ? 2
            : 1
          : this.props.style?.borderWidth === undefined
          ? this.props.style.padding
          : this.props.style.borderWidth === 0
          ? this.props.style.padding
          : this.props.style.padding - 1,
    },
    textInput: {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      borderRadius: 3,
      textAlign: "center",
      verticalAlign: "middle",
      fontSize: this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize,
    },
    slash: {
      margin: 0,
      marginHorizontal: 1,
      fontSize: this.props.style?.fontSize ?? DatePicker.defaultProps.fontSize,
      padding: 0,
    },
    button: {
      textAlign: "center",
      paddingVertical: 2,
      paddingHorizontal: 8,
      borderRadius: 3,
    },
  });
}
