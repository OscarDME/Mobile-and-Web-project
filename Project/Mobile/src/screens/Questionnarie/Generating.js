import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress';

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
    // Verifica si el progreso ha alcanzado el 100%
    if (progress === 1) {
      setMessage("Datos enviados correctamente");

      // Establece un temporizador para navegar a otra pantalla después de un retraso
      const timer = setTimeout(() => {
        navigation.navigate('Main', {screen: "MainMenu",
        params: { oid: oid }, }); // Reemplaza 'NextScreenName' con el nombre real de tu siguiente pantalla
      }, 2000); // Cambia 2000 a la cantidad de milisegundos de retraso deseada

      // Limpia el temporizador si la pantalla se desmonta antes de que se ejecute
      return () => clearTimeout(timer);
    }
  }, [progress, navigation]);

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
