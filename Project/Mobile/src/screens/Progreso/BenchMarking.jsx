import React, {useState, useEffect} from 'react'
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { VictoryChart, VictoryLine, VictoryScatter, VictoryTheme, VictoryLabel, VictoryAxis } from 'victory-native';
import { SelectList } from 'react-native-dropdown-select-list'
import { Dimensions } from "react-native";
import config from "../../utils/conf";
import AsyncStorage from "@react-native-async-storage/async-storage";
const screenWidth = Dimensions.get("window").width;

export default function BenchMarking() {
  const [ejercicios, setEjercicios] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [maxStrength, setMaxStrength] = useState([]);
  const [avgStrengthByAge, setAvgStrengthByAge] = useState([]);
  const [strengthData, setStrengthData] = useState([]);
  const [percentageStronger, setPercentageStronger] = useState(null);

  useEffect(() => {
    const fetchEjercicios = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
        const data = await response.json();
        // Transformar datos si es necesario para que coincidan con lo esperado por SelectLi
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

  const fetchDataForExercise = async (exerciseId) => {
  const userId = await AsyncStorage.getItem("userOID");
  try {
    // Fetch maximum strength for the exercise
    const maxResponse = await fetch(`${config.apiBaseUrl}/Max/${userId}/${exerciseId}`);
    const maxData = await maxResponse.json();
    console.log("Max1RM:", maxData);
    if (!maxData) {
      setMaxStrength([]);
    } else {
      const maxStrengthFormatted = [{ edad: maxData.UserAge, fuerzaAbsoluta: maxData.StrengthRatio }]; // Asumiendo edad 30 para el ejemplo
      setMaxStrength(maxStrengthFormatted);
    }


    // Fetch average strength by age group for the exercise
    const avgResponse = await fetch(`${config.apiBaseUrl}/AgeGroup/${userId}/${exerciseId}`);
    const avgData = await avgResponse.json();
    if (avgData.length > 0) {
      const avgStrengthFormatted = avgData.map(item => ({
        edad: item.AgeGroup,
        fuerzaAbsoluta: item.StrengthRatio
      }));
      setAvgStrengthByAge(avgStrengthFormatted);
    } else {
      setAvgStrengthByAge([]);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchAllDataForExercise = async (exerciseId) => {
  const userId = await AsyncStorage.getItem("userOID");
  const responses = await Promise.all([
    fetch(`${config.apiBaseUrl}/Max/${userId}/${exerciseId}`),
    fetch(`${config.apiBaseUrl}/All/${userId}/${exerciseId}`)
  ]);
  const maxData = await responses[0].json();
  console.log("MaxData:", maxData);
  
  let allStrengthDataResponse = await responses[1].json();
  console.log("Initial StrengthData:", allStrengthDataResponse);

  // Limpiar y filtrar los datos
  allStrengthDataResponse = Object.values(allStrengthDataResponse);
  const allStrengthData = allStrengthDataResponse.filter(item =>
    item && typeof item === 'object' && item.ID_Usuario && item.ID_Usuario !== userId
  );

  console.log("Filtered StrengthData:", allStrengthData);

  if (maxData && allStrengthData.length > 0) {
    const userStrengthRatio = maxData.StrengthRatio;

    const mean = allStrengthData.reduce((acc, item) => acc + item.MaxStrengthRatio, 0) / allStrengthData.length;
    const deviations = allStrengthData.map(item => (item.MaxStrengthRatio - mean) ** 2);
    const stddev = Math.sqrt(deviations.reduce((acc, item) => acc + item, 0) / allStrengthData.length);

    const strongerThan = allStrengthData.filter(item => item.MaxStrengthRatio < userStrengthRatio).length;
    const percentage = (strongerThan / allStrengthData.length) * 100;

    console.log("Percentage stronger:", percentage.toFixed(2));
    console.log("Standard Deviation:", stddev);

    setPercentageStronger(percentage.toFixed(2));
  }
};

useEffect(() => {
  if (selectedExercise) {
    fetchAllDataForExercise(selectedExercise.key);
  }
}, [selectedExercise]);


  useEffect(() => {
    if (selectedExercise) {
      fetchDataForExercise(selectedExercise.key);
    }
  }, [selectedExercise]);


    const data = [
        { edad: 1, fuerzaAbsoluta: 2},
        { edad: 2, fuerzaAbsoluta: 3},
        { edad: 3, fuerzaAbsoluta: 5},
        { edad: 4, fuerzaAbsoluta: 4},
        { edad: 5, fuerzaAbsoluta: 6},
      ];

      const data2 = [
        { edad: 3, fuerzaAbsoluta: 8 },
      ];

      const measures = [
        {key: 'cuello', value: 'Cuello'},
        {key: 'pecho', value: 'Pecho'},
        {key: 'hombros', value: 'Hombros'},
        {key: 'bíceps', value: 'Bíceps'},
        {key: 'antebrazo', value: 'Antebrazo'},
        {key: 'cintura', value: 'Cintura'},
        {key: 'cadera', value: 'Cadera'},
        {key: 'pantorrillas', value: 'Pantorrillas'},
        {key: 'muslos', value: 'Muslos'},
      ];

  return (
    <View style={styles.container}>
    <View style={styles.select}>
    <SelectList
          setSelected={(selectedKey) => {
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
        </View>
        {percentageStronger && (
        <Text style={styles.sectionTitle}>
          ¡En <Text style={styles.exercise}>{selectedExercise?.value || 'seleccionando ejercicio'}</Text>, eres más fuerte que el <Text style={styles.exercise}>{percentageStronger}%</Text> de las personas en tu rango de edad!
        </Text>
      )}
      <View>
      {avgStrengthByAge.length > 0 && maxStrength.length > 0 ? (
        <VictoryChart
          theme={VictoryTheme.material}
          animate={{ duration: 1000, onLoad: { duration: 1000 } }}
          width={screenWidth - 15}
        >
          <VictoryAxis label="Edad" style={{ axisLabel: { padding: 30 } }} />
          <VictoryAxis dependentAxis label="Fuerza absoluta" style={{ axisLabel: { padding: 40 } }} />
          <VictoryLine
            data={avgStrengthByAge}
            x="edad"
            y="fuerzaAbsoluta"
            interpolation="natural"
            labels={({ datum }) => datum.fuerzaAbsoluta.toFixed(2)}
            labelComponent={<VictoryLabel dy={-10} dx={20} />}
            style={{ data: { stroke: "#333333", strokeOpacity: .7, strokeWidth: 3 } }}
          />
          <VictoryScatter
            data={maxStrength}
            x="edad"
            y="fuerzaAbsoluta"
            labels="Tu"
            labelComponent={<VictoryLabel dy={25} />}
            style={{ data: { fill: "#0790cf" } }}
            size={10}
          />
        </VictoryChart>
      ) : (
        <Text>Loading data...</Text>
      )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      alignContent: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 10,
      paddingHorizontal: 10,
    },
    select:{
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'space-around',
      width: '100%',
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    sectionTitle:{
      fontSize: 24,
      color: '#333',
      paddingVertical: 10,
      paddingHorizontal: 10,
      textAlign: 'center',
    },
    exercise:{
      fontWeight: 'bold',
      fontStyle: 'italic',
    }
})