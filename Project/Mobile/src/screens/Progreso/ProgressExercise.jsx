import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  VirtualizedList,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { AntDesign } from "@expo/vector-icons";
import { SelectList } from "react-native-dropdown-select-list";
import { BodyMeasures } from "./DATA_MEASURES";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import config from "../../utils/conf";
import AsyncStorage from "@react-native-async-storage/async-storage";
const screenWidth = Dimensions.get("window").width;

const rmFactors = {
  1: 1,
  2: 0.95,
  3: 0.9,
  4: 0.86,
  5: 0.82,
  6: 0.78,
  7: 0.74,
  8: 0.7,
  9: 0.65,
  10: 0.61,
  11: 0.57,
  12: 0.53,
};
const rms = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45];
const rmsFuture = [100, 95, 90];

const ProgressExercise = ({ navigation }) => {
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [oneRM, setOneRM] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [rms, setRms] = useState([]); // Nuevo estado para los RM calculados

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
        const data = await response.json();
        // Transformar datos si es necesario para que coincidan con lo esperado por SelectList
        const ejerciciosTransformados = data.map((ejercicio) => ({
          key: ejercicio.ID_Ejercicio.toString(),
          value: ejercicio.ejercicio,
        }));
        setEjercicios(ejerciciosTransformados);
      } catch (error) {
        console.error("Error al obtener los ejercicios:", error);
      }
    };

    fetchEjercicios();
  }, []);

  const data = {
    labels: ["15/01/24", "18/01/24"],
    datasets: [
      {
        data: [10, 11],
      },
    ],
  };

  const measures = [
    { key: "cuello", value: "Cuello" },
    { key: "pecho", value: "Pecho" },
    { key: "hombros", value: "Hombros" },
    { key: "bíceps", value: "Bíceps" },
    { key: "antebrazo", value: "Antebrazo" },
    { key: "cintura", value: "Cintura" },
    { key: "cadera", value: "Cadera" },
    { key: "pantorrillas", value: "Pantorrillas" },
    { key: "muslos", value: "Muslos" },
  ];

  useEffect(() => {
    const fetchOneRM = async () => {
      // Suponiendo que puedes obtener el ID del usuario móvil de alguna manera, por ejemplo, desde AsyncStorage
      const oid = await AsyncStorage.getItem("userOID");
      console.log(oid);
      console.log(selectedExercise.key);
      if (selectedExercise.key) {
        try {
          const response = await fetch(
            `${config.apiBaseUrl}/RM/${oid}/${selectedExercise.key}`
          );
          const data = await response.json();
          // Verifica que la respuesta no esté vacía y luego extrae el valor de Max1RM
          if (data.length > 0) {
            setOneRM(data[0].Max1RM);
            console.log(data[0].Max1RM);
          } else {
            // Manejar el caso en que no hay datos para el 1RM
            setOneRM(null);
            console.log(
              "No se encontró el 1RM para el ejercicio seleccionado."
            );
          }
        } catch (error) {
          console.error("Error al obtener el 1RM:", error);
        }
      }
    };

    fetchOneRM();
  }, [selectedExercise]); // Este efecto se ejecutará cada vez que el ejercicio seleccionado cambie

  useEffect(() => {
    // Calcular y establecer los RM basados en oneRM
    if (oneRM) {
      const calculatedRms = Object.keys(rmFactors).map((key) =>
        parseFloat((oneRM * rmFactors[key]).toFixed(2))
      );
      setRms(calculatedRms);
    }
  }, [oneRM]);

  return (
    <View style={styles.container}>
      <View style={styles.select}>
        <SelectList
          setSelected={(selectedKey) => {
            // Encuentra el ejercicio seleccionado basado en el key seleccionado
            const ejercicioSeleccionado = ejercicios.find(
              (ejercicio) => ejercicio.key === selectedKey
            );
            setSelectedExercise(ejercicioSeleccionado);
          }}
          data={ejercicios}
          placeholder="Selecciona un ejercicio"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
          width={300}
        />
        <SelectList
          setSelected={setSelectedTime}
          data={measures}
          placeholder="Tiempo"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.sectionTitle}>
            Progreso de cargas de <Text style={styles.exercise}>{selectedExercise?.value}</Text>
        </Text>

        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#EEEEEE",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#EEEEEE",
            backgroundGradientToOpacity: 0.5,
            labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
            color: (opacity = 1) => `rgba(7, 144, 207, ${opacity})`,
            strokeWidth: 3,
            fillShadowGradientFrom: "rgba(7, 144, 207, 1)",
            fillShadowGradientTo: "rgba(255, 255, 255, 0)",
          }}
          bezier
          style={styles.chart}
          withHorizontalLines={true}
          withVerticalLabels={true}
        />
        <Text style={styles.sectionTitle}>
          Tus repeticiones maximas actuales de <Text style={styles.exercise}>{selectedExercise?.value}</Text></Text>
        <View style={styles.rmTable}>
          {rms.map((rm, index) => (
            <View
              style={index == 11 ? styles.rmRowLast : styles.rmRow}
              key={index}
            >
              <Text style={styles.rmLabel}>{index + 1}RM</Text>
              <Text style={styles.rmLabelRm}>{rm} kg</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>
          A este paso, calculamos que tu{" "}
          <Text style={styles.exercise}>1RM</Text> de{" "}
          <Text style={styles.exercise}>{selectedExercise?.value}</Text> en 3 meses será...
        </Text>
        <View style={styles.rmTable}>
          {rmsFuture.map((rm, index) => (
            <View
              style={index == 2 ? styles.rmRowLast : styles.rmRow}
              key={index}
            >
              <Text style={styles.rmLabel}>
                + {index + 1} {index > 0 ? "meses" : "mes"}
              </Text>
              <Text style={styles.rmLabelRm}>{rm} kg</Text>
            </View>
          ))}
        </View>
        <LineChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundGradientFrom: "#EEEEEE",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#EEEEEE",
            backgroundGradientToOpacity: 0.5,
            labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
            color: (opacity = 1) => `rgba(7, 144, 207, ${opacity})`,
            strokeWidth: 3,
            fillShadowGradientFrom: "rgba(7, 144, 207, 1)",
            fillShadowGradientTo: "rgba(255, 255, 255, 0)",
          }}
          bezier
          style={styles.chart}
          withHorizontalLines={true}
          withVerticalLabels={true}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  select: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  scrollView: {
    height: "80%",
  },
  sectionTitle: {
    fontSize: 24,
    color: "#333",
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  rmTable: {
    width: "80%",
    backgroundColor: "#CCCCCC",
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rmRow: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    borderBottomColor: "#EEEEEE",
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  rmRowLast: {
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    borderBottomColor: "#333",
    borderBottomWidth: 0,
    paddingHorizontal: 10,
  },
  rmLabel: {
    fontSize: 24,
    color: "#333",
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  rmLabelRm: {
    fontSize: 24,
    color: "#333",
    paddingVertical: 5,
    fontWeight: "bold",
    paddingHorizontal: 10,
  },
  exercise: {
    fontWeight: "bold",
    fontStyle: "italic",
  },
});

export default ProgressExercise;
