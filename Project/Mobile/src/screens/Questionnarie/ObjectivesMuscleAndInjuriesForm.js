import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {Picker} from "@react-native-picker/picker";
import ModalDropdown from 'react-native-modal-dropdown';
import { CheckBox } from "react-native-elements";
import * as Progress from "react-native-progress";
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de tener instalado '@expo/vector-icons'

const TrainingGoalsScreen = ({ navigation, route }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [trainingGoal, setTrainingGoal] = useState("");
  const [injuryAreas, setInjuryAreas] = useState([]);
  const [focusedBodyPart, setFocusedBodyPart] = useState("");

  const handleTrainingGoalSelection = (goal) => {
    setTrainingGoal(goal);
  };

  const handleInjuryAreaSelection = (area) => {
    if (injuryAreas.includes(area)) {
      setInjuryAreas(
        injuryAreas.filter((selectedArea) => selectedArea !== area)
      );
    } else {
      setInjuryAreas([...injuryAreas, area]);
    }
  };

  const muscleData = [
    { label: 'Ninguno', value: null }, // Opción por defecto
    { label: 'Pecho', value: 1 },
    { label: 'Espalda', value: 2 },
    { label: 'Hombro', value: 3 },
    { label: 'Bícep', value: 4 },
    { label: 'Trícep', value: 5 },
    { label: 'Cuádricep', value: 6 },
    { label: 'Femoral', value: 7 },
    { label: 'Glúteo', value: 8 },
    { label: 'Pantorilla', value: 9 },
  ];

  const handleFocusedBodyPartSelection = (part) => {
    setFocusedBodyPart(part);
  };

  const handleSubmit = () => {
    if (!trainingGoal) {
      setErrorMessage("Por favor, selecciona un objetivo de entrenamiento.");
      return;
    } else if (injuryAreas.length === 0) {
      setErrorMessage("Por favor, indica si tienes alguna lesión o molestia.");
      return;
    } else {
      setErrorMessage("");} // Limpiar el mensaje de error si pasa las validaciones
    // Puedes enviar esta información a la siguiente pantalla o a tu backend
    console.log("Datos pasados:");
    console.log("oid", route.params.oid);
    console.log("Tiempo de entrenamiento:", route.params.trainingTime);
    console.log("Días preferidos:", route.params.preferredDays);
    console.log("Musculos seleccionados", route.params?.selectedMuscles);
    console.log("Objetivo de entrenamiento:", trainingGoal);
    console.log("Área de lesión o molestia:", injuryAreas);
    console.log("Parte del cuerpo enfocada:", focusedBodyPart);

    navigation.navigate("PhysicAndSpace", {
      oid: route.params.oid, // Incluir el oid obtenido de la ruta anterior
      trainingTime: route.params.trainingTime,
      trainingDays: route.params.trainingDays,
      preferredDays: route.params.preferredDays,
      selectedMuscles: route.params?.selectedMuscles,
      trainingGoal: trainingGoal,
      injuryAreas: injuryAreas,
      focusedBodyPart: focusedBodyPart,
    }); // Aquí podrías enviar los datos a tu backend o realizar otras operaciones
    // Ejemplo de cómo navegar a la siguiente pantalla
    //navigation.navigate('NextScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar progress={0.6} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>3 de 5</Text>
      <Text style = {styles.textIndicacion}>
¿Cuáles son los objetivos de su entrenamiento?</Text>
<View style={styles.buttonContainer}>
  <TouchableOpacity
    style={{
      marginVertical: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: trainingGoal === 1 ? "#0790cf" : "#eaeaea", // Color de fondo azul si está seleccionado, de lo contrario gris
    }}
    onPress={() => handleTrainingGoalSelection(1)}
  >
    <Text style={{fontSize: 16, color: trainingGoal === 1 ? "white" : "black" }}>Perder peso</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      marginVertical: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: trainingGoal === 2 ? "#0790cf" : "#eaeaea", // Color de fondo azul si está seleccionado, de lo contrario gris
    }}
    onPress={() => handleTrainingGoalSelection(2)}
  >
    <Text style={{fontSize: 16, color: trainingGoal === 2 ? "white" : "black" }}>Ganar masa muscular</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={{
      marginVertical: 10,
      padding: 10,
      borderRadius: 10,
      backgroundColor: trainingGoal === 3 ? "#0790cf" : "#eaeaea", // Color de fondo azul si está seleccionado, de lo contrario gris
    }}
    onPress={() => handleTrainingGoalSelection(3)}
  >
    <Text style={{fontSize: 16, color: trainingGoal === 3 ? "white" : "black" }}>Mantenimiento</Text>
  </TouchableOpacity>
