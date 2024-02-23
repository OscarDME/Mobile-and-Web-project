import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar expo-vector-icons

const ExerciseDayScreen = ({ navigation, route }) => {
  // Asumiendo que se pasa el día como un parámetro de la ruta
  const { day } = route.params;
  
  const [exercises, setExercises] = useState([
    { id: '1', name: 'Curl Femoral', sets: '3 sets', reps: '15 reps', weight: '10kg' },
    { id: '2', name: 'Sentadilla', sets: '5 sets', reps: '5 reps', weight: '100kg' },
    { id: '3', name: 'Desplante', sets: '3 sets', reps: '15 reps', weight: '20kg' },
    // Agrega más ejercicios predeterminados según sea necesario
  ]);

  const handlePressExercise = (exerciseId) => {
    // Navega a la pantalla de AddSets, pasando el ID del ejercicio como parámetro si es necesario
    navigation.navigate('AddSets', { exerciseId });
  };

  const addExercise = () => {
    // Funcionalidad para añadir un nuevo ejercicio
    // Puede abrir una nueva pantalla o un modal para ingresar los detalles del ejercicio
  };

  const deleteExercise = (id) => {
    // Funcionalidad para eliminar un ejercicio por su id
    setExercises(exercises.filter(exercise => exercise.id !== id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{day}</Text>
        <TouchableOpacity onPress={() => { /* Funcionalidad de guardar */ }}>
          <Text style={styles.saveButton}>Guardar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Ejercicios</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.exerciseItem}
            onPress={() => handlePressExercise(item.id)}
          >
            <Text style={styles.exerciseName}>{item.name}</Text>
            <Ionicons name="arrow-forward" size={24} color="black" />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addButtonText}>Añadir Ejercicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    saveButton: {
      color: '#0000ff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    sectionTitle: {
      padding: 16,
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: '#f7f7f7',
    },
    exerciseItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      elevation: 3, // Añade sombra en Android
      // Para iOS, puedes usar shadowColor, shadowOffset, shadowOpacity, shadowRadius
    },
    exerciseInfo: {
      flex: 1,
      justifyContent: 'center',
      marginLeft: 16, // Ajusta según sea necesario
    },
    exerciseName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000',
    },
    exerciseDetails: {
      fontSize: 16,
      color: '#666',
    },
    addButton: {
      backgroundColor: '#0000ff',
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: 'center',
      marginVertical: 16,
      marginHorizontal: 16,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
  

export default ExerciseDayScreen;
