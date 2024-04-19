import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
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
            isLoaded: true,
          };
        });
        setExercises(formattedExercises);
        console.log(formattedExercises);
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

  const handlePressExercise = (ID_Ejercicio, ejercicio, ID_Modalidad) => {
    // Encuentra el ejercicio seleccionado basado en el ID_Ejercicio
    const selectedExercise = exercises.find(exercise => exercise.ID_Ejercicio === ID_Ejercicio);
  
    if (selectedExercise && selectedExercise.isLoaded) {
      // Si el ejercicio está cargado, navega a AddSetsScreen
      navigation.navigate("AddSets", { ID_EjerciciosDia: selectedExercise.ID_EjerciciosDia, ejercicio: ejercicio, ID_Modalidad: ID_Modalidad });
    } else {
      // Si el ejercicio no está cargado o no está guardado, muestra un mensaje de error
      alert("Este ejercicio aún no está disponible para configurar sets. Por favor, guarde los cambios primero.");
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
      { ...exerciseToAdd, isSuperset: false, restTime: "0", isLoaded: false },
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

    const allExercisesHaveRestTime = exercises.every(exercise => 
      exercise.ID_Modalidad === 3 || (exercise.restTime && exercise.restTime.trim() !== '0')
    );

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
      const allExercisesID = exercises.map(exercise => exercise.ID_Ejercicio);

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
        //ADVERTENCIAS POR SOBREENTRENAMIENTO
        // Mandar ID de los ejercicios para advertencias de (Una rutina tiene mas de 4 ejercicios de un mismo musculo en un dia)
        const responseWarning = await fetch(`${config.apiBaseUrl}/allWarnings/overTraining/fourExercisesSameMuscleADay/${route.params.ID_Rutina}/${route.params.dayID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ID_Ejercicios: allExercisesID,
          })
        });

        if (responseWarning.ok) {
          const jsonResponseWarning = await responseWarning.json();
          console.log("Warning procesado con exito:", jsonResponseWarning);
        } else {
          throw new Error("No se pudo asignar la advertencia al ejercicio");
        }

        // Si hay mas de 8 ejercicios mandar ID de la rutina para que se agregue el warning (una rutina tiene mas de 8 ejercicios en un dia)
          const responseWarning2 = await fetch(`${config.apiBaseUrl}/allWarnings/overTraining/eightExercisesADay/${route.params.ID_Rutina}/${route.params.dayID}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              exercises: exercises,
            })
          });
        if (responseWarning2.ok) {
            const jsonResponseWarning2 = await responseWarning2.json();
            console.log("Warning 2 procesado con exito:", jsonResponseWarning2);
          } else {
            throw new Error("No se pudo asignar la advertencia al 2 ejercicio");
          }


        //Una rutina tenga tiempos de descanso muy cortos (menos  de un minuto)
        const responseWarning3 = await fetch(`${config.apiBaseUrl}/allWarnings/overTraining/shortRestTime/${route.params.ID_Rutina}/${route.params.dayID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            exercises: exercises,
          })
        });
        if (responseWarning3.ok) {
            const jsonResponseWarning3 = await responseWarning3.json();
            console.log("Warning 3 procesado con exito:", jsonResponseWarning3);
          } else {
            throw new Error("No se pudo asignar la advertencia al 3 ejercicio");
          }

        
        //Cuando Una rutina excede un tiempo de dos horas sin tomar en cuenta los descansos

        //ADVERTENCIAS POR VARIABILIDAD
        //Cuando Cuatro ejercicios o mas dentro de un dia de entrenamiento utilicen el mismo material
        const responseWarning5 = await fetch(`${config.apiBaseUrl}/allWarnings/variability/fourExercisesSameMaterialADay/${route.params.ID_Rutina}/${route.params.dayID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ID_Ejercicios: allExercisesID,
          })
        });
        if (responseWarning5.ok) {
          const jsonResponseWarning5 = await responseWarning5.json();
          console.log("Warning 5 procesado con exito:", jsonResponseWarning5);
        } else {
          throw new Error("No se pudo asignar la advertencia 5 al ejercicio");
        }


        //ADVERTENCIAS POR INTENSIDAD
        //Mas de 3 ejercicios dentro de un dia de entrenamiento tienen un nivel de intensidad alto 
        const responseWarning6 = await fetch(`${config.apiBaseUrl}/allWarnings/intensity/threeExercisesHighIntensityADay/${route.params.ID_Rutina}/${route.params.dayID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ID_Ejercicios: allExercisesID,
          })
        });
        if (responseWarning6.ok) {
          const jsonResponseWarning6 = await responseWarning6.json();
          console.log("Warning 6 procesado con exito:", jsonResponseWarning6);
        } else {
          throw new Error("No se pudo asignar la advertencia 6 al ejercicio");
        }

        navigation.goBack();
      } else {
        throw new Error("No se pudo guardar los ejercicios");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{route.params.day}</Text>
        <TouchableOpacity onPress={saveExercises}>
        <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Ejercicios</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.ID_Ejercicio.toString()}
        renderItem={({ item, index }) => (

    <View style={styles.exerciseItem}>
       <TouchableOpacity
          onPress={() => handlePressExercise(item.ID_Ejercicio, item.ejercicio, item.ID_Modalidad)}
          style={{ flex: 1 }}
        >
        {item.ID_Modalidad === 3? (
        // Si `specialInput` es verdadero, muestra el input para tiempo en minutos
        <>
      <View style={styles.exerciseNameContainer}>
        <Text style={styles.exerciseNameCardio}>{item.ejercicio}</Text>
        <TouchableOpacity style={styles.icon} onPress={() => deleteExercise(item.ID_Ejercicio)}>
        <Ionicons name="trash-outline" size={30} color="red" />
      </TouchableOpacity>
      </View>
        </>
        ) : (
          <>
      <View style={styles.exerciseNameContainer}>
        <Text style={styles.exerciseName}>{item.ejercicio}</Text>
        <TouchableOpacity onPress={() => deleteExercise(item.ID_Ejercicio)}>
        <Ionicons name="trash-outline" size={30} color="red" />
      </TouchableOpacity>
      </View>
        <View style={styles.infoContainer}>
          <Text style={styles.supersetQuestion}>¿Es superset?</Text>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => toggleSuperset(index)}
          >
            <Ionicons
              name={item.isSuperset ? "checkmark-circle" : "ellipse-outline"}
              size={24}
              color={item.isSuperset ? "#0790cf" : "grey"}
            />
          </TouchableOpacity>
          <View style={styles.restTimeContainer}>
          <Text style={styles.supersetQuestion}>Descanso (seg)</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRestTime(text, index)}
            value={item.restTime}
            placeholder="Descanso (seg)"
            keyboardType="numeric"
            nameSuffix="seg"
          />
          </View>
        </View>
        </>
        )}
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
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginLeft: 35,
  },
  checkbox: {
    marginLeft: 80, // Ajusta este valor según sea necesarior
    marginRight:100,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  }, 
  infoContainer: {
    width: "100%",
    borderTopColor: "#CCCCCC",
    borderTopWidth: 2,
    paddingTop: 10,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-around",
    marginTop: 16, // Ajusta este valor según sea necesario
  },
  icon: {

  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    color: "#0790cf",
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    padding: 16,
    fontSize: 20,
    fontWeight: "bold",
    backgroundColor: "#ffff",
  },
  exerciseItem: {
    flexDirection: "collumn",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
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
    marginRight: 40, // Ajusta según sea necesario
  },
  exerciseNameCardio: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginRight: 155, // Ajusta según sea necesario
  },
  exerciseDetails: {
    fontSize: 16,
    color: "#666",
  },
  addButton: {
    margin: 16,
    alignItems: "center",
    backgroundColor: "#0790cf",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  restTimeContainer:{
    flexDirection: "collumn",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 5,
    marginRight:60,
  },
  restTimeContainerCardio:{
    flexDirection: "collumn",
    justifyContent: "center",
    alignItems: "center",
    rowGap: 5,
    marginLeft:50,
  },
  exerciseNameContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    rowGap: 5,
  },
  icon: {
    marginRight:-20,
  },
  infoCollumn:{
    flexDirection: "collumn",
    rowGap: 5,
    alignItems: "center",
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    paddingBottom: 3,
    paddingHorizontal: 5,
    width: 35,
    borderBottomColor: "#CCCCCC",
    marginLeft:40,
  }
});

export default ExerciseDayScreen;
