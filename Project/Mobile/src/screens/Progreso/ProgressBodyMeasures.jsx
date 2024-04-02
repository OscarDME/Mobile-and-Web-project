import React, {useState, useEffect, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import { AntDesign } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import {BodyMeasures} from './DATA_MEASURES'
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import config from "../../utils/conf";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProgressBodyMeasures = ({ navigation }) => {
  const [selectedMeasureToShow, setSelectedMeasureToShow] = useState('peso');
  const [selectedInterval, setSelectedInterval] = useState('3MESES');
  const [milestones, setMilestones] = useState([]);
  const [chartData, setChartData] = useState({});
  const [isLoadingChartData, setIsLoadingChartData] = useState(true);

  const fetchMilestones = async () => {
    try {
      const oid = await AsyncStorage.getItem("userOID");
        const response = await fetch(`${config.apiBaseUrl}/allMilestones/${oid}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            setMilestones(data);
            console.log("Mediciones cargadas", data);
        } else {
            console.error("Error al obtener las mediciones:", response.statusText);
        }
    } catch (error) {
        console.error("Error al obtener las mediciones:", error);
    }
};

const fetchGraphData = async () => {
  if (!selectedMeasureToShow) {
    console.log("No se ha seleccionado una medida para mostrar");
    return;
  }
  setIsLoadingChartData(true);
  try {
    const oid = await AsyncStorage.getItem("userOID");
      const response = await fetch(`${config.apiBaseUrl}/allMilestonesMobile/${oid}/${selectedMeasureToShow}/${selectedInterval}`, {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
          },
      });

      if (response.ok) {
        const { fechas, valores } = await response.json();
        console.log("Respuesta del backend:", { fechas, valores });
  
        // Actualiza los datos del gráfico
        setChartData({
          labels: fechas, // Las fechas van en el eje X
          datasets: [
            {
              data: valores,
            }
          ]
        });
        setIsLoadingChartData(false);
        console.log("Datos del gráfico cargados", { fechas, valores });
      } else {
        setIsLoadingChartData(false);
        console.error("Error al obtener los datos de la grafica:", response.statusText);
      }
    } catch (error) {
      setIsLoadingChartData(false);
      console.error("Error al obtener los datos de la grafica:", error);
    }
  };

  useEffect(() => {
    fetchGraphData();
    fetchMilestones();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchMilestones();
      fetchGraphData();
    });
  
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchGraphData();
    console.log("Datos del gráfico:", chartData);
  }, [selectedMeasureToShow, selectedInterval]);


  const measuresClient = [
    { key: "cuello", value: "Cuello" },
    { key: "estatura", value: "Estatura" },
    { key: "peso", value: "Peso" },
    { key: "IMC", value: "IMC" },
    { key: "pecho", value: "Pecho" },
    { key: "hombro", value: "Hombro" },
    { key: "bicep", value: "Bicep" },
    { key: "antebrazo", value: "Antebrazo" },
    { key: "cintura", value: "Cintura" },
    { key: "cadera", value: "Cadera" },
    { key: "pantorilla", value: "Pantorilla" },
    { key: "muslo", value: "Muslo" },
    { key: "porcentaje_grasa", value: "Porcentaje grasa" },
    { key: "masa_muscular", value: "Masa muscular" },
    { key: "presion_arterial", value: "Presion arterial" },
    { key: "ritmo_cardiaco", value: "Ritmo cardiaco" },
  ];

  const measures = [
    {key: 'peso', value: 'Peso'},
    {key: 'estatura', value: 'Estatura'},
    {key: 'IMC', value: 'IMC'},
  ];

  const intervals = [
    {key: 'SEMANA', value: '1 semana'},
    {key: 'MES', value: '1 Mes'},
    {key: '3MESES', value: '3 Meses'},
    {key: '6MESES', value: '6 Meses'},
    {key: 'ANO', value: '1 Año'},
    {key: '3ANOS', value: '3 Años'},
    {key: 'TODOS', value: 'Todas las medidas'},
  ];

  return (
    <View style={styles.container}>
    <View style={styles.select}>
    <SelectList 
          setSelected={(val) => setSelectedMeasureToShow(val)} 
          data={measuresClient} 
          onSelect={() => console.log(selectedMeasureToShow)}
          placeholder="Selecciona una medida"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
          defaultOption={measures[0]}

        />
      <SelectList 
          setSelected={setSelectedInterval} 
          data={intervals} 
          placeholder="Tiempo"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
          defaultOption={intervals[2]}
        />
    </View>

    {isLoadingChartData ? (
      <Text>Cargando datos del gráfico...</Text>
    ) : chartData.labels && chartData.labels.length > 0 ? ( 
      <LineChart
        data={chartData}
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
    ) : (
      <Text style={styles.noDataText}>No hay suficientes datos para formar la gráfica</Text> 
    )}

      <View style={styles.headerWithIcon}>
        <Text style={styles.headerHistory}>Historial de medidas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('IndividualBodyMeasure')}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
      {milestones.map((milestone) => (
          <TouchableOpacity
            key={milestone.id}
            onPress={() => navigation.navigate('IndividualBodyMeasure', { measureDetails: milestone })}
            style={styles.item}
          >
            <Text style={styles.item}>{milestone.fecha}</Text>
            <AntDesign name="right" size={24} color="black" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },

  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  headerHistory: {
    fontSize: 24,
    marginTop: 5,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 24,
    paddingVertical: 5,
    marginVertical: 8,
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  contentContainer:{
    alignContent: 'flex-start',
    width: '80%',
    height: "30%",
  },
  select:{
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
  }, headerWithIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%', 
    paddingVertical: 5,
  },noDataText:{
    paddingVertical:130,
    fontSize:18,
    marginHorizontal:10,
  }
});

export default ProgressBodyMeasures;
