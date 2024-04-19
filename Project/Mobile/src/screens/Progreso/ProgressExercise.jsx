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
const rmsFuture = [100, 95, 90];

const ProgressExercise = ({ navigation }) => {
  const [dataGotten, setDataGotten] = useState(false);
  const [cardioDataGotten, setCardioDataGotten] = useState(false);
  const [calculationsCompleted, setCalculationsCompleted] = useState(false);
  const [otherCalculationsCompleted, setOtherCalculationsCompleted] =
    useState(false);
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [oneRM, setOneRM] = useState(null);
  const [growthRate, setGrowthRate] = useState("");
  const [selectedTime, setSelectedTime] = useState("mes");
  const [rms, setRms] = useState([]);
  const [historical1RMData, setHistorical1RMData] = useState([]);
  const [time1RMData, settime1RMData] = useState([]);
  const [predicted1RMs, setPredicted1RMs] = useState([]);

  const [weightChartData, setWeightChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
    isCardio: false,
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [improvementChartData, setImprovementChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    const fetchHistorical1RMAbsoluta = async () => {
      const oid = await AsyncStorage.getItem("userOID");
      const timeScale = selectedTime; // Asumiendo que selectedTime ya tiene el valor correcto ('semana', 'mes', etc.)

      if (selectedExercise && selectedExercise.key && timeScale) {
        try {
          const url = `${config.apiBaseUrl}/HistoricalRMAbsoluta/${oid}/${selectedExercise.key}/${timeScale}`;
          const response = await fetch(url);
          const data = await response.json();

          // Verificar si los datos incluyen un campo de tiempo para determinar si es cardiovascular
          if (data.length > 0 && "tiempo_en_minutos" in data[0]) {
            // Si es cardiovascular, ajustar los datos para la gráfica
            const labels = data.map((entry) => entry.fecha);
            const times = data.map((entry) => entry.tiempo_en_minutos);
            console.log(times);
            setWeightChartData({
              labels,
              datasets: [
                {
                  data: times,
                  color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Cambiar color si se desea
                  strokeWidth: 2,
                },
              ],
              isCardio: true, // Asumiendo que quieres marcar si es cardio directamente en este estado
            });
            console.log("Times:", times);
            setCardioDataGotten(true);
          } else {
            // Manejo de datos no cardiovasculares (ejercicios de fuerza)
            const labels = data.map((entry) => entry.fecha);
            const forceData = data.map((entry) => entry.FuerzaAbsoluta);

            setWeightChartData({
              labels,
              datasets: [
                {
                  data: forceData,
                  color: (opacity = 1) => `rgba(7, 144, 207, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
              isCardio: false,
            });
          }
          setDataGotten(true);
        } catch (error) {
          console.error("Error al obtener los datos históricos:", error);
        }
      }
    };

    const fetchTime1RMData = async () => {
      const oid = await AsyncStorage.getItem("userOID"); // Obtiene el ID del usuario
      if (!selectedExercise || !oid || !selectedTime) return;

      try {
        // Construye la URL del endpoint. Asegúrate de reemplazar "ruta_al_endpoint" con la URL correcta
        const url = `${config.apiBaseUrl}/HistoricalRMs/${oid}/${selectedExercise.key}/${selectedTime}`;
        const response = await fetch(url);
        const data = await response.json();

        // Actualiza el estado con los datos obtenidos
        settime1RMData(data);

        console.log(
          "Datos de 1RM para el tiempo seleccionado obtenidos correctamente:",
          data
        );
      } catch (error) {
        console.error(
          "Error al obtener los datos de 1RM para el tiempo seleccionado:",
          error
        );
      }
    };
    fetchHistorical1RMAbsoluta();
    fetchTime1RMData();
  }, [selectedExercise, selectedTime]);

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
        const data = await response.json();
        // Transformar datos si es necesario para que coincidan con lo esperado por SelectList
        const ejerciciosTransformados = data.map((ejercicio) => ({
          key: ejercicio.ID_Ejercicio.toString(),
          value: ejercicio.ejercicio,
          type: ejercicio.Modalidad,
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
    { key: "semana", value: "Una semana" },
    { key: "mes", value: "Un mes" },
    { key: "tresMeses", value: "Tres meses" },
    { key: "seisMeses", value: "Seis meses" },
    { key: "unAno", value: "Un año" },
    { key: "tresAnos", value: "Tres años" },
  ];


  useEffect(() => {
    const fetchOneRM = async () => {
      if (selectedExercise?.type != 'Cardiovascular') {
      const oid = await AsyncStorage.getItem("userOID");
      console.log("OID:", oid);
      if (selectedExercise.key) {
        try {
          const response = await fetch(
            `${config.apiBaseUrl}/RM/${oid}/${selectedExercise.key}`
          );
          const data = await response.json();
          // Verifica que la respuesta no esté vacía y luego extrae el valor de Max1RM
          if (data.length > 0) {
            console.log("RM obtenido correctamente");
            setOneRM(data[0].Max1RM);
          } else {
            setOneRM(null);
            setRms([]);
            console.log(
              "No se encontró el 1RM para el ejercicio seleccionado."
            );
          }
        } catch (error) {
          setOneRM(null);
          setRms([]);
        }
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
      console.log("RMS calculados correctamente");
      setRms(calculatedRms);
    }
  }, [oneRM]);

  useEffect(() => {
    const fetchHistorical1RM = async () => {
      const oid = await AsyncStorage.getItem("userOID");
      if (selectedExercise && selectedExercise.key) {
        try {
          const response = await fetch(
            `${config.apiBaseUrl}/HistoricalRM/${oid}/${selectedExercise.key}`
          );
          const data = await response.json();
          setHistorical1RMData(data);
          console.log("RMS historicos obtenidos correctamente");
          // Aquí puedes llamar a la función para realizar los cálculos de predicció
        } catch (error) {
          console.error(
            "Error al obtener los datos históricos del 1RM:",
            error
          );
          setHistorical1RMData([]);
        }
      }
    };

    fetchHistorical1RM();
  }, [rms]);

  useEffect(() => {
    if (historical1RMData && historical1RMData.length > 1) {
      let L = historical1RMData[0].Max1RM; // Nivel inicial basado en el primer valor de RM
      let T = historical1RMData[1].Max1RM - historical1RMData[0].Max1RM; // Tendencia inicial basada en la diferencia entre el primer y segundo valor de RM
      const alpha = 0.9; // Factor de suavizado para el nivel
      const beta = 0.6; // Factor de suavizado para la tendencia

      // Itera a través de los datos históricos para calcular el suavizado y la tendencia
      historical1RMData.forEach((dataPoint, index) => {
        if (index > 0) {
          // Omite el primer valor ya que se usa como base para el cálculo inicial
          const Y = dataPoint.Max1RM; // Valor observado de 1RM
          let L_prev = L; // Guarda el valor anterior de L
          L = alpha * Y + (1 - alpha) * (L_prev + T); // Calcula el nuevo nivel
          T = beta * (L - L_prev) + (1 - beta) * T; // Calcula la nueva tendencia
        }
      });

      // Calcula las predicciones para los próximos 3 meses
      let predictions = [];
      for (let n = 1; n <= 3; n++) {
        let nextMonthPrediction = L + n * T;
        predictions.push(nextMonthPrediction);
      }

      setPredicted1RMs(predictions); // Guarda las predicciones calculadas

      // Genera las etiquetas (fechas) para los próximos 3 meses
      const lastDate = historical1RMData[historical1RMData.length - 1].fecha;
      const dateObj = new Date(lastDate);
      const labels = [lastDate];
      for (let i = 1; i <= 3; i++) {
        dateObj.setMonth(dateObj.getMonth() + 1);
        labels.push(dateObj.toISOString().split("T")[0]);
      }

      // Configura los datos para el gráfico, incluyendo el último RM conocido y las predicciones
      const chartDataPoints = [
        historical1RMData[historical1RMData.length - 1].Max1RM,
      ].concat(predictions);

      setChartData({
        labels,
        datasets: [
          {
            data: chartDataPoints,
            color: (opacity = 1) => `rgba(7, 144, 207, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
      setCalculationsCompleted(true);
      console.log("Datos de predicción y gráfico calculados correctamente");
    }
  }, [historical1RMData]); // Solo depende de los datos históricos de 1RM

  useEffect(() => {
    if (time1RMData && time1RMData.length >= 3) {
      const rmValues = time1RMData.map((data) => data.RM);
      const N = rmValues.length;
      const meanRM = rmValues.reduce((a, b) => a + b, 0) / N;

      // Calculo de Desviación Estándar
      const variance =
        rmValues.reduce((acc, cur) => acc + Math.pow(cur - meanRM, 2), 0) / N;
      const standardDeviation = Math.sqrt(variance);

      // Preparativos para Regresión Lineal
      const times = rmValues.map((_, index) => index + 1);
      const meanTime = times.reduce((a, b) => a + b, 0) / N;
      const sumXT = rmValues.reduce(
        (acc, cur, idx) => acc + (cur - meanRM) * (times[idx] - meanTime),
        0
      );
      const sumTT = times.reduce(
        (acc, cur) => acc + Math.pow(cur - meanTime, 2),
        0
      );

      // Pendiente (m) de la Regresión Lineal
      const m = sumXT / sumTT;

      // Tasa de Crecimiento
      const growthRate = (m / meanRM) * 100;

      // Bandas de Confianza
      const confidenceLower = meanRM - 1.96 * standardDeviation;
      const confidenceUpper = meanRM + 1.96 * standardDeviation;

      // Actualizar el estado para reflejar estos cálculos
      const labels = historical1RMData.map((data, index) => {
        return index % Math.ceil(historical1RMData.length / 4) === 0 ? data.fecha : '';
      });
        const data = historical1RMData.map(
        (_, index) => meanRM + m * (index + 1 - meanTime)
      );

      // Establecer los chartDataPoints para improvementChartData
      setImprovementChartData({
        labels: labels,
        datasets: [
          {
            data: data,
            color: (opacity = 1) => `rgba(7, 144, 207, ${opacity})`,
            strokeWidth: 2,
          },
        ],
      });
      // Puedes ajustar cómo y dónde mostrar la tasa de crecimiento y las bandas de confianza según tu UI
      setOtherCalculationsCompleted(true);
      console.log("RM VALUES:", rmValues);
      console.log(`Tasa de crecimiento: ${growthRate.toFixed(2)}%`);
      console.log(
        `Intervalo de confianza: ${confidenceLower.toFixed(
          2
        )} - ${confidenceUpper.toFixed(2)}`
      );
      setGrowthRate(growthRate);
    } else {
      console.log("No hay suficientes datos para realizar los cálculos.");
    }
  }, [calculationsCompleted, selectedTime]);  

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
          Progreso de cargas de{" "}
          <Text style={styles.exercise}>{selectedExercise?.value}</Text>
        </Text>

        {weightChartData.isCardio ? (
          <>
            {cardioDataGotten && (
              <LineChart
                data={weightChartData}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#EEEEEE",
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientTo: "#EEEEEE",
                  backgroundGradientToOpacity: 0.5,
                  labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
                  color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // O el color que prefieras
                  strokeWidth: 3,
                  fillShadowGradientFrom: "rgba(255, 99, 132, 1)",
                  fillShadowGradientTo: "rgba(255, 255, 255, 0)",
                }}
                bezier
                style={styles.chart}
                withHorizontalLines={true}
                withVerticalLabels={true}
              />
            )}
          </>
        ) : (
          <>
            {oneRM !== null ? (
              <>
                {dataGotten && (
                  <>
                    <LineChart
                      data={weightChartData}
                      width={screenWidth}
                      height={220}
                      chartConfig={{
                        backgroundGradientFrom: "#EEEEEE",
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: "#EEEEEE",
                        backgroundGradientToOpacity: 0.5,
                        labelColor: (opacity = 1) =>
                          `rgba(51, 51, 51, ${opacity})`,
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
                  </>
                )}
                {otherCalculationsCompleted && (
                  <>
                    <Text style={styles.sectionTitle}>
                      Tu mejora de 1RM en{" "}
                      <Text style={styles.exercise}>
                        {selectedExercise?.value}
                      </Text>{" "}
                      ha sido de
                      <Text style={styles.exercise}>
                        {" "}
                        {growthRate.toFixed(2)}%{" "}
                      </Text>
                    </Text>
                    <LineChart
                        data={improvementChartData}
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
                  </>
                )}
                <Text style={styles.sectionTitle}>
                  Tus repeticiones maximas actuales de{" "}
                  <Text style={styles.exercise}>{selectedExercise?.value}</Text>
                </Text>
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
                  A este paso, calculamos que tu
                  <Text style={styles.exercise}>1RM</Text> de
                  <Text style={styles.exercise}>
                    {selectedExercise?.value}
                  </Text>{" "}
                  en 3 meses será...
                </Text>
                <View style={styles.rmTable}>
                  {predicted1RMs.map((rm, index) => (
                    <View
                      style={index == 2 ? styles.rmRowLast : styles.rmRow}
                      key={index}
                    >
                      <Text style={styles.rmLabel}>
                        + {index + 1} {index > 0 ? "meses" : "mes"}
                      </Text>
                      <Text style={styles.rmLabelRm}>{rm.toFixed(2)} kg</Text>
                    </View>
                  ))}
                </View>
                {calculationsCompleted && (
                  <>
                    <LineChart
                      data={chartData}
                      width={screenWidth}
                      height={220}
                      chartConfig={{
                        backgroundGradientFrom: "#EEEEEE",
                        backgroundGradientFromOpacity: 0,
                        backgroundGradientTo: "#EEEEEE",
                        backgroundGradientToOpacity: 0.5,
                        labelColor: (opacity = 1) =>
                          `rgba(51, 51, 51, ${opacity})`,
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
                  </>
                )}
              </>
            ) : (
              <Text style={styles.noDataText}>
                No hay suficientes datos para mostrarse.
              </Text>
            )}
          </>
        )}
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
  noDataText: {
    fontSize: 20,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
});

export default ProgressExercise;