</View>

      <Text style = {styles.textIndicacion}>
¿Tiene alguna lesión o molestia en estas zonas?</Text>
      <View style={styles.injuryButtonContainer}>
        <View style={styles.injuryColumn}>
          <CheckBox
            title="Hombro"
            checked={injuryAreas.includes(1)}
            uncheckedColor="black"  
            onPress={() => handleInjuryAreaSelection(1)}
            containerStyle={styles.checkboxContainer}
            checkedColor="black"
            titleProps={{ style: styles.checkboxText }}
          />
          <CheckBox
            title="Lumbar"
            checked={injuryAreas.includes(2)}
            onPress={() => handleInjuryAreaSelection(2)}
            containerStyle={styles.checkboxContainer}
            checkedColor="black"
            uncheckedColor="black"  
            titleProps={{ style: styles.checkboxText }}
          />
        </View>
        <View style={styles.injuryColumn}>
          <CheckBox
            title="Rodilla"
            checked={injuryAreas.includes(3)}
            onPress={() => handleInjuryAreaSelection(3)}
            containerStyle={styles.checkboxContainer}
            checkedColor="black"
            uncheckedColor="black"  
            titleProps={{ style: styles.checkboxText }}
          />
          <CheckBox
            title="Tobillo"
            checked={injuryAreas.includes(4)}
            onPress={() => handleInjuryAreaSelection(4)}
            containerStyle={styles.checkboxContainer}
            checkedColor="black"
            uncheckedColor="black"  
            titleProps={{ style: styles.checkboxText }}
          />
        </View>
      </View>


      <Text style = {styles.textIndicacion}>
        ¿Quiere hacer énfasis en el ejercicio de alguna parte del cuerpo en
        especial?
      </Text>
      <ModalDropdown
        options={muscleData.map((muscle) => muscle.label)}
        onSelect={(index, value) =>
        handleFocusedBodyPartSelection(muscleData[index].value)
        }
        defaultValue="Seleccionar parte del cuerpo"
        style={styles.dropdown}
        textStyle={styles.dropdownText}
        dropdownStyle={styles.dropdownMenu}  // Agrega esta línea para personalizar el estilo del menú
      />
      {errorMessage !== "" && (
  <Text style={styles.errorText}>{errorMessage}</Text>
)}
      <TouchableOpacity style={styles.arrowContainer} onPress={handleSubmit}>
        <AntDesign name="arrowright" size={34} color="black"  />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  dropdown: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    marginHorizontal: 50,
  },
  dropdownMenu: {
    width: 250,  // Ajusta el ancho del menú según tus preferencias
    height: 300, // Ajusta el alto del menú según tus preferencias
    borderWidth: 1,
    borderColor: 'black',
  },
  dropdownText: {
    fontSize: 16,
    color: "black",
  },
  progress: {
    width: "100%",
    zIndex: -1,
    paddingTop: 25,
  },
  pageText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  textIndicacion: {
    fontSize: 20,
    justifyContent: "center",
    textAlign: "center",
    marginBottom: 30,
    marginTop:20,
    },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
    marginHorizontal: 50,

  },
  button: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 5,
    marginHorizontal: 50,
    minWidth: "30%",
    alignItems: "center",
  },
  injuryColumn: {
    flexDirection: 'row', // Cambiado a 'row' para que estén en la misma fila
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "black",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  selectedButton: {
    backgroundColor: "lightblue",
  },
  saveButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    width: "100%",
  },
  checkboxContainer: {
    backgroundColor: "#7dc0f3",
    borderWidth: 0,
    marginHorizontal: 30, 
    width: 160,
    justifyContent: 'center',
    height: 46,
    padding: 10,
    alignItems: "center",
  },
  checkboxText: {
    color: "black",  // Color del texto
    fontSize: 16,
    fontWeight: "bold",
    },
  saveText: {
    color: "white",
    fontWeight: "bold",
  },
  injuryButtonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    marginBottom: 20,
  },
  injuryButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    marginVertical: 5,
    minWidth: "48%", // Ajustar según sea necesario
    alignItems: "center",
  },
  injurySelectedButton: {
    backgroundColor: "lightblue",
  },
  arrowContainer: {
    position: "absolute",
    top: 85,
    right: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  }
});

export default TrainingGoalsScreen;
