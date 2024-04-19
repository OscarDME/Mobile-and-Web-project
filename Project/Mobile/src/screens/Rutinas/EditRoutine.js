import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ModalDropdown from "react-native-modal-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";
import { Switch } from 'react-native'; // Importa el componente Switch


const EditRoutineScreen = ({ navigation, route }) => {
  const [oid, setOid] = useState("");
  const [error, setError] = useState("");
  const [isMaxDaysReached, setIsMaxDaysReached] = useState(false);
  const { routineDetails } = route.params; // Recibe los detalles de la rutina desde los parámetros de navegación
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPublic, setIsPublic] = useState(routineDetails.publica || false);



  useEffect(() => {
    AsyncStorage.getItem("userOID").then((value) => {
      if (value) {
        setOid(value);
      }
    });
    if (routineDetails) {
      setRoutineName(routineDetails.nombre);
      // Transforma los datos de entrenamiento para incluir el índice correcto para el dropdown
      const transformedWorkouts = routineDetails.diasEntreno.map(
        (entrenamiento) => {
          // Encuentra el índice del día en daysOptions para este entrenamiento
          // Resta 1 si tu ID_Dia comienza en 1 y los índices de array en JavaScript comienzan en 0
          const dayIndex = entrenamiento.ID_Dia - 1;
          return {
            ...entrenamiento,
            dayIndex: dayIndex, // Guarda este índice para usarlo en el dropdown
          };
        }
      );
      setWorkouts(transformedWorkouts);
    }
  }, [routineDetails, refreshKey]);

  console.log("OID:", oid);

  const [routineName, setRoutineName] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const daysOptions = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  const addDay = () => {
    if (workouts.length >= 7) {
      setIsMaxDaysReached(true);
      setError("No puedes agregar más de 7 días.");
      return;
    }

    setIsMaxDaysReached(false); // Resetear el indicador si previamente se alcanzó el límite y ahora se está dentro del límite permitido
    setError(""); // Limpiar errores previos

    setWorkouts([
      ...workouts,
      {
        id: `Día ${workouts.length + 1}`,
        muscles: "",
        duration: "",
        ID_Dia: null, // Este valor se actualizará con el índice del día seleccionado
      },
    ]);
  };

  const deleteDay = (dayId) => {
    setWorkouts((currentWorkouts) =>
      currentWorkouts.filter((workout) => workout.ID_Dias_Entreno !== dayId)
    );
  };

  const onSelectDay = (index, optionIndex) => {
    // Actualiza el día basado en la selección del usuario
    const updatedWorkouts = workouts.map((workout, i) => {
      if (i === index) {
        return { ...workout, ID_Dia: optionIndex + 1 }; // Asumiendo que los IDs de los días van de 1 a 7
      }
      return workout;
    });
    setWorkouts(updatedWorkouts);
  };
  
  const handlePressAddExercise = (index) => {
    // Verifica si el índice es válido y si el día y ID_Dias_Entreno están definidos.
    if (index < workouts.length && workouts[index].dayIndex !== undefined && workouts[index].ID_Dias_Entreno) {
      const selectedWorkout = workouts[index];
      const day = daysOptions[selectedWorkout.dayIndex];
      const dayID = selectedWorkout.ID_Dias_Entreno;
  
      // Realiza la navegación si todo es correcto.
      navigation.navigate('AddEjercicio', {
        day: day,
        dayID: dayID,
        ID_Rutina: routineDetails.ID_Rutina,
      });
    } else {
      // Muestra un mensaje de error o realiza alguna acción si el día no está definido.
      setError('Debes seleccionar un día antes de añadir ejercicios.');
    }
  };


  const checkForConsecutiveDays = (workouts) => {
    const sortedIds = workouts.map(workout => workout.ID_Dia).sort((a, b) => a - b);
    for (let i = 0; i < sortedIds.length - 4; i++) {
      if (sortedIds[i + 4] - sortedIds[i] === 4) { 
        console.log("Se encontraron 5 días consecutivos de entrenamiento");
        return true; 
      }
    }
    return false; 
  }
  

  const saveRoutine = async () => {
    const todosTienenDia = workouts.every((workout) => workout.ID_Dia !== null);
    const idsUnicos = new Set(workouts.map((workout) => workout.ID_Dia));



    if (!todosTienenDia) {
      setError("Todos los días de entrenamiento deben tener un día asignado.");
      return;
    }

    if (idsUnicos.size !== workouts.length) {
      setError("Los días de entrenamiento deben ser diferentes entre sí.");
      return;
    }

    setError(""); // Limpiar errores si todo está correcto

    try {
      const oid = await AsyncStorage.getItem("userOID");
      const workoutsIds = workouts.map((workout) => workout.ID_Dia);

      // Aquí cambia para usar el ID de rutina existente y actualizarla
      const requestBody = {
        ID_Rutina: routineDetails.ID_Rutina, // Usa el ID de la rutina que estás editando
        oid: oid,
        routineName: routineName,
        workoutsIds: workoutsIds, // IDs de los días de entrenamiento que permanecen
        publica: isPublic, // Incluye el estado de isPublic en la solicitud
      };

      console.log(requestBody);

      // Ajusta la URL y el método HTTP según tu backend
      const response = await fetch(
        `${config.apiBaseUrl}/rutina/${routineDetails.ID_Rutina}`,
        {
          method: "PUT", // Usa PUT para actualizar
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        console.log("Rutina actualizada exitosamente");

        //Manejo de las advertencias
        const responseWarning = await fetch(`${config.apiBaseUrl}/allWarnings/weeklyCheck/${routineDetails.ID_Rutina}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            workouts: workouts,
          })
        });

        if (responseWarning.ok) {
          const jsonResponseWarning = await responseWarning.json();
          console.log("Warning procesado con exito:", jsonResponseWarning);
        } else {
          throw new Error("No se pudo asignar la advertencia al ejercicio");
        }

        if (checkForConsecutiveDays(workouts)) {
          //Advertencia no se puede tener 5 dias de entrenamiento consecutivos sin descanso
        }

        if (route.params?.onReturn) {
            route.params.onReturn();
          }        
          navigation.goBack();
        } else {
        console.log("Error al actualizar la rutina");
        // Manejar errores aquí
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      setError("Error al actualizar la rutina.");
    }
  };

  const renderDropdown = (index) => {
    // Usa el índice almacenado en el estado de cada entrenamiento para seleccionar la opción correcta
    const dayIndex = workouts[index].dayIndex;
    return (
      <ModalDropdown
        options={daysOptions}
        defaultValue={daysOptions[dayIndex]} // Usa el índice para establecer la opción por defecto
        onSelect={(optionIndex) => onSelectDay(index, optionIndex)}
        textStyle={styles.dropdownText}
        dropdownTextStyle={styles.dropdownTextStyle}
        dropdownStyle={styles.dropdownStyle}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nombre de la rutina</Text>
        <TouchableOpacity onPress={saveRoutine}>
          <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la rutina"
        value={routineName}
        onChangeText={setRoutineName}
      />
      <ScrollView style={styles.workoutsList}>
        {workouts.map((workout, index) => (
          <TouchableOpacity key={index} style={styles.workoutItem}  onPress={() => handlePressAddExercise(index)}
          >
            <TouchableOpacity
              onPress={() => deleteDay(workout.ID_Dias_Entreno)}
            >
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutDay}>Día {index + 1}</Text>
              {renderDropdown(index)}
              {/* Aquí puedes agregar campos para músculos y duración si es necesario */}
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.switchContainer}>
  <Text>¿Hacer Rutina Pública?</Text>
  <Switch
    trackColor={{ false: "#767577", true: "#81b0ff" }}
    thumbColor={isPublic ? "#f5dd4b" : "#f4f3f4"}
    onValueChange={() => setIsPublic(previousState => !previousState)}
    value={isPublic}
  />
</View>
      </ScrollView>
      <Text style={{ color: "red", margin: 10 }}>{error}</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={addDay}
        disabled={isMaxDaysReached} // Deshabilitar el botón si se alcanzó el máximo de días
      >
        <Text style={styles.addButtonText}>Añadir día</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 16,
    margin: 16,
  },
  workoutsList: {
    flex: 1,
  },
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  workoutInfo: {
    flex: 1,
    marginLeft: 12,
  },
  workoutDay: {
    fontWeight: "bold",
  },
  addButton: {
    margin: 16,
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  dropdownStyle: {
    marginTop: 15,
    marginLeft: -10,
    width: 150,
  },
  // Estilos adicionales para el ícono de borrar, texto y dropdown pueden ir aquí
});
export default EditRoutineScreen;
