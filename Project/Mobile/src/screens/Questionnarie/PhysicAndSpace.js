import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import * as Progress from "react-native-progress";
import { AntDesign } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../utils/conf";

const PhysicAndSpace = ({ navigation, route }) => {
  const [oid, setOid] = useState(route.params?.oid || "");
  const [trainingTime, setTrainingTime] = useState(route.params?.trainingTime || "");
  const [preferredDays, setPreferredDays] = useState(route.params?.preferredDays || []);
  const [selectedMuscles, setSelectedMuscles] = useState(route.params?.selectedMuscles || []);
  const [trainingGoal, setTrainingGoal] = useState(route.params?.trainingGoal || "");
  const [injuryAreas, setInjuryAreas] = useState(route.params?.injuryAreas || []);
  const [focusedBodyPart, setFocusedBodyPart] = useState(route.params?.focusedBodyPart || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [weeksToChangeRoutine, setWeeksToChangeRoutine] = useState('4');

  const validateWeeks = (value) => {
    const numericValue = parseInt(value, 10);
    if (numericValue < 4 || numericValue > 52) {
      Alert.alert("Error", "El número de semanas debe ser entre 4 y 52.");
      return false;
    }
    return true;
  };

  const handleIncrementWeeks = () => {
    const newWeeks = parseInt(weeksToChangeRoutine, 10) + 1;
    if (validateWeeks(newWeeks)) {
      setWeeksToChangeRoutine(String(newWeeks));
    }
  };

  const handleDecrementWeeks = () => {
    const currentWeeks = parseInt(weeksToChangeRoutine, 10);
    const newWeeks = currentWeeks - 1;
    if (newWeeks < 4) {
        Alert.alert("Error", "El número de semanas no puede ser menor que 4.");
    } else {
        setWeeksToChangeRoutine(String(newWeeks));
    }
};


  const handleChangeWeeksText = (text) => {
    if (text) {
      setWeeksToChangeRoutine(text.replace(/[^0-9]/g, ''));
    } else {
      setWeeksToChangeRoutine('4');
    }
  };

  const handleEndEditing = () => {
    if (validateWeeks(weeksToChangeRoutine)) {
      const numericValue = Math.max(4, Math.min(parseInt(weeksToChangeRoutine, 10), 52));
      setWeeksToChangeRoutine(String(numericValue));
    } else {
      setWeeksToChangeRoutine('4'); // Restablece al valor mínimo si la validación falla
    }
  };

  console.log(
    "Datos pasados:",
    oid,
    trainingTime,
    preferredDays,
    selectedMuscles,
    trainingGoal,
    injuryAreas,
    focusedBodyPart
  );
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [trainingLocation, setTrainingLocation] = useState("");
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [availableMaterials, setAvailableMaterials] = useState([]); 

  const fitnessLevels = [
    { value: 1, label: "Alto" },
    { value: 2, label: "Medio" },
    { value: 3, label: "Bajo" },
  ];

  const saveData = async () => {
    const userData = {
      oid: oid,
      trainingTime: trainingTime,
      preferredDays: preferredDays,
      selectedMuscles: selectedMuscles,
      trainingGoal: trainingGoal,
      injuryAreas: injuryAreas,
      focusedBodyPart: focusedBodyPart,
    };
    
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving data", error);
    }
  };

  const loadCuestionarioData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/cues/${route.params.oid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();

      if (data) {
        // Configura el nivel de condición física
        setFitnessLevel(data.cuestionario.ID_NivelFormaFisica);

        // Configura el espacio disponible
        const espacioDisponible = {
          1: "Gimnasio",
          2: "Casa",
          3: "Calistenia"
        };
        setTrainingLocation(espacioDisponible[data.cuestionario.ID_EspacioDisponible]);
      }
    } catch (error) {
      console.log("Error al cargar los datos del cuestionario:", error);
    }
};

