import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import { AntDesign } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'
import {BodyMeasures} from './DATA_MEASURES'
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;


const ProgressBodyMeasures = ({ navigation }) => {
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
          placeholder="Selecciona una medida"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
        />
      <SelectList 
          setSelected={setSelected} 
          data={measures} 
          placeholder="Tiempo"
          searchPlaceholder="Buscar..."
          notFoundText="No se encontraron resultados"
        />
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
      <View style={styles.headerWithIcon}>
        <Text style={styles.headerHistory}>Historial de medidas</Text>
        <TouchableOpacity onPress={() => navigation.navigate('IndividualBodyMeasure')}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.contentContainer}>
      {BodyMeasures.map((measure) => (
          <TouchableOpacity
            key={measure.id}
            onPress={() => navigation.navigate('IndividualBodyMeasure', { measureDetails: measure })}
            style={styles.item}
          >
            <Text style={styles.item}>{measure.fecha}</Text>
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
    height: "100%",
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
    width: '80%', // Adjust the width as needed
    paddingVertical: 5,
  },
});

export default ProgressBodyMeasures;
