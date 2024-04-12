import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import config from "../../utils/conf";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RoutineDetailsViewScreen = ({ navigation, route }) => {
  const { routineId } = route.params;
  const [routineDetails, setRoutineDetails] = useState(null);

  const fetchRoutineDetails = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/rutina/${routineId}`);
      if (response.ok) {
        const data = await response.json();
        setRoutineDetails(data);
      } else {
        console.log("No se pudo obtener la rutina.");
      }
    } catch (error) {
      console.error(
        "Hubo un error al obtener los detalles de la rutina:",
        error
      );
    }
  };

  const addRoutineToMyRoutines = async () => {
    try {
      const oid = await AsyncStorage.getItem("userOID");
      console.log("Hago la consulta");
      const response = await fetch(`${config.apiBaseUrl}/clonarrutina`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_Rutina: routineId,
          ID_Usuario: oid,
        }),
      });

      if (response.ok) {
        Alert.alert("Éxito", "Rutina agregada a tus rutinas con éxito.");
        navigation.goBack();
      } else {
        // Manejo de errores según el caso
        Alert.alert("Error", "No se pudo agregar la rutina a tus rutinas.");
      }
    } catch (error) {
      console.error("Error al agregar la rutina a tus rutinas:", error);
      Alert.alert(
        "Error",
        "Hubo un problema al agregar la rutina a tus rutinas."
      );
    }
  };

  // Llamar a fetchRoutineDetails cuando el componente se monta o cuando routineId cambia
  useEffect(() => {
    fetchRoutineDetails();
  }, [routineId]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
      </View>

      {routineDetails ? (
        <>
          <Text style={styles.title}>{routineDetails.nombre}</Text>
          <Text style={styles.level}>
            {"Dificultad: "}
            {routineDetails.ID_Dificultad
              ? routineDetails.ID_Dificultad === 1
                ? "Baja"
                : routineDetails.ID_Dificultad === 2
                ? "Media"
                : "Alta"
              : "Todavía no hay suficientes datos para calcular esto"}
          </Text>

          <Text style={styles.duration}>
            {"Duración: "}
            {routineDetails.duracion
              ? `${Math.floor(routineDetails.duracion / 3600)}h ${Math.floor(
                  (routineDetails.duracion % 3600) / 60
                )}m`
              : "Todavía no hay suficientes datos para calcular esto"}
          </Text>

          <Text style={styles.frequency}>
            {"Frecuencia: "}
            {routineDetails.diasEntreno && routineDetails.diasEntreno.length > 0
              ? `${routineDetails.diasEntreno.length} días por semana`
              : "No hay datos suficientes"}
          </Text>
          <TouchableOpacity style={styles.button}>
            <Text
              style={styles.buttonText}
              onPress={addRoutineToMyRoutines}
            >
              Agregar a mis rutinas
            </Text>
          </TouchableOpacity>

          <View style={styles.trainingSection}>
            <Text style={styles.sectionTitle}>Entrenamientos</Text>
            {routineDetails.diasEntreno &&
            routineDetails.diasEntreno.length > 0 ? (
              routineDetails.diasEntreno.map((diaEntreno, index) => (
                <View key={index} style={styles.trainingItem}>
                  <Text style={styles.trainingDay}>{`${diaEntreno.dia}`}</Text>
                  <Text style={styles.trainingMuscles}>
                    {diaEntreno.musculosPrincipales &&
                    diaEntreno.musculosPrincipales.length > 0
                      ? diaEntreno.musculosPrincipales.join(", ")
                      : "Todavía no hay suficientes datos"}
                  </Text>
                </View>
              ))
            ) : (
              <Text>
                Todavía no hay suficientes datos para los días de entrenamiento.
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("EditarRutinaView", {
                isEditing: true,
                routineDetails: routineDetails,
                onReturn: fetchRoutineDetails,
              })
            }
          >
            <Text style={styles.buttonText}>Visualizar Rutina</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Cargando detalles de la rutina...</Text> // Puedes mostrar un indicador de carga o mensaje mientras los datos no estén disponibles
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  level: {
    fontSize: 18,
    color: "gray",
    marginBottom: 5,
  },
  duration: {
    fontSize: 16,
    marginBottom: 5,
  },
  frequency: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  trainingSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  trainingItem: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  trainingDay: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  trainingActivities: {
    fontSize: 16,
  },
  // ... Agrega cualquier otro estilo que necesites aquí
});

export default RoutineDetailsViewScreen;
