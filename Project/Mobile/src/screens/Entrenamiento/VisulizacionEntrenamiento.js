import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";

const TrainingScreen = ({ navigation, route }) => {
  console.log(route.params?.selectedDate);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [workoutSession, setWorkoutSession] = useState([]);
  
  useFocusEffect(
    useCallback(() => {
      const dateFromParams = route.params?.selectedDate;
      if (dateFromParams) {
        setSelectedDate(new Date(dateFromParams));
      }
    }, [route.params?.selectedDate])
  );

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
      setWorkoutSession(jsonData.session || []);
    } catch (error) {
      console.error("Error fetching workout data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          Fecha del entrenamiento: {selectedDate.toISOString().split("T")[0]}
        </Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    rowGap: 20,
    padding: 25,
  },
  header: {
    alignItems: "center",
    rowGap: 20,
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