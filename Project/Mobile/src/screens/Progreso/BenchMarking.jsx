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
        <Text style={styles.sectionTitle}>¡En <Text style={styles.exercise}>{selectedExercise}</Text>, eres más fuerte que el <Text style={styles.exercise}>{}%</Text> de las personas en tu rango de edad!</Text>
      <View>
      <VictoryChart
      theme={VictoryTheme.material}
      animate={{ duration: 1000,
      onLoad: { duration: 1000 }
      }}
      width={screenWidth - 15}
      >
          <VictoryAxis
      label="Edad"
      style={{
        axisLabel: { padding: 30 }
      }}
    />
        <VictoryAxis dependentAxis
      label="Fuerza absoluta"
      style={{
        axisLabel: { padding: 40 }
      }}
    />
        <VictoryLine data={data} 
        x={"edad"}
        y={"fuerzaAbsoluta"}
        interpolation="natural"
        labels={({ datum }) => datum.y}
        labelComponent={<VictoryLabel dy={8}/>}
        style={{
          data: { stroke: "#333333",
          strokeOpacity:.7,
          strokeWidth: 3,
           },
        }}
        />

        <VictoryScatter
            x={"edad"}
            y={"fuerzaAbsoluta"}
            labels={"Tu"}
            labelComponent={<VictoryLabel dy={25}/>}
            style={{ data: { fill: "#0790cf" } }}
            size={10}
            data={data2}
        />
      </VictoryChart>
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