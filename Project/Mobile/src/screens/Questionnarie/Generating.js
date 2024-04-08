import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';
import config from "../../utils/conf";


const GeneratingScreen = ({ route, navigation }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Enviando datos...");
  const oid = route.params.oid;

  useEffect(() => {
    // Actualiza el progreso basado en route.params.progress
    if (route.params?.progress) {
      setProgress(route.params.progress);
    }
  }, [route.params?.progress]);

  
  useEffect(() => {
    const handleCompletion = async () => {
      setMessage("Datos enviados correctamente. Generando rutina...");

      // Aquí se llama a la API para crear la rutina personalizada
      try {
        await createPersonalizedRoutine(oid);
        setMessage("Rutina personalizada creada con éxito.");
        
        // Navegación después de un breve retraso para mostrar el mensaje de éxito
        setTimeout(() => {
          navigation.navigate('Main', {screen: "MainMenu",
          params: { oid: oid }, });
        }, 2000); // Ajusta este tiempo según lo necesario
      } catch (error) {
        console.error('Error al crear la rutina personalizada:', error);
        // Maneja el error, posiblemente actualizando el estado para mostrar un mensaje de error
        setMessage("Error al crear la rutina personalizada.");
      }
    };

    if (progress === 1) {
      handleCompletion();
    }
  }, [progress, navigation, oid]);


 const createPersonalizedRoutine = async (oid) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/rutinapersonalizada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ID_Usuario: oid }),
      });
      const data = await response.json();
      return data; // Retorna la respuesta del servidor, asumiendo éxito
    } catch (error) {
      console.error('Error creating personalized routine:', error);
      throw error; // Propaga el error para manejarlo en el componente
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Progress.Circle size={200} progress={progress} showsText={true} />
      <Text style={styles.Text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Text: {
    fontSize: 28,
    marginTop: 40,
  },
});

export default GeneratingScreen;
