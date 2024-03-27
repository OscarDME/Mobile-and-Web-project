import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, VirtualizedList } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import { AntDesign } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import {BodyMeasures} from './DATA_MEASURES'
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

// Ejemplo de valores de RM del 1RM al 12RM
const rms = [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45]; 
const rmsFuture = [100, 95, 90]; 



const ProgressExercise = ({ navigation }) => {
  const [selected, setSelected] = useState("Cuello");

  const data = {
    labels: ['15/01/24', '18/01/24'],
    datasets: [
      {
        data: [10, 11],
      },
    ],
  };  
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
          setSelected={setSelected} 
          data={measures} 
          placeholder="Selecciona un ejercicio"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
          width={300}
        />
        <SelectList 
          setSelected={setSelected} 
          data={measures} 
          placeholder="Tiempo"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
        />
    </View>
    <ScrollView style={styles.scrollView}>
  <Text style={styles.sectionTitle}>Progreso de cargas de <Text style={styles.exercise}>{selected}</Text></Text>

      <LineChart
        data={data}
        width={screenWidth} 
        height={220}
        chartConfig={{
        backgroundGradientFrom: "#ee",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#ee",
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
  <Text style={styles.sectionTitle}>Tus repeticiones maximas actuales de <Text style={styles.exercise}>{selected}</Text></Text>
  <View style={styles.rmTable}>
    {rms.map((rm, index) => (
      <View style={index==11 ? styles.rmRowLast : styles.rmRow} key={index}>
        <Text style={styles.rmLabel}>{index+1}RM</Text>
        <Text style={styles.rmLabelRm}>{rm} kg</Text>
      </View>
    ))}
  </View>
  <Text style={styles.sectionTitle}>A este paso, calculamos que tu <Text style={styles.exercise}>1RM</Text> de <Text style={styles.exercise}>{selected}</Text> en 3 meses será...</Text>
  <View style={styles.rmTable}>
    {rmsFuture.map((rm, index) => (
      <View style={index==2 ? styles.rmRowLast : styles.rmRow} key={index}>
        <Text style={styles.rmLabel}>+ {index+1} {index>0?"meses":"mes"}</Text>
        <Text style={styles.rmLabelRm}>{rm} kg</Text>
      </View>
    ))}
  </View>
    <LineChart
        data={data}
        width={screenWidth} 
        height={220}
        chartConfig={{
        backgroundGradientFrom: "#ee",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#ee",
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
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  chart: {
    marginVertical: 16,
    borderRadius: 16,
  },
  select:{
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  scrollView:{
    height: "80%",
  },
  sectionTitle:{
    fontSize: 24,
    color: '#333',
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  rmTable:{
    width: '80%',
    backgroundColor: '#CCCCCC',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 20,

  },rmRow:{
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent:'space-between',
    width: '80%',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  rmRowLast:{
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent:'space-between',
    width: '80%',
    borderBottomColor: '#333',
    borderBottomWidth: 0,
    paddingHorizontal: 10,

  },
  rmLabel:{
    fontSize: 24,
    color: '#333',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  rmLabelRm:{
    fontSize: 24,
    color: '#333',
    paddingVertical: 5,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  exercise:{
    fontWeight: 'bold',
    fontStyle: 'italic',
  }
});

export default ProgressExercise;
