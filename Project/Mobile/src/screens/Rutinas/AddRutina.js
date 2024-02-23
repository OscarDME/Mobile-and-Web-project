import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalDropdown from 'react-native-modal-dropdown';

const AddRoutineScreen = ({ navigation }) => {
  const [routineName, setRoutineName] = useState('');
  const [workouts, setWorkouts] = useState([]);

  const daysOptions = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const addDay = () => {
    setWorkouts([...workouts, { 
      id: `Día ${workouts.length + 1}`, 
      muscles: '', 
      duration: '',
      ID_Dia: null // Este valor se actualizará con el índice del día seleccionado
    }]);
  };

  const deleteDay = (index) => {
    const newWorkouts = workouts.filter((_, i) => i !== index);
    setWorkouts(newWorkouts);
  };

  const onSelectDay = (index, optionIndex) => {
    // Actualiza el día basado en la selección del usuario
    const updatedWorkouts = workouts.map((workout, i) => {
      if (i === index) {
        return { ...workout, ID_Dia: optionIndex + 1 }; // Asumiendo que los IDs de los días van de 1 a 7
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };

  const saveRoutine = () => {
    console.log("Nombre de la rutina:", routineName);
    console.log("Workouts:", workouts);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nombre de la rutina</Text>
        <TouchableOpacity onPress={saveRoutine}>
          <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la rutina"
        value={routineName}
        onChangeText={setRoutineName}
      />
      <ScrollView style={styles.workoutsList}>
        {workouts.map((workout, index) => (
          <View key={index} style={styles.workoutItem}>
            <TouchableOpacity onPress={() => deleteDay(index)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutDay}>Dia {workout.id}</Text>
              <ModalDropdown 
                options={daysOptions} 
                onSelect={(optionIndex) => onSelectDay(index, optionIndex)}
                defaultValue="Selecciona un día"
                textStyle={styles.dropdownText}
                dropdownTextStyle={styles.dropdownTextStyle}
                dropdownStyle={styles.dropdownStyle}
              />
              {/* Por ahora los campos de músculos y tiempo quedan vacíos */}
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={addDay}>
        <Text style={styles.addButtonText}>Añadir día</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  workoutsList: {
    flex: 1,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workoutDay: {
    fontWeight: 'bold',
  },
  addButton: {
    margin: 16,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  dropdownStyle: {
    marginTop: 15,
    marginLeft: -10,
    width: 150,
  },
  // Estilos adicionales para el ícono de borrar, texto y dropdown pueden ir aquí
});
export default AddRoutineScreen;
