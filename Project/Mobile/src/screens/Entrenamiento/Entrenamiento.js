//Faltan que se deshabilite el boton si no es del dia el entrenamiento, pero por pruebas me da hueva ahorita
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";

const TrainingScreen = ({ navigation, route }) => {
  
  const [selectedDate, setSelectedDate] = useState(route.params?.selectedDate ? new Date(route.params.selectedDate) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [workoutSession, setWorkoutSession] = useState([]);
  const [nextTrainingDate, setNextTrainingDate] = useState(null);
  const [allSession, setAllSession] = useState([]);

  // Carga el OID del usuario al iniciar el componente
  useEffect(() => {
    const fetchOIDAndWorkoutData = async () => {
      const oid = await AsyncStorage.getItem("userOID");
      if (!oid) {
        console.error("OID not found");
        return;
      }
      fetchWorkoutData(selectedDate, oid);
    };

    fetchOIDAndWorkoutData();
  }, [selectedDate]);

  const fetchWorkoutData = async (date, oid) => {
    const formattedDate = date.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/entrenamiento/${oid}/${formattedDate}`
      );
      const jsonData = await response.json();
      setAllSession(jsonData);
      setWorkoutSession(jsonData.session); // Actualiza el estado con los detalles de la sesión
      setNextTrainingDate(jsonData.nextTrainingDate); // Actualiza el estado con la fecha del próximo entrenamient
    } catch (error) {
      console.error("Error fetching workout data:", error);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    setSelectedDate(selectedDate || new Date()); // Si el usuario cancela la selección, mantiene la fecha actu
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.datePicker}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            Seleccionar Fecha: {selectedDate.toISOString().split("T")[0]}
          </Text>
          <Text style={styles.dateText}>
            Fecha del entrenamiento: {nextTrainingDate?.split("T")[0]}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
      </View>
      <View style={styles.trainingInfo}>
        <View style={styles.trainingDetail}>
          <View style={styles.trainingDetailrow}>
            <AntDesign name="clockcircleo" size={24} color="black" />
            <Text style={styles.detailText}>145 mins</Text>
          </View>
          <View style={styles.trainingDetailrow}>
            <Ionicons name="body-outline" size={24} color="black" />
            <Text style={styles.detailText}>Femoral - Pantorrilla</Text>
          </View>
        </View>
        <ScrollView style={styles.exercisesList}>
          {/*PONGO DOS EJEMPLOS PARA MOSTRAR EJERCICIOS DE DISTINTOS TIPOS, SOLAMENTE QUEDA HACER EL MAP YA EN EL BACKE*/}
          <View style={styles.exerciseRowHeader}>
            <View style={styles.exerciseTitle}>
              <Text style={styles.exerciseHeaderText}>Ejercicio</Text>
            </View>
            <View style={styles.exerciseDescription}>
              <Text style={styles.exerciseHeaderText}>Detalles</Text>
            </View>
          </View>
          {workoutSession?.map((item, index) => (
            <View key={item.id} style={styles.exerciseRow}>
              <View style={styles.exerciseTextContainer}>
                <Text style={styles.exerciseTextName}>
                  {item.exerciseToWork.name}
                </Text>
              </View>
              {item.exerciseToWork.modalidad === "Cardiovascular" ? (
                <View style={styles.exerciseTextContainerCardiovascular}>
                  <Text style={styles.exerciseTextHeader}>Tiempo</Text>
                  <Text style={styles.exerciseText}>{item.time} segundos</Text>
                </View>
              ) : (
                <React.Fragment>
                  <View style={styles.exerciseTextContainer}>
                    <Text style={styles.exerciseTextHeader}>Reps</Text>
                    <Text style={styles.exerciseText}>{item.reps || 0}</Text>
                  </View>
                  <View style={styles.exerciseTextContainer}>
                    <Text style={styles.exerciseTextHeader}>Peso</Text>
                    <Text style={styles.exerciseText}>
                      {item.weight || 0} kg
                    </Text>
                  </View>
                  <View style={styles.exerciseTextContainer}>
                    <Text style={styles.exerciseTextHeader}>Descanso</Text>
                    <Text style={styles.exerciseText}>{item.rest || 0} s</Text>
                  </View>
                </React.Fragment>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate("TrainingStack", {
            screen: "WorkoutScreen",
            params: { workoutSession: allSession },
          });
        }}
      >
        <Text style={styles.buttonText}>¡Comenzar Entrenamiento!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 20,
    padding: 25,
  },
  header: {
    alignItems: "center",
    rowGap: 20,
  },
  headerText: {
    fontSize: 24,
  },
  dateText: {
    fontSize: 18,
    color: "grey",
    textAlign: "center",
  },
  trainingInfo: {
    flex: 1,
    marginTop: 5,
  },
  trainingDetail: {
    flexDirection: "column",
    justifyContent: "center",
    rowGap: 20,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "grey",
  },
  exercisesList: {
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },
  exerciseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
  },
  exerciseText: {
    fontSize: 14,
    color: "black",
  },
  button: {
    backgroundColor: "#0790cf",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  trainingDetailrow: {
    flexDirection: "row",
    columnGap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  exerciseRowHeader: {
    backgroundColor: "#CCCCCC",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseTitle: {
    width: "25%",
    alignItems: "center",
  },
  exerciseDescription: {
    width: "75%",
    alignItems: "center",
  },
  exerciseHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  exerciseTextName: {
    fontWeight: "600",
    padding: 10,
  },
  exerciseTextContainer: {
    width: "25%",
    alignItems: "center",
    rowGap: 5,
    justifyContent: "center",
  },
  exerciseTextHeader: {
    fontSize: 12,
    color: "grey",
    fontWeight: "400",
  },
  exerciseTextContainerCardiovascular: {
    width: "75%",
    alignItems: "center",
    rowGap: 5,
    justifyContent: "center",
  },
});

export default TrainingScreen;
