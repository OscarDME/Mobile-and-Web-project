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

const RoutineDetailsScreen = ({ navigation, route }) => {
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

  const deleteRoutine = async () => {
    // Confirmar con el usuario antes de borrar la rutina
    Alert.alert("Eliminar Rutina", "¿Estás seguro de que quieres eliminar esta rutina?", [
      {
        text: "Cancelar",
        style: "cancel"
      },
      { text: "Eliminar", onPress: async () => {
          try {
            // Realiza la solicitud de eliminación a tu API
            const response = await fetch(`${config.apiBaseUrl}/rutina/${routineId}`, {
              method: "DELETE", // Asume que tu API requiere un método DELETE para eliminar rutinas
            });
            if (response.ok) {
              // Si la rutina se elimina correctamente, navegar hacia atrás o actualizar la lista de rutinas
              navigation.goBack(); // Por ejemplo, volver a la pantalla anterior
            } else {
              console.error("No se pudo eliminar la rutina.");
            }
          } catch (error) {
            console.error("Error al eliminar la rutina:", error);
          }
        }
      }
    ]);
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
        <TouchableOpacity onPress={deleteRoutine} style={{ marginLeft: 'auto' }}> 
        <Ionicons name="trash-outline" size={30} color="red" />
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
            <Text style={styles.buttonText}>Añadir a mis rutinas</Text>
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
              navigation.navigate("EditarRutina", {
                isEditing: true,
                routineDetails: routineDetails,
                onReturn: fetchRoutineDetails,
              })
            }
          >
            <Text style={styles.buttonText}>Modificar Rutina</Text>
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

export default RoutineDetailsScreen;
