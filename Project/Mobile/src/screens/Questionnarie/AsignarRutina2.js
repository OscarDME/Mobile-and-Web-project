import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";

const AssignRoutineScreen2 = ({ navigation, route }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [assignedRoutines, setAssignedRoutines] = useState([]);
  const [changeInterval, setChangeInterval] = useState('');
  const [omitAssignment, setOmitAssignment] = useState(false);

  const ID_Rutina = route.params.ID_Rutina;

  const fetchAssignedRoutines = async () => {
    const ID_Usuario = await AsyncStorage.getItem('userOID');
    if (!ID_Usuario) {
      console.log('ID de usuario no encontrado.');
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/rutinasasignar/${ID_Usuario}`);
      if (response.ok) {
        const data = await response.json();
        setAssignedRoutines(data);

        const currentRoutine = data.find(r => r.ID_Rutina === ID_Rutina);
        if (currentRoutine) {
         
        } else {
       
        }
      } else {
        console.error("No se pudieron obtener las rutinas asignadas.");
      }
    } catch (error) {
      console.error("Error al obtener las rutinas asignadas:", error);
    }
};

  
  useEffect(() => {
    fetchAssignedRoutines(); // Llamada para obtener las rutinas asignadas
  }, [ID_Rutina]);

  const isDateOverlap = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let routine of assignedRoutines) {
      const assignedStart = new Date(routine.fecha_inicio);
      const assignedEnd = new Date(routine.fecha_fin);
      if ((start >= assignedStart && start <= assignedEnd) || (end >= assignedStart && end <= assignedEnd) || (start <= assignedStart && end >= assignedEnd)) {
        return true; // Hay solapamiento
      }
    }
    return false; // No hay solapamiento
  };

  const onDayPress = (day) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      // Iniciar un nuevo rango
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else if (new Date(day.dateString) < new Date(selectedStartDate)) {
      // Si se selecciona una fecha anterior a la fecha de inicio, reiniciar el rango
      setSelectedStartDate(day.dateString);
      setSelectedEndDate(null);
    } else {
      // Configurar la fecha de finalización si es posterior a la fecha de inicio
      setSelectedEndDate(day.dateString);
    }
  };
  const handleAssignRoutine = async () => {
    if (!selectedStartDate || !selectedEndDate) {
      console.log('Por favor, seleccione un rango de fechas válido.');
      return;
    }
  
    if (isDateOverlap(selectedStartDate, selectedEndDate)) {
      Alert.alert('Error', 'El rango de fechas seleccionado se solapa con una asignación existente.');
      return;
    }
  
    const ID_Usuario = await AsyncStorage.getItem('userOID');
    if (!ID_Usuario) {
      console.log('ID de usuario no encontrado.');
      return;
    }
  
    const requestBody = {
      ID_Usuario,
      ID_Rutina,
      fechaInicio: selectedStartDate,
      fechaFin: selectedEndDate
    };
    console.log(requestBody);
  
    fetch(`${config.apiBaseUrl}/asignar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Rutina asignada con éxito:', data);
      navigation.navigate('Main', {screen: "MainMenu" });
    })
    .catch(error => {
      console.error('Error al asignar la rutina:', error);
    });
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asignar Rutina</Text>
      <Calendar
        onDayPress={onDayPress}
        style={styles.calendar}
        markingType={'period'}
        markedDates={{
          [selectedStartDate]: { startingDay: true, color: '#0790cf', textColor: 'white' },
          [selectedEndDate]: { endingDay: true, color: '#0790cf', textColor: 'white' },
        }}
      />
      {selectedStartDate && selectedEndDate && (
        <Text style={styles.dateText}>
          Fecha Inicio: {selectedStartDate} - Fecha Fin: {selectedEndDate}
        </Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleAssignRoutine}>
        <Text style={styles.addButtonText}>Asignar rutina</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Main', { screen: "MainMenu" })}>
        <Text style={styles.addButtonText}>Omitir Asignación</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  calendar: {
    minHeight: 350,  // Ajusta esto según el espacio disponible
    width: '100%'    // Asegura que el calendario ocupe todo el ancho disponible
  },
  dateText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    margin: 16,
    alignItems: "center",
    backgroundColor: "#0790cf",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default AssignRoutineScreen2;
