import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import * as Progress from "react-native-progress";
import { AntDesign } from '@expo/vector-icons'; // Asegúrate de tener instalado '@expo/vector-icons'

const MaterialSelectionScreen = ({ navigation, route }) => {
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]);
  const oid = route.params.oid;
  const trainingTime = route.params.trainingTime;
  const preferredDays = route.params.preferredDays;
  const selectedMuscles = route.params?.selectedMuscles;
  const trainingGoal = route.params.trainingGoal;
  const injuryAreas = route.params.injuryAreas;
  const focusedBodyPart = route.params.focusedBodyPart;
  const trainingLocation = route.params.trainingLocation;
  const fitnessLevel = route.params.fitnessLevel;

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      const materialsResponse = await fetch(
        "http://192.168.100.5:3001/api/materials",
        {
          method: "GET",
        }
      );
      if (materialsResponse.ok) {
        const materials = await materialsResponse.json();
        console.log(materials);
        setAvailableMaterials(materials);
      } else {
        console.log("Error al obtener los materiales");
      }
    } catch (error) {
      console.error("Error al obtener los materiales:", error);
    }
  };

  const toggleMaterialSelection = (material) => {
    const isSelected = selectedMaterials.includes(material);
    const updatedMaterials = isSelected
      ? selectedMaterials.filter((item) => item !== material)
      : [...selectedMaterials, material];
    setSelectedMaterials(updatedMaterials);
  };

  const handleContinue = async () => {
    try {
      navigation.navigate("Questionnaire", {
        screen: "Generating",
        params: { oid: oid, progress: 0.1 },
      });
      setTimeout(async () => {
        const response = await fetch("http://192.168.100.5:3001/api/cues", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oid: oid,
            trainingTime: trainingTime,
            preferredDays: preferredDays,
            selectedMuscles: selectedMuscles,
            trainingGoal: trainingGoal,
            injuryAreas: injuryAreas,
            focusedBodyPart: focusedBodyPart,
            fitnessLevel: fitnessLevel,
            trainingLocation: trainingLocation,
            selectedMaterials: selectedMaterials,
            // Agrega todos los datos que deseas enviar
          }),
        });
  
        if (response.ok) {
          console.log("Datos enviados exitosamente a la base de datos");
          navigation.navigate("Questionnaire", {
            screen: "Generating",
            params: { oid: oid, progress: 1 }, 
          });
        } else {
          console.log("Error al enviar los datos a la base de datos");
        }
       }, 2000); // Retraso simulado para demostrar la actualización del progreso
      } catch (error) {
        console.error("Error al realizar la solicitud POST:", error);
      }
  };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
    <View style={styles.progress}>
        <Progress.Bar progress={1} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>5 de 5</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black"  />
      </TouchableOpacity>
      <Text style={{ fontSize: 22, marginBottom: 30, textAlign: "center" }}>
        Selecciona los materiales que tengas disponibles:
      </Text>
      <View style={{ flexWrap: "wrap", flexDirection: "column" }}>
        {availableMaterials.map((material, index) => (
          <TouchableOpacity
            key={index}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              margin: 7,
              width: "98%",
              borderRadius: 8,
              backgroundColor: selectedMaterials.includes(material.equipo)
                ? "#0790cf"
                : "#eaeaea",
            }}
            onPress={() => toggleMaterialSelection(material.equipo)}
          >
            <Text
              style={{
                fontSize: 20,
                color: selectedMaterials.includes(material.equipo)
                  ? "white"
                  : "black",
              }}
            >
              {material.equipo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = {
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    progress: {
      width: "100%",
      zIndex: -1,
      paddingTop: 25,
    },
    pageText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 40,
    },
    arrowContainer: {
      position: "absolute",
      top: 85,
      right: 20,
    },
  };

export default MaterialSelectionScreen;
