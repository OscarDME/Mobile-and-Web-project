import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {workoutSession} from './DATA_WORKOUT.js';

const TrainingScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Siguiente entrenamiento</Text>
        <Text style={styles.dateText}>16/06/2024</Text>
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
        {/*PONGO DOS EJEMPLOS PARA MOSTRAR EJERCICIOS DE DISTINTOS TIPOS, SOLAMENTE QUEDA HACER EL MAP YA EN EL BACKEND*/}
        <View style={styles.exerciseRowHeader}>
          <View style={styles.exerciseTitle}>
          <Text style={styles.exerciseHeaderText}>Ejercicio</Text>
          </View>
          <View style={styles.exerciseDescription}>
          <Text style={styles.exerciseHeaderText}>Detalles</Text>
          </View>
        </View>
        {workoutSession.session.map((item, index) => (
            item.exerciseToWork.type === "Cardiovascular" ? (

              <View key={item.id} style={styles.exerciseRow}>
                <View style={styles.exerciseTextContainer}>
                  <Text style={styles.exerciseTextName}>{item.exerciseToWork.name}</Text>
                </View>
                <View style={styles.exerciseTextContainerCardiovascular}>
                  <Text style={styles.exerciseTextHeader}>Tiempo</Text>
                  <Text style={styles.exerciseText}>{item.time} minutos</Text>
                </View>
              </View>
              
            ) : (
              // Si el tipo no es Cardiovascular
              <View key={item.id} style={styles.exerciseRow}>
                <View style={styles.exerciseTextContainer}>
                  <Text style={styles.exerciseTextName}>{item.exerciseToWork.name}</Text>
                </View>
                <View style={styles.exerciseTextContainer}>
                  <Text style={styles.exerciseTextHeader}>Reps</Text>
                  <Text style={styles.exerciseText}>{item.reps}</Text>
                </View>
                <View style={styles.exerciseTextContainer}>
                  <Text style={styles.exerciseTextHeader}>Peso</Text>
                  <Text style={styles.exerciseText}>{item.weight} kg</Text>
                </View>
                <View style={styles.exerciseTextContainer}>
                  <Text style={styles.exerciseTextHeader}>Descanso</Text>
                  <Text style={styles.exerciseText}>{item.rest} s</Text>
                </View>
              </View>
            )
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => { 
          navigation.navigate("TrainingStack", {
            screen: "WorkoutScreen", 
            params: { workoutSession: workoutSession },
          })
        }}>
        <Text style={styles.buttonText}>¡Comenzar Entrenamiento!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 20,
    padding: 25,
  },
  header: {
    alignItems: 'center',
    rowGap: 20,
  },
  headerText: {
    fontSize: 24,
  },
  dateText: {
    fontSize: 18,
    color: 'grey',
  },
  trainingInfo: {
    flex: 1,
    marginTop: 5,
  },
  trainingDetail: {
    flexDirection: 'column',
    justifyContent: "center" ,
    rowGap:20,
    alignItems: "flex-start",
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: 'grey',
  },
  exercisesList: {
   backgroundColor: '#e0e0e0',
   borderRadius: 20,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  exerciseText: {
    fontSize: 14,
    color: 'black',
  },
  button: {
    backgroundColor: '#0790cf',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  trainingDetailrow:{
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  exerciseRowHeader:{
    backgroundColor: '#CCCCCC',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseTitle:{
    width: "25%",
    alignItems: "center",
  },
  exerciseDescription:{
    width: "75%",
    alignItems: "center",
  },
  exerciseHeaderText:{
    fontSize: 14,
    fontWeight: "bold",
  },
  exerciseTextName:{
    fontWeight: "600",
  },
  exerciseTextContainer:{
    width: "25%",
    alignItems: "center",
    rowGap: 5,
    justifyContent: "center",
  },
  exerciseTextHeader:{
    fontSize: 12,
    color: "grey",
    fontWeight: "400",
  },
  exerciseTextContainerCardiovascular:{
    width: "75%",
    alignItems: "center",
    rowGap: 5,
    justifyContent: "center",
  }

});

export default TrainingScreen;
