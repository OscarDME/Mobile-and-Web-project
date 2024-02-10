import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import * as Progress from "react-native-progress";
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de tener instalado '@expo/vector-icons'
import TimePicker from "../../components/TimePicker"; // Importa el componente TimePicker

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const muscles = [
  { id: 1, descripcion: "Pecho" },
  { id: 2, descripcion: "Espalda" },
  { id: 3, descripcion: "Hombro" },
  { id: 4, descripcion: "Bicep" },
  { id: 5, descripcion: "Tricep" },
  { id: 6, descripcion: "Cuadricep" },
  { id: 7, descripcion: "Femoral" },
  { id: 8, descripcion: "Gluteo" },
  { id: 9, descripcion: "Pantorrilla" },
];

const TrainingMusclesSelection = ({ navigation, route }) => {
  const { oid, trainingTime, preferredDays } = route.params;
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMuscles, setSelectedMuscles] = useState({});

  const handleMuscleToggle = (day, muscleId) => {
    setSelectedMuscles((prevSelectedMuscles) => {
      const updatedMuscles = { ...prevSelectedMuscles };

      if (updatedMuscles[day]) {
        const index = updatedMuscles[day].indexOf(muscleId);
        if (index !== -1) {
          updatedMuscles[day].splice(index, 1);
        } else {
          updatedMuscles[day].push(muscleId);
        }
      } else {
        updatedMuscles[day] = [muscleId];
      }

      return updatedMuscles;
    });
  };

  const renderDayContainer = (day) => (
    <View key={day} style={styles.dayContainer}>
      <Text style={styles.dayText}>{dayNames[day - 1]}</Text>
      <View style={styles.muscleContainer}>
        {muscles.map((muscle) => (
          <TouchableOpacity
            key={muscle.id}
            style={[
              styles.muscleButton,
              selectedMuscles[day]?.includes(muscle.id) ? styles.selectedMuscle : null,
            ]}
            onPress={() => handleMuscleToggle(day, muscle.id)}
          >
            <Text>{muscle.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const handleSubmit = () => {
    const hasInvalidSelection = preferredDays.some(day => {
      return !selectedMuscles[day] || selectedMuscles[day].length === 0;
    });
  
    if (hasInvalidSelection) {
      setErrorMessage("Por favor, selecciona al menos un músculo para cada día elegido.");
      return; // Detener la función si hay una selección inválida
    }
  
    // Restablecer el mensaje de error si todo está correcto
    setErrorMessage("");
  
    console.log("Selección de Músculos:", selectedMuscles);

    // Navegar a la siguiente pantalla con todos los parámetros
    navigation.navigate("TrainingGoalsScreen", {
      oid: oid,
      trainingTime: trainingTime,
      preferredDays: preferredDays,
      selectedMuscles: selectedMuscles,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar progress={0.4} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>2 de 5</Text>
      <Text style={styles.indicacion}>Indica los musculos que quieres entrenar cada día de la semana </Text>
      {errorMessage ? (
  <Text style={styles.errorText}>{errorMessage}</Text>
) : null}

      {/* Renderiza los contenedores de día con la selección de músculos */}
      {preferredDays.map((day) => renderDayContainer(day))}

      {/* Botón para continuar */}
      <TouchableOpacity style={styles.arrowContainer} onPress={handleSubmit}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  dayContainer: {
    marginBottom: 50,
  },
  dayText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  muscleContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  muscleButton: {
    width: "30%",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    alignItems: "center",
  },
  selectedMuscle: {
    backgroundColor: "lightblue",
  },
  arrowContainer: {
    position: "absolute",
    top: 65,
    right: 1,
  },
  indicacion: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 18,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default TrainingMusclesSelection;
