import React, { Component } from "react"; 
import { StyleSheet, Pressable, Keyboard, Platform } from "react-native";
import { View, Text } from "@/components/UI/Themed";
import ContentHeader from "./ContentHeader/ContentHeader";
import WorkoutTable from "./WorkoutTable/WorkoutTable";
import Footer from "./WorkoutTable/Footer";
import { Set, Exercise, Workout } from "./WorkoutTable/types";

interface workoutProps extends Workout {
}

interface ContentState {
  exercises: Exercise[];
}

export default class Content extends Component<workoutProps, ContentState>{
  constructor(props: workoutProps) {
    super(props);
    this.state = {
      exercises: props.exercises,
    };
  }

  render() {
    return (
        <Pressable
          style={[
            this.styles.pressableContainer, //@ts-ignore
            Platform.OS === "web"
            ? { cursor: "default" } : null
          ]}
          onPress={() => {
            // Dismiss keyboard on non-web platforms when clicked outside of inputs
            if (Platform.OS !== 'web') Keyboard.dismiss();
          }}
        >
          <View style={this.styles.innerContainer}>
            <ContentHeader name={this.props.name} />
            <WorkoutTable>
              <WorkoutTable.Header />
              {this.state.exercises.map((exercise: Exercise, exerciseIndex: number) =>  (
                <WorkoutTable.Row 
                  key={exerciseIndex} 
                  exerciseIndex={exerciseIndex}
                  name={exercise.name} 
                  description={exercise.description} 
                  sets={exercise.sets}
                />
              ))}
            </WorkoutTable>
          </View>
        </Pressable>
    );
  }

  styles = StyleSheet.create({
    pressableContainer: {
      flex: 1,
    },
    innerContainer: {
      flex: 1,
      marginHorizontal: 10,
    },
  });
}