// Añade useEffect para cargar los datos cuando el componente se monta
useEffect(() => {
  loadCuestionarioData();
}, []);
  

  useEffect(() => {
    // Hacer la solicitud para obtener los materiales disponibles si la ubicación es 'Casa'
    if (trainingLocation === "Casa") {
      fetchMaterials(); // Función para obtener los materiales disponibles
    }
  }, [trainingLocation]);

  const fetchMaterials = async () => {
    try {
      const materialsResponse = await fetch(
        `${config.apiBaseUrl}/materials`,
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

  const loadData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        
        setOid(userData.oid);
        setTrainingTime(userData.trainingTime);
        setPreferredDays(userData.preferredDays);
        setSelectedMuscles(userData.selectedMuscles);
        setTrainingGoal(userData.trainingGoal);
        setInjuryAreas(userData.injuryAreas);
        setFocusedBodyPart(userData.focusedBodyPart);
      }
    } catch (error) {
      console.error("Error loading data", error);
    }
  };
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          
          setOid(userData.oid || "");
          setTrainingTime(userData.trainingTime || "");
          setPreferredDays(userData.preferredDays || []);
          setSelectedMuscles(userData.selectedMuscles || []);
          setTrainingGoal(userData.trainingGoal || "");
          setInjuryAreas(userData.injuryAreas || []);
          setFocusedBodyPart(userData.focusedBodyPart || "");
        }
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    loadData();
  }, []);

  const handleContinue = async () => {
    if (!fitnessLevel) {
      setErrorMessage("Por favor, selecciona tu nivel de condición física.");
      return;
    } else if (!trainingLocation) {
      setErrorMessage("Por favor, selecciona dónde entrenas.");
      return;
    } else {
      setErrorMessage(""); }// Limpiar el mensaje de error si pasa las validaciones
    if (trainingLocation === "Casa") {
      // Navegar a la nueva pantalla de selección de materiales
      navigation.navigate('Materials', {
          oid: oid,
          trainingTime: trainingTime,
          preferredDays: preferredDays,
          selectedMuscles: selectedMuscles,
          trainingGoal: trainingGoal,
          injuryAreas: injuryAreas,
          focusedBodyPart: focusedBodyPart,
          fitnessLevel: fitnessLevel,
          trainingLocation: trainingLocation,
          semanas: weeksToChangeRoutine,
          selectedMaterials: selectedMaterials,
          onMaterialSelection: toggleMaterialSelection,
          onContinue: handleContinue,    
      });
    } else {
      try {
        navigation.navigate("Questionnaire", {
          screen: "Generating",
          params: { oid: oid, progress: 0.1 },
        });
        setTimeout(async () => {
        const response = await fetch(`${config.apiBaseUrl}/cues`, {
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
            semanas: weeksToChangeRoutine,
            trainingLocation: trainingLocation,
            selectedMaterials: selectedMaterials,
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
    }
  };

  const handleKnowLevel = () => {
    saveData();
    navigation.navigate("PhysicalTest");
  };

  const handleFitnessLevelSelection = (level) => {
    setFitnessLevel(level);
  };

  const handleTrainingLocationSelection = (location) => {
    setTrainingLocation(location);
    if (location !== "Casa") {
      setAvailableMaterials([]);
    }
  };

  const toggleMaterialSelection = (material) => {
    // Revisa si el material ya está seleccionado
    const isSelected = selectedMaterials.includes(material);

    // Si está seleccionado, quítalo de la lista; de lo contrario, agrégalo
    const updatedMaterials = isSelected
      ? selectedMaterials.filter((item) => item !== material)
      : [...selectedMaterials, material];

    setSelectedMaterials(updatedMaterials);
  };
  return (
<ScrollView style={{ flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20, }}>
      <View style={styles.progress}>
        <Progress.Bar progress={0.8} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>4 de 5</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black"  />
      </TouchableOpacity>
    <Text style={styles.indicaciones}>Selecciona tu nivel de condición física:</Text>
    <View style={{ flexDirection: "column", marginTop: 20 }}>
      {fitnessLevels.map((level) => (
        <TouchableOpacity
          key={level.value}
          style={{
            marginVertical: 10,
            padding: 20, // Aumenta el padding para hacer los contenedores más grandes
            borderRadius: 10,
            backgroundColor: fitnessLevel === level.value ? "#0790cf" : "#eaeaea",
          }}
          onPress={() => handleFitnessLevelSelection(level.value)}
        >
          <Text style={{  fontSize: 20, color: fitnessLevel === level.value ? "white" : "black" }}>
            {level.label}
          </Text>
          <Text style={{ color: fitnessLevel === level.value ? "white" : "black", fontSize: 15 }}>
            {level.value === 1 ? "Soy la roca en persona" : level.value === 2 ? "Hago ejercicio regularmente" : "Realizo nada o muy poco ejercicio"}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={{ marginTop: 20 }}>
      <TouchableOpacity onPress={handleKnowLevel}>
        <Text style={styles.linkText}>
          ¿Quieres conocer tu nivel de forma física?
        </Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.indicaciones}>¿Dónde entrenas?</Text>
    <View style={{ flexDirection: "column", marginTop: 20 }}>
      <TouchableOpacity
        style={{
          marginVertical: 10,
          padding: 20, 
          borderRadius: 10,
          backgroundColor: trainingLocation === "Gimnasio" ? "#0790cf" : "#eaeaea",
        }}
        onPress={() => handleTrainingLocationSelection("Gimnasio")}
      >
        <Text style={{fontSize: 20, color: trainingLocation === "Gimnasio" ? "white" : "black" }}>Gimnasio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginVertical: 10,
          padding: 20, 
          borderRadius: 10,
          backgroundColor: trainingLocation === "Casa" ? "#0790cf" : "#eaeaea",
        }}
        onPress={() => handleTrainingLocationSelection("Casa")}
      >
        <Text style={{fontSize: 20, color: trainingLocation === "Casa" ? "white" : "black" }}>Casa</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          marginVertical: 10,
          padding: 20, 
          borderRadius: 10,
          backgroundColor: trainingLocation === "Calistenia" ? "#0790cf" : "#eaeaea",
        }}
        onPress={() => handleTrainingLocationSelection("Calistenia")}
      >
        <Text style={{fontSize: 20, color: trainingLocation === "Calistenia" ? "white" : "black" }}>Calistenia</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.indicaciones}>¿Cada cuántas semanas deseas cambiar la rutina?</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity onPress={handleDecrementWeeks} style={styles.selectorButton}>
          <AntDesign name="minus" size={34} color="black" />
        </TouchableOpacity>
        <Text style={styles.countText}>{weeksToChangeRoutine}</Text> 
        <TouchableOpacity onPress={handleIncrementWeeks} style={styles.selectorButton}>
          <AntDesign name="plus" size={34} color="black" />
        </TouchableOpacity>
      </View>
    {trainingLocation === "Casa" && availableMaterials && (
      <View style={{ marginTop: 20 }}>
        {/* <Text>Materiales disponibles:</Text> */}
        {/* <View style={{ marginTop: 10 }}>
          {availableMaterials.map((material, index) => (
            <TouchableOpacity
              key={index}
              style={{
                marginVertical: 10,
                padding: 20, // Aumenta el padding para hacer los contenedores más grandes
                borderRadius: 10,
                backgroundColor: selectedMaterials.includes(material.equipo)
                  ? "blue"
                  : "#eaeaea",
              }}
              onPress={() => toggleMaterialSelection(material.equipo)}
            >
              <Text style={{ color: selectedMaterials.includes(material.equipo) ? "white" : "black" }}>
                {material.equipo}
              </Text>
            </TouchableOpacity>
          ))}
        </View> */}
      </View>
    )}
    {errorMessage !== "" && (
  <Text style={styles.errorText}>{errorMessage}</Text>
)}
  </ScrollView>
  );
};

const styles = {
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginHorizontal: 20,
    fontSize: 18,
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
    marginBottom: 20,
  },
  arrowContainer: {
    position: "absolute",
    top: 85,
    right: 20,
  },
  indicaciones:{
    fontSize: 20,
    textAlign: "center",
    marginTop: 25,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },  
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 120,
  },
  selectorButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    marginHorizontal: 20,
    fontSize: 24,
    textAlign: 'center',
    padding: 10,
  },
};

export default PhysicAndSpace;
