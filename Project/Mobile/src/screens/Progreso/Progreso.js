import React, {useState, useEffect,useCallback} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, ViewBase } from 'react-native';
import ProgressBodyMeasures from './ProgressBodyMeasures';
import ProgressExercise from './ProgressExercise';
import Achievements from './Achievements';
import BenchMarking from './BenchMarking';
import { useFocusEffect } from '@react-navigation/native';


const Progreso = ({ route, navigation }) => {

  const [selectedScreen, setSelectedScreen] = useState("ProgressBodyMeasures");

  const handleScreenChange = (screen) => {
    console.log("Changing screen to:", screen);
    setSelectedScreen(screen);
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Params on Progreso (focus):", route.params);
      if (route.params?.screen) {
        console.log("Setting selected screen to:", route.params.screen);
        setSelectedScreen(route.params.screen);
      } else {
        console.log("No screen param provided, defaulting to ProgressBodyMeasures");
        setSelectedScreen("ProgressExercise");
      }
    }, [route.params])
  );
  
  
  useEffect(() => {
    console.log("Selected Screen:", selectedScreen);
  }, [selectedScreen]);

  useEffect(() => {
    console.log("Hola primero");
    console.log("Params on Progreso:", route.params);
  },[]);


  const renderSelectedScreen = () => {
    switch (selectedScreen) {
      case "ProgressBodyMeasures":
        return <ProgressBodyMeasures navigation={navigation} />;
      case "ProgressExercise":
        return <ProgressExercise navigation={navigation} />;
      case "Achievements":
        return <Achievements navigation={navigation} />;
      case "BenchMarking":
        return <BenchMarking navigation={navigation} />;
      default:
        return null;  
    }
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
          <TouchableOpacity
          onPress={() => handleScreenChange("BenchMarking")}
            style={[
              styles.screenButton,
              selectedScreen === "BenchMarking" ? styles.selectedButton : null,
            ]}
          >
            <Text>Comparación de rendimiento</Text>
          </TouchableOpacity>
          </ScrollView>
          </View>
    <View style={styles.contentContainer}>
    {renderSelectedScreen()}
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

