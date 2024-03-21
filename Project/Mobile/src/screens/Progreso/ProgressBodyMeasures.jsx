import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit'; 
import { AntDesign } from '@expo/vector-icons';

const ProgressBodyMeasures = ({ navigation }) => {
  const data = {
    labels: ['15/01/24', '18/01/24'],
    datasets: [
      {
        data: [10, 11],
        strokeWidth: 2, // optional
      },
    ],
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={320} 
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#ee',
          backgroundGradientTo: '#ee',
          decimalPlaces: 2, // optional, defaults to 2dp
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
  }
});

export default ProgressBodyMeasures;
