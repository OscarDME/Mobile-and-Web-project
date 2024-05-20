import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import config from "../../utils/conf";

const macronutrientesMap = {
  1: 'Grasas',
  2: 'Carbohidratos',
  3: 'Proteínas',
};

const DetallesAlimentoReceta = ({ route }) => {
  const { itemId } = route.params;
  const [itemDetails, setItemDetails] = useState(null);

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const fetchItemDetails = async () => {
    try {
      if (!itemId) {
        console.error("Error: itemId no fue proporcionado.");
        return;
      }
      console.log("itemId:", itemId);
      let response;
      if (itemId.startsWith('R')) {
        response = await fetch(`${config.apiBaseUrl}/receta/${itemId.slice(1)}`);
      } else {
        response = await fetch(`${config.apiBaseUrl}/alimento/${itemId.slice(1)}`);
      }
      const data = await response.json();
      console.log("Datos:", data[0]);
      setItemDetails(data[0]);
    } catch (error) {
      console.error("Error al obtener los detalles del alimento/receta:", error);
    }
  };

  if (!itemDetails) {
    return <Text style={styles.loadingText}>Cargando...</Text>;
  }

  const getMacronutrienteName = (macro) => {
    if (macro.hasOwnProperty('macronutriente')) {
      return macro.macronutriente;
    } else {
      return macronutrientesMap[macro.ID_Macronutriente];
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{itemDetails.nombre || itemDetails.receta}</Text>
      <Text style={styles.calories}>{itemDetails.calorias} calorías</Text>
      {itemDetails.peso && (
        <Text style={styles.ingredient}>Peso: {itemDetails.peso}g</Text>
      )}
      {itemDetails.categoria && (
        <Text style={styles.ingredient}>Categoría: {itemDetails.categoria}</Text>
      )}
      {itemDetails.ingredientes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredientes:</Text>
          {itemDetails.ingredientes.map((ingrediente, index) => (
            <Text key={index} style={styles.ingredient}>{ingrediente.porcion}g de {ingrediente.nombre}</Text>
          ))}
        </View>
      )}
      {itemDetails.macronutrientes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrientes:</Text>
          {itemDetails.macronutrientes.map((macro, index) => (
            <Text key={index} style={styles.macronutrient}>{getMacronutrienteName(macro)}: {macro.cantidad}g</Text>
          ))}
        </View>
      )}
      {itemDetails.clasificaciones && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clasificaciones:</Text>
          {itemDetails.clasificaciones.map((clasificacion, index) => (
            <Text key={index} style={styles.clasificacion}>{clasificacion}</Text>
          ))}
        </View>
      )}
      {itemDetails.preparacion && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preparación:</Text>
          <Text style={styles.preparacion}>{itemDetails.preparacion}</Text>
        </View>
      )}
      {itemDetails.link && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enlace:</Text>
          <Text style={styles.link}>{itemDetails.link}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  calories: {
    fontSize: 24,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  ingredient: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  macronutrient: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  clasificacion: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  preparacion: {
    fontSize: 20,
    textAlign: 'center',
  },
  link: {
    fontSize: 20,
    color: 'blue',
    textAlign: 'center',
  },
});

export default DetallesAlimentoReceta;