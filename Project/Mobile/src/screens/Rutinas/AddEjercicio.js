import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Asegúrate de instalar expo-vector-icons
import config from "../../utils/conf";

const ExerciseDayScreen = ({ navigation, route }) => {
  // Asumiendo que se pasa el día como un parámetro de la ruta
  const { day } = route.params.day;
  const  ID_Dia  = route.params.dayID;
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false); 

  console.log(ID_Dia);

  useEffect(() => {
    fetchExercisesForDay();
  }, [ID_Dia]);



  const fetchExercisesForDay = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/ejerciciosdia/${ID_Dia}`);
      if (response.ok) {
        const ejercicios = await response.json();
        const formattedExercises = ejercicios.map((ejercicio) => {
          console.log(ejercicio);
          return {
            ...ejercicio,
            restTime: ejercicio.descanso.toString(),
            isSuperset: ejercicio.superset,
          };
        });
        setExercises(formattedExercises);
        setIsSaved(formattedExercises.length > 0);
      } else {
        console.log('No se encontraron ejercicios para este día');
      }
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    }
  };
  
  // Función auxiliar para convertir el tiempo de descanso a segundos
  const convertirDescansoASegundos = (descanso) => {
    const [horas, minutos, segundos] = descanso.split(':').map(parseFloat);
    return horas * 3600 + minutos * 60 + segundos;
  };
  
  const [exercises, setExercises] = useState([]);

  const handlePressExercise = (ID_Ejercicio) => {
    // Encuentra el ejercicio seleccionado basado en el ID_Ejercicio
    const selectedExercise = exercises.find(exercise => exercise.ID_Ejercicio === ID_Ejercicio);
  
    if (selectedExercise) {
      // Navega a AddSetsScreen, pasando ID_EjerciciosDia del ejercicio seleccionado como parámetro
      navigation.navigate("AddSets", { ID_EjerciciosDia: selectedExercise.ID_EjerciciosDia });
    } else {
      console.error("Ejercicio no encontrado");
    }
  };
  

  const addExercise = () => {
    // Navegar a ExerciseLibrary, pasando un callback para añadir un ejercicio
    navigation.navigate("Ejercicios", { onAddExercise: addExerciseToList });
  };

  const addExerciseToList = (exerciseToAdd) => {
    const alreadyExists = exercises.some(exercise => exercise.ID_Ejercicio === exerciseToAdd.ID_Ejercicio);
    if (alreadyExists) {
      alert('Este ejercicio ya ha sido agregado.');
      return;
    }    // Incluye las nuevas propiedades isSuperset y restTime
    setExercises([
      ...exercises,
      { ...exerciseToAdd, isSuperset: false, restTime: "0" },
    ]);
  };

  const deleteExercise = (id) => {
    // Filtra los ejercicios para eliminar el que coincide con el ID proporcionado
    const updatedExercises = exercises.filter(exercise => exercise.ID_Ejercicio !== id);
    setExercises(updatedExercises); // Actualiza el estado con el nuevo arreglo de ejercicios
  };
  

  const toggleSuperset = (index) => {
    const newExercises = [...exercises];
    newExercises[index].isSuperset = !newExercises[index].isSuperset;
    setExercises(newExercises);
  };

  const setRestTime = (text, index) => {
    const newExercises = [...exercises];
    newExercises[index].restTime = text;
    setExercises(newExercises);
  };

  const formatRestTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `00:${formattedMinutes}:${formattedSeconds}`;
  };
  

  const saveExercises = async () => {
    if (exercises.length === 0) {
      setErrorMessage('Por favor, añade al menos un ejercicio antes de guardar.');
      return; // Detiene la ejecución de la función aquí
    }

  const allExercisesHaveRestTime = exercises.every(exercise => exercise.restTime && exercise.restTime.trim() !== '0');

  if (!allExercisesHaveRestTime) {
    setErrorMessage('Por favor, agrega un tiempo de descanso a todos los ejercicios.');
    return;
  }

  setErrorMessage(''); // Limpia el mensaje de error si pasa la validación.

    try {
      const formattedExercises = exercises.map(exercise => ({
        ...exercise,
        restTime: formatRestTime(parseInt(exercise.restTime)),
      }));  
      console.log("Ejercicios a guardar:", exercises);
      console.log("ID_Dia:", ID_Dia);
      const dataToSend = {
        ejercicios: formattedExercises,
        ID_Dia: ID_Dia,
      };

      let url;
      let method;
  
      // Verificar si los ejercicios ya han sido guardados
      if (isSaved) {
        // Si ya están guardados, usar URL y método para actualizar
        url = `${config.apiBaseUrl}/rutinaejercicios`; // Ejemplo de URL de actualización
        method = "PUT"; // Método HTTP para actualizaciones
      } else {
        // Si no están guardados, usar URL y método para crear
        url = `${config.apiBaseUrl}/rutinaejercicios`;
        method = "POST";
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        console.log("Guardado con éxito:", jsonResponse);
        navigation.goBack();
        // Manejo adicional si es necesario
      } else {
        throw new Error("No se pudo guardar los ejercicios");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{day}</Text>
        <TouchableOpacity onPress={saveExercises}>
          <Text style={styles.saveButton}>Guardar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Ejercicios</Text>
      <FlatList
  data={exercises}
  keyExtractor={(item) => item.ID_Ejercicio.toString()}
  renderItem={({ item, index }) => (
    <View style={styles.exerciseItem}>
      <TouchableOpacity
        onPress={() => handlePressExercise(item.ID_Ejercicio)}
        style={{ flex: 1 }}
      >
        <Text style={styles.exerciseName}>{item.ejercicio}</Text>
        <View style={styles.checkboxContainer}>
          <Text style={styles.supersetQuestion}>¿Es superset?</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleSuperset(index)}
          >
            <Ionicons
              name={item.isSuperset ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={item.isSuperset ? "green" : "grey"}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRestTime(text, index)}
            value={item.restTime}
            placeholder="Descanso (seg)"
            keyboardType="numeric"
          />
        </View>
      </TouchableOpacity>
      {/* Botón de eliminar */}
      <TouchableOpacity onPress={() => deleteExercise(item.ID_Ejercicio)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  )}
/>
{
  errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>
}
      <TouchableOpacity style={styles.addButton} onPress={addExercise}>
        <Text style={styles.addButtonText}>Añadir Ejercicio</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  supersetQuestion: {
    fontSize: 16, // Ajusta el tamaño de fuente según necesites
  },
  checkbox: {
    marginLeft: 20, // Ajusta este valor según sea necesarior
    marginRight:100,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  }, 
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8, // Ajusta este valor según sea necesario
  },
  icon: {
    position: "absolute",
    right: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    color: "#0000ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    padding: 16,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#f7f7f7",
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3, // Añade sombra en Android
    // Para iOS, puedes usar shadowColor, shadowOffset, shadowOpacity, shadowRadius
  },
  exerciseInfo: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 16, // Ajusta según sea necesario
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginRight: 80, // Ajusta según sea necesario
  },
  exerciseDetails: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    backgroundColor: "#0000ff",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginVertical: 16,
    marginHorizontal: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ExerciseDayScreen;
