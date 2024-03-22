import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import config from "../../utils/conf";
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetallesCita = ({ route }) => {
  const { selectedDate } = route.params;
  const [citaDetails, setCitaDetails] = useState([]);

  useEffect(() => {
    fetchCitaDetails();
  }, []);

  const fetchCitaDetails = async () => {
    try {
      const oid = await AsyncStorage.getItem('userOID');
      if (!oid) {
        console.error('OID not found');
        return;
      }

      const response = await fetch(`${config.apiBaseUrl}/citasaceptada2/${oid}/${selectedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setCitaDetails(data);
    } catch (error) {
      console.error('Error fetching cita details:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles de la cita:</Text>
      <Text style={styles.subtitle}>  Fecha: {selectedDate}</Text>
      {citaDetails.length === 0 ? (
        <Text style={styles.message}>No hay detalles de cita disponibles.</Text>
      ) : (
        citaDetails.map((cita, index) => (
          <View key={index} style={styles.citaContainer}>
            <Text style={styles.subtitle}>Cita:</Text>
            <Text style={styles.text}>Nombre del paciente: {cita.nombre_usuario_web} {cita.apellido_usuario_web}</Text>
            <Text style={styles.text}>Tipo: {cita.Tipo_Web}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(cita.lugar)}>
              <Text style={[styles.text, styles.locationLink]}>Lugar de la cita</Text>
            </TouchableOpacity>
            <Text style={styles.text}>Hora de inicio: {cita.hora_inicio}</Text>
            <Text style={styles.text}>Hora de fin: {cita.hora_final}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#666',
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
    fontStyle: 'italic',
    color: '#666',
  },
  citaContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#f4f4f4',
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#444',
  },
  locationLink: {
    textDecorationLine: 'underline',
    color: 'blue',
  },
});

export default DetallesCita;
