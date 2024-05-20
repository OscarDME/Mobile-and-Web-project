import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import Dropdown from "../../components/DropdownCollections";
import CheckboxList from "../../components/CheckBoxCollections";
import RadioList from "../../components/RadioList";
import config from "../../utils/conf";

export default function Exercises_management_add({ navigation }) {
  const [exerciseName, setExerciseName] = useState("");
  const [affectedInjury, setAffectedInjury] = useState(null);
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [primaryMuscle, setPrimaryMuscle] = useState(null);
  const [exerciseType, setExerciseType] = useState(null);
  const [materialNeeded, setMaterialNeeded] = useState(null);
  const [exercisePreparation, setExercisePreparation] = useState("");
  const [exerciseIndications, setExerciseIndications] = useState("");
  const [exerciseDificulty, setExerciseDificulty] = useState(null);
  const [selectedModalidad, setSelectedModalidad] = useState(null);

  const lesiones = [
    { label: "Hombro", value: 1 },
    { label: "Lumbar", value: 2 },
    { label: "Rodilla", value: 3 },
    { label: "Tobillo", value: 4 },
  ];

  const options = [
    { label: "Baja", value: 1 },
    { label: "Media", value: 2 },
    { label: "Alta", value: 3 },
  ];

  const exercises = [
    { label: "Cardiovascular", value: 1 },
    { label: "Peso corporal", value: 3 },
    { label: "Pesas", value: 2 },
  ];

  const materials = [
    { label: "Mancuerna", value: 1 },
    { label: "Ligas Resistencia", value: 2 },
    { label: "Soga", value: 3 },
    { label: "Pelota de Yoga", value: 4 },
    { label: "Tapete", value: 5 },
    { label: "Barra", value: 6 },
    { label: "Maquina", value: 7 },
    { label: "Polea", value: 8 },
  ];

  const muscles = [
    { label: "Pecho", value: 1 },
    { label: "Espalda", value: 2 },
    { label: "Hombro", value: 3 },
    { label: "Bicep", value: 4 },
    { label: "Tricep", value: 5 },
    { label: "Cuadricep", value: 6 },
    { label: "Femoral", value: 7 },
    { label: "Gluteo", value: 8 },
    { label: "Pantorrilla", value: 9 },
  ];

  const modalidad = [
    { label: "Peso Corporal", value: 1 },
    { label: "Pesas", value: 2 },
    { label: "Cardiovascular", value: 3 },
  ];

  const types = [
    { label: "Compuesto", value: 1 },
    { label: "Auxiliar", value: 2 },
    { label: "Aislamiento", value: 3 },
    { label: "Funcional", value: 4 },
  ];

  const handlePrimaryMuscleChange = (selectedOption) =>
    setPrimaryMuscle(selectedOption ? selectedOption.value : null);

  const handleExerciseNameChange = (text) => setExerciseName(text);

  const handleAffectedInjuryChange = (selectedOption) =>
    setAffectedInjury(selectedOption ? selectedOption.value : null);

  const handleAffectedDificultyChange = (selectedOption) =>
    setExerciseDificulty(selectedOption ? selectedOption.value : null);

  const handleExerciseTypeChange = (selectedOption) => {
    setMaterialNeeded([]);
    setExerciseType(selectedOption ? selectedOption.value : null);
  };

  const handleExerciseIndicationsChange = (text) =>
    setExerciseIndications(text);

  const handleExercisePreparationChange = (text) =>
    setExercisePreparation(text);

  const handleSelectedMusclesChange = (selectedValues) => {
    setSelectedMuscles(selectedValues);
  };

  const handleModalidadChange = (selectedOption) =>
    setSelectedModalidad(selectedOption ? selectedOption.value : null);

  const handleMaterialNeededChange = (selectedOption) => {
    setMaterialNeeded(selectedOption);
  };

  const esModalidadPesas = selectedModalidad === 2;
  const isCardio = selectedModalidad === 3;

  const handleSubmit = async () => {
    const regex = /^[\p{L}\p{N} _.,'"-]+$/u;

    if (exerciseName.length > 50 || !regex.test(exerciseName)) {
      Alert.alert(
        "Error",
        "El nombre del ejercicio contiene caracteres no permitidos o es demasiado largo. Debe tener 50 caracteres o menos y solo puede contener letras, números, espacios, guiones y guiones bajos."
      );
      return;
    }

    if (exercisePreparation.length > 500 || !regex.test(exercisePreparation)) {
      Alert.alert(
        "Error",
        "Las indicaciones de preparación contienen caracteres no permitidos o son demasiado largas. Deben tener 500 caracteres o menos y solo pueden contener letras, números, espacios, guiones, guiones bajos, puntos y comas."
      );
      return;
    }

    if (exerciseIndications.length > 400 || !regex.test(exerciseIndications)) {
      Alert.alert(
        "Error",
        "Las indicaciones de ejecución contienen caracteres no permitidos o son demasiado largas. Deben tener 500 caracteres o menos y solo pueden contener letras, números, espacios, guiones, guiones bajos, puntos y comas."
      );
      return;
    }

    const finalPrimaryMuscle = isCardio ? null : primaryMuscle;
    const finalSelectedMuscles = isCardio ? [] : selectedMuscles;

    if (
      !exerciseName.trim() ||
      !exercisePreparation.trim() ||
      !exerciseIndications.trim() ||
      exerciseDificulty === null ||
      (esModalidadPesas &&
        (materialNeeded === null || materialNeeded.length === 0)) ||
      (!isCardio && selectedMuscles.length === 0) ||
      (!isCardio && affectedInjury === null)
    ) {
      Alert.alert("Error", "Por favor completa todos los campos obligatorios.");
      return;
    }

    const exerciseData = {
      ejercicio: exerciseName,
      preparacion: exercisePreparation,
      ejecucion: exerciseIndications,
      ID_Musculo: finalPrimaryMuscle,
      ID_Lesion: affectedInjury,
      ID_Tipo_Ejercicio: exerciseType,
      ID_Dificultad: exerciseDificulty,
      ID_Equipo: materialNeeded,
      ID_Modalidad: selectedModalidad,
      musculosSecundarios: finalSelectedMuscles,
    };

    console.log(exerciseData);

    try {
      const response = await fetch(`${config.apiBaseUrl}/exerciserequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(exerciseData),
      });

      if (!response.ok) {
        throw new Error("Algo salió mal al guardar el ejercicio.");
      }

      const result = await response.json();
      console.log(result);
      Alert.alert("Éxito", "Ejercicio añadido con éxito.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al guardar el ejercicio:", error);
      Alert.alert("Error", "Error al guardar el ejercicio.");
    }

    console.log("Guardando ejercicio:", {
      exerciseName,
      affectedInjury,
      selectedMuscles,
      exerciseType,
      materialNeeded,
      exercisePreparation,
      exerciseIndications,
      exerciseDificulty,
    });

    onBackToList();
  };

  const findOptionByValue = (optionsArray, value) =>
    optionsArray.find((option) => option.value === value) || null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Solicitar un nuevo ejercicio</Text>
      </View>
      <ScrollView style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>¿Cuál es el nombre del ejercicio?</Text>
          <TextInput
            style={styles.input}
            value={exerciseName}
            onChangeText={handleExerciseNameChange}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>¿Afecta a alguna lesión?</Text>
          <Dropdown
            options={lesiones}
            selectedOption={findOptionByValue(lesiones, affectedInjury)}
            onChange={handleAffectedInjuryChange}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>¿Cuál es la dificultad del ejercicio?</Text>
          <Dropdown
            options={options}
            selectedOption={findOptionByValue(options, exerciseDificulty)}
            onChange={handleAffectedDificultyChange}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Indicaciones de preparación:</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={exercisePreparation}
            onChangeText={handleExercisePreparationChange}
            multiline
          />
        </View>
        {selectedModalidad !== 3 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              ¿Cuál es el músculo principal trabajado?
            </Text>
            <Dropdown
              options={muscles}
              selectedOption={findOptionByValue(muscles, primaryMuscle)}
              onChange={handlePrimaryMuscleChange}
            />
          </View>
        )}
        {selectedModalidad !== 3 && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>¿Qué músculos secundarios trabaja?</Text>
            <CheckboxList
              options={muscles}
              selectedOptions={selectedMuscles}
              onChange={handleSelectedMusclesChange}
              idPrefix="muscles"
            />
          </View>
        )}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Indicaciones de ejecución:</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={exerciseIndications}
            onChangeText={handleExerciseIndicationsChange}
            multiline
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>¿Qué tipo de ejercicio es?</Text>
          <Dropdown
            options={types}
            selectedOption={findOptionByValue(types, exerciseType)}
            onChange={handleExerciseTypeChange}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>¿Cuál es la modalidad del ejercicio?</Text>
          <Dropdown
            options={modalidad}
            selectedOption={findOptionByValue(modalidad, selectedModalidad)}
            onChange={handleModalidadChange}
          />
        </View>
        {esModalidadPesas && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              ¿Qué material necesita el ejercicio?
            </Text>
            <RadioList
              options={materials}
              selectedOption={materialNeeded}
              onChange={setMaterialNeeded}
              idPrefix="material"
            />
          </View>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Añadir ejercicio</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});