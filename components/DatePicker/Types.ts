export interface CalendarTileProps {
    day: number;
    month: string; // Short month name e.g., "Jan"
    year: number;
  }
  
export interface PickerWindowState {
    pickedDate: Date;
    pickedDay: number;
    pickedMonth: string; // Full month name
    pickedYear: number;
    selectedDate: Date;
    selectedMonth: string; // Full month name
    selectedYear: number;
  
    selectedCalendar: "DayCalendar" | "YearCalendar";
    dayCalendarContent: CalendarTileProps[];
    monthCalendarContent: string[]; // Array of short month names e.g., "Jan", "Feb"
    yearCalendarContent: number[];
    theme: "dark" | "light";
}
  