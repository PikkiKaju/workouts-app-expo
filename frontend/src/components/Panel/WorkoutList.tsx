import React, { useState } from "react";
import { Pressable, StyleSheet, FlatList } from "react-native";
import { View, Text } from "components/UI/Themed";
import AnimatedArrow from "components/UI/AnimatedArrow";
import { useTheme } from "providers/ThemeProvider";
import type { Theme } from "providers/ThemeProvider";

import WorkoutsData from "data/sample_workout_data/workout_list.json";
import Colors from "constants/Colors";

interface WorkoutItemType {
  ID: number;
  name: string;
  date: Date;
}

function WorkoutEntry(props: {
  workoutEntry: WorkoutItemType;
  state: WorkoutListProps;
  theme: Theme;
}) {
  const month = props.workoutEntry.date.getMonth();
  const day = props.workoutEntry.date.getDate();
  const year = props.workoutEntry.date.getFullYear();

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: Colors.global.tableLines,
    },
    text: {
      fontSize: 17,
      fontFamily: "Comfortaa",
    },
  });

  function handleEntryPress() {
    props.state.setSelectedWorkoutID(props.workoutEntry.ID);
  }

  return (
    <Pressable
      style={[
        styles.container,
        {
          backgroundColor:
            props.workoutEntry.ID === props.state.selectedWorkoutID
              ? props.theme === "light"
                ? "#eef"
                : "#544"
              : "transparent",
        },
      ]}
      onPress={handleEntryPress}
    >
      <Text style={styles.text} theme={props.theme}>
        {props.workoutEntry.name}
      </Text>
      <Text style={styles.text} theme={props.theme}>
        {month}/{day}/{year}
      </Text>
    </Pressable>
  );
}

function MonthSection(props: {
  monthArray: WorkoutItemType[];
  state: WorkoutListProps;
  theme: Theme;
}) {
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "column",
    },
    header: {
      marginBottom: 10,
    },
    headerText: {
      fontWeight: "bold",
      fontSize: 17,
      fontFamily: "Comfortaa",
    },
    workoutEntryList: {
      flexDirection: "column",
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText} theme={props.theme}>
          {props.monthArray[0].date.toLocaleString("locale", { month: "long" })}
        </Text>
      </View>
      <FlatList
        style={styles.workoutEntryList}
        data={props.monthArray}
        renderItem={({ item }) => (
          <WorkoutEntry
            workoutEntry={item}
            state={props.state}
            theme={props.theme}
          />
        )}
        getItemLayout={(data, index) => ({
          length: 20,
          offset: 24 * index,
          index,
        })}
      />
    </View>
  );
}

function YearSection(props: {
  yearArray: WorkoutItemType[][];
  state: WorkoutListProps;
  theme: Theme;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  function toggleYearSection() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      flexDirection: "column",
    },
    header: {
      flexDirection: "row",
      columnGap: 10,
      marginBottom: 10,
    },
    headerText: {
      fontWeight: "bold",
      fontSize: 20,
      fontFamily: "Comfortaa",
    },
    monthSectionList: {
      flexDirection: "column",
      paddingHorizontal: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AnimatedArrow
          direction={"down"}
          size={20}
          color={props.theme === "light" ? "black" : "white"}
          onPress={toggleYearSection}
          toggled={isExpanded}
        />
        <Text style={styles.headerText} theme={props.theme}>
          {props.yearArray[0][0].date.getFullYear()}
        </Text>
      </View>
      {isExpanded ? (
        <FlatList
          style={styles.monthSectionList}
          data={props.yearArray}
          renderItem={({ item }) => (
            <MonthSection
              monthArray={item}
              state={props.state}
              theme={props.theme}
            />
          )}
          getItemLayout={(data, index) => ({
            length: 20,
            offset: 24 * index,
            index,
          })}
        />
      ) : null}
    </View>
  );
}

function getWorkoutsJSONObject() {
  return WorkoutsData;
}

function getWorkoutsItems(): WorkoutItemType[][][] {
  let workoutData = getWorkoutsJSONObject();
  let workoutItems: WorkoutItemType[] = [];
  let index = 0;
  for (const [key, value] of Object.entries(workoutData)) {
    let itemDate = new Date(
      parseInt(value.WorkoutDate.slice(0, 4)),
      parseInt(value.WorkoutDate.slice(5, 7)),
      parseInt(value.WorkoutDate.slice(8, 10))
    );
    let item: WorkoutItemType = {
      ID: value.WorkoutID,
      name: value.WorkoutName,
      date: itemDate,
    };

    workoutItems.push(item);
    index++;
  }

  workoutItems.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  let workoutItemsArray: WorkoutItemType[][][] = [];
  let currentYearArray: WorkoutItemType[][] = [];
  let currentMonthArray: WorkoutItemType[] = [];
  let currentYear = workoutItems[0].date.getFullYear();
  let currentMonth = workoutItems[0].date.getMonth();

  workoutItems.forEach((element) => {
    if (currentYear == element.date.getFullYear()) {
      if (currentMonth == element.date.getMonth()) {
        currentMonthArray.push(element);
      } else {
        if (currentMonthArray.length > 0)
          currentYearArray.push(currentMonthArray);
        currentMonthArray = [];
        currentMonthArray.push(element);
      }
    } else {
      if (currentMonthArray.length > 0)
        currentYearArray.push(currentMonthArray);
      if (currentYearArray.length > 0) workoutItemsArray.push(currentYearArray);

      currentYearArray = [];
      currentMonthArray = [];
      currentMonthArray.push(element);
    }
    currentYear = element.date.getFullYear();
    currentMonth = element.date.getMonth();
  });
  if (currentMonthArray.length > 0) currentYearArray.push(currentMonthArray);
  if (currentYearArray.length > 0) workoutItemsArray.push(currentYearArray);

  return workoutItemsArray;
}

interface WorkoutListProps {
  selectedWorkoutID: number;
  setSelectedWorkoutID: (arg0: number) => void;
}

export default function WorkoutList(state: WorkoutListProps) {
  const { theme, toggleTheme } = useTheme();
  const yearSectionData: WorkoutItemType[][][] = getWorkoutsItems();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      zIndex: 5,
    },
    header: {
      flexDirection: "row",
    },
    workoutList: {
      padding: 10,
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.workoutList}
        data={yearSectionData}
        renderItem={({ item }) => (
          <YearSection yearArray={item} state={state} theme={theme} />
        )}
        getItemLayout={(data, index) => ({
          length: 20,
          offset: 24 * index,
          index,
        })}
      />
    </View>
  );
}
