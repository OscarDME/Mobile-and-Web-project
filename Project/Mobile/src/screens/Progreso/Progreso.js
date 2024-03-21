import React, {useState, useEffect} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import ProgressBodyMeasures from './ProgressBodyMeasures';
import ProgressExercise from './ProgressExercise';

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
    <View
    style={styles.screenContainer}
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
    </View>
    <View style={styles.contentContainer}>
        {selectedScreen === "ProgressBodyMeasures" ? (
          <ProgressBodyMeasures navigation={navigation}/>
        ) : (
          <ProgressExercise navigation={navigation}/>
        )}
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
    width: 170,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },screenContainer:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  title: {
    fontSize: 24,
  }
});

export default Progreso;

