// ExerciseDetailScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import config from "../../utils/conf";

const ExerciseDetailScreen = ({ route, navigation }) => { 
  const { exercise } = route.params;
  const [alternatives, setAlternatives] = useState([]);

  useEffect(() => {
    fetchAlternatives(exercise.ID_Musculo); // Asume que exercise tiene una propiedad ID_Musculo
  }, [exercise]);

  const fetchAlternatives = async (ID_Musculo) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/alternativas/${exercise.Musculo}`);
      const data = await response.json();
      setAlternatives(data);
    } catch (error) {
      console.error("Error al obtener ejercicios alternativos:", error);
    }
  };
  // Función para navegar hacia el detalle de un ejercicio alternativo
  const navigateToAlternativeDetail = (alternativeExercise) => {
    navigation.push('Detalles', { exercise: alternativeExercise });
  };

  const musculosSecundarios = exercise.musculosSecundarios?.map(musculo => musculo.descripcion).join(", ") || "Ninguno";

  const details = [
    { label: "Tipo", value: exercise.Tipo_Ejercicio },
    { label: "Modalidad", value: exercise.Modalidad },
    exercise.ID_Modalidad === 3 ? null : { label: "Músculo principal", value: exercise.Musculo },
    exercise.ID_Modalidad === 3 ? null : { label: "Músculos secundarios", value: musculosSecundarios },
    { label: "Material", value: exercise.Equipo || "Ninguno" },
  ].filter(detail => detail !== null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{exercise.ejercicio}</Text>
      <View style={styles.detailContainer}>
      {details.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{item.label}:</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
        
        <Text style={styles.subTitle}>Preparación:</Text>
        <Text style={styles.paragraph}>{exercise.preparacion}</Text>
        
        <Text style={styles.subTitle}>Ejecución:</Text>
        <Text style={styles.paragraph}>{exercise.ejecucion}</Text>
        
        <Text style={styles.subTitle}>Alternativas:</Text>
        {alternatives.map((alternative, index) => (
          <TouchableOpacity key={index} style={styles.alternativeItem} onPress={() => navigateToAlternativeDetail(alternative)}>
            <Text style={styles.alternativeTitle}>{alternative.ejercicio}</Text>
            <Text style={styles.exerciseCategory}>{exercise.Musculo}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    padding: 10,
  },
  detailContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    borderBottomColor: "#E0E0E0",
    marginVertical: 8, // Ajustado para controlar el espacio vertical
  },
  label: {
    fontWeight: "bold",
    width: "50%", // Ajusta el ancho para controlar la separación
    
  },
  value: {
    flexShrink: 1,
    textAlign: "left", // Ajusta según necesidad
    width: "60%", // Ajusta el ancho para controlar la separación
    paddingVertical: 3,
  },
  subTitle: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  paragraph: {
    marginBottom: 10,
    fontSize: 16,
  },
  alternativeItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  alternativeTitle: {
    fontSize: 16,
    color: '#333',
  },
  exerciseCategory: {
    fontSize: 15,
    marginTop: 5,
    color: "#666",
  },
});

export default ExerciseDetailScreen;
