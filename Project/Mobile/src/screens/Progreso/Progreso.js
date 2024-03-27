import React, {useState, useEffect} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, ViewBase } from 'react-native';
import ProgressBodyMeasures from './ProgressBodyMeasures';
import ProgressExercise from './ProgressExercise';
import Achievements from './Achievements';

const Progreso = ({ navigation }) => {

  const [selectedScreen, setSelectedScreen] = useState("ProgressBodyMeasures");


  const handleScreenChange = (screen) => {
    setSelectedScreen(screen);
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Progreso</Text>
      </View>
      <View>
      <ScrollView
          horizontal
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
          onPress={() => handleScreenChange("ProgressBodyMeasures")}
            style={[
              styles.screenButton,
              selectedScreen === "ProgressBodyMeasures" ? styles.selectedButton : null,
            ]}
          >
            <Text>Medidas corporales</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => handleScreenChange("ProgressExercise")}
            style={[
              styles.screenButton,
              selectedScreen === "ProgressExercise" ? styles.selectedButton : null,
            ]}
          >
            <Text>Ejercicios</Text>
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => handleScreenChange("Achievements")}
            style={[
              styles.screenButton,
              selectedScreen === "Achievements" ? styles.selectedButton : null,
            ]}
          >
            <Text>Logros</Text>
          </TouchableOpacity>
          </ScrollView>
          </View>
    <View style={styles.contentContainer}>
        {selectedScreen === "ProgressBodyMeasures" ? (
          <ProgressBodyMeasures navigation={navigation}/>
        ) : (
          selectedScreen === "Achievements" ? (
          <Achievements navigation={navigation}/>
        ) : (
          <ProgressExercise navigation={navigation}/>
        ))}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  selectedButton: {
    backgroundColor: "#a0a0a0",
  },
  screenButton: {
    alignContents: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
  },screenContainer:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  title: {
    fontSize: 24,
  },
  scrollContainer: {
    flexDirection: "row",
    width: "100%",
  }
});

export default Progreso;

