import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";

const Calendario = ({ navigation, route }) => {
  const [dietEvents, setDietEvents] = useState([]);
  const [routineEvents, setRoutineEvents] = useState([]);
  const [appointmentEvents, setAppointmentEvents] = useState([]); // Nuevo estado para citas
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(''); // Nuevo estado para almacenar la fecha seleccionada


  useFocusEffect(
    useCallback(() => {
      fetchEventData();
    }, [])
  );

  const fetchEventData = async () => {
    try {
      const oid = await AsyncStorage.getItem('userOID');
      if (!oid) {
        console.error('OID not found');
        return;
      }

      // Fetch diet event
      const dietResponse = await fetch(`${config.apiBaseUrl}/dieta/${oid}`);
      const dietData = await dietResponse.json();
      setDietEvents(dietData);

      // Fetch routine events
      const routineResponse = await fetch(`${config.apiBaseUrl}/rutinasasignar/${oid}`);
      const routineData = await routineResponse.json();
      setRoutineEvents(routineData);

      // Fetch appointment events
      const appointmentResponse = await fetch(`${config.apiBaseUrl}/citasaceptada/${oid}`); // Asumiendo esta es la ruta para citas
      const appointmentData = await appointmentResponse.json();
      setAppointmentEvents(appointmentData);
    } catch (error) {
      console.log('Error fetching event data:', error);
    }
  };

  const transformEventDates = (events, color, eventType, singleDay = false, pastColor = color) => {
    if (!Array.isArray(events)) {
      console.log('Expected events to be an array, got:', events);
      return {}; // Return empty object or handle as needed
    }
    const markedDates = {};
    events.forEach(event => {
      let startDate, endDate;
      if (!singleDay) {
        startDate = new Date(event.fecha_inicio);
        endDate = new Date(event.fecha_fin);
      } else {
        startDate = new Date(event.fecha);
        endDate = new Date(event.fecha);
      }
      let currentDate = new Date(startDate.getTime());
  
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        const isPastEvent = currentDate < new Date().setHours(0, 0, 0, 0);
        const eventColor = isPastEvent ? pastColor : color;
        if (!markedDates[dateString]) {
          markedDates[dateString] = {
            dots: [{ color: eventColor, key: getEventKey(event, eventType) }]
          };
        } else {
          markedDates[dateString].dots.push({ color: eventColor, key: getEventKey(event, eventType) });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return markedDates;
  };
  
  const getEventKey = (event, eventType) => {
    if (eventType === 'Dieta') {
      return 'Dieta';
    } else if (eventType === 'NombreRutina') {
      return `Entrenamiento (${event[eventType]})`;
    } else if (eventType === 'Cita') {
      return 'Cita';
    } else {
      return 'Evento';
    }
  };
  

  const dietMarkedDates = transformEventDates(dietEvents, '#28B463', 'Dieta');
  const routineMarkedDates = transformEventDates(routineEvents, '#3498DB', 'NombreRutina', false, '#9B59B6');
  const appointmentMarkedDates = transformEventDates(appointmentEvents, '#FFA07A', 'Cita', true); // Color naranja para citas

  const mergeMarkedDates = (...datesArrays) => {
    return datesArrays.reduce((acc, dates) => {
      Object.keys(dates).forEach(date => {
        if (!acc[date]) {
          acc[date] = { dots: [] };
        }
        acc[date].dots = acc[date].dots.concat(dates[date].dots);
      });
      return acc;
    }, {});
  };

  const allMarkedDates = mergeMarkedDates(dietMarkedDates, routineMarkedDates, appointmentMarkedDates);
  const handleDayPress = (day) => {
    const dayEvents = allMarkedDates[day.dateString]?.dots || [];
    setSelectedDayEvents(dayEvents);
    setSelectedDate(day.dateString);
    console.log('Day pressed', day.dateString);
    console.log(selectedDate);
  };


  const handleEventPress = (key, selectedDate) => {
    console.log('Event pressed', selectedDate);
    if (key.includes('Dieta')) {
      navigation.navigate('Comidas', { selectedDate: selectedDate });
    } else if (key.includes('Entrenamiento')) {
      const pressedDate = new Date(selectedDate);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      if (pressedDate < currentDate) {
        navigation.navigate('TrainingStack', { screen: 'Visualizar', params: { selectedDate: selectedDate } });
      } else {
        navigation.navigate('Entrenamiento', { selectedDate: selectedDate });
      }
    } else if (key.includes('Cita')) {
      navigation.navigate('DetallesCita', { selectedDate: selectedDate });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={allMarkedDates}
        markingType={'multi-dot'}
        style={styles.calendar}
      />
      <View style={styles.eventListContainer}>
        <Text style={styles.eventListHeader}>Eventos del día:</Text>
        {selectedDayEvents.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.eventItem, { backgroundColor: event.color }]}
            onPress={() => handleEventPress(event.key, selectedDate)} // Actualiza esta línea
          >
            <Text style={styles.eventText}>{event.key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calendar: {
    marginBottom: 10,
  },
  eventListContainer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 10,
  },
  eventListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  eventText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Calendario;
