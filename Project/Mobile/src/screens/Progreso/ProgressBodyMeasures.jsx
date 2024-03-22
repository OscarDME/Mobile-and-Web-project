import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import { AntDesign } from '@expo/vector-icons';
import { SelectList } from 'react-native-dropdown-select-list'

const ProgressBodyMeasures = ({ navigation }) => {
  const [selected, setSelected] = useState("Cuello");

  const data = {
    labels: ['15/01/24', '18/01/24'],
    datasets: [
      {
        data: [10, 11],
        strokeWidth: 2, // optional
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
        />
    </View>
    
      <LineChart
        data={data}
        width={320} 
        height={220}
        chartConfig={{
          backgroundColor: '#ee',
          backgroundGradientFrom: '#ee',
          backgroundGradientTo: '#eee',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        bezier
        style={styles.chart}
        withShadow={false}
        withHorizontalLines={true}
        withVerticalLabels={true}
      />
      <View>
        <Text style={styles.headerHistory}>Historial de medidas</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
      <TouchableOpacity onPress={() => navigation.navigate('IndividualBodyMeasure')} style={styles.item}>
            <Text style={styles.item}>20/03/2024</Text>
            <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('IndividualBodyMeasure')} style={styles.item}>
            <Text style={styles.item}>20/03/2023</Text>
            <AntDesign name="right" size={24} color="black" />
      </TouchableOpacity>
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 22,
  },

  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  headerHistory: {
    fontSize: 24,
    marginTop: 16,
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
    width: '80%',
  }
});

export default ProgressBodyMeasures;
