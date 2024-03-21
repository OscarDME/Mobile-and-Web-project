import React, { useState, useEffect } from 'react';
import {Alert, View, Text, StyleSheet, TouchableOpacity, TextInput,Keyboard, TouchableWithoutFeedback, VirtualizedList} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';

const WorkoutScreen = ({route, navigation}) => {

  const { workoutSession } = route.params;
  const [currentSetIndex, setCurrentSetIndex] = useState(0); 

  const [weight, setWeight] = useState(workoutSession.session[currentSetIndex].weight.toString());
  const [reps, setReps] = useState(workoutSession.session[currentSetIndex].reps.toString());
  const [timer, setTimer] = useState(workoutSession.session[currentSetIndex].rest); 
  const [isResting, setIsResting] = useState(false); 
  const [cardioTime, setCardioTime] = useState(
    workoutSession.session[currentSetIndex].exerciseToWork.type === "Cardiovascular" ? 
    workoutSession.session[currentSetIndex].time : 0
  );
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const disableSkipButton = isResting && workoutSession.session[currentSetIndex].exerciseToWork.type !== "Cardiovascular";
  
  const [cardioInProgress, setCardioInProgress] = useState(false);


  const progress = (currentSetIndex) / workoutSession.session.length; 

  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    // Asegura que minutos y segundos se muestren con dos dígitos
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  


  //hacer una copia de workoutsession para actualizar los pesos en cada ejercicio
  const [sessionCopy, setSessionCopy] = useState(JSON.parse(JSON.stringify(workoutSession)));

  const updateWeight = (newWeight) => {
    setWeight(newWeight); // Actualiza el peso actual
    
    // Crea una nueva copia con el peso actualizado para el set actual
    const updatedSession = {...sessionCopy};
    updatedSession.session[currentSetIndex].weight = parseFloat(newWeight);
    setSessionCopy(updatedSession); // Actualiza la copia de la sesión
  };
  
  const updateReps = (newReps) => {
    setReps(newReps); // Actualiza las repeticiones actuales
    
    // Crea una nueva copia con las repeticiones actualizadas para el set actual
    const updatedSession = {...sessionCopy};
    updatedSession.session[currentSetIndex].reps = parseInt(newReps, 10); // Convierte a entero
    setSessionCopy(updatedSession); // Actualiza la copia de la sesión
  };
  


  const startCardio = () => {
    setCardioTime(workoutSession.session[currentSetIndex].time); // Establece el tiempo del ejercicio cardiovascular actual
    setCardioInProgress(true);
    // Inicia un temporizador para decrementar cardioTime cada segundo
    const interval = setInterval(() => {
      setCardioTime((prevTime) => {
        if (prevTime > 1) return prevTime - 1;
        clearInterval(interval);
        finishCardio(); // Termina automáticamente cuando el tiempo expira
        return 0;
      });
    }, 1000);
  };
  
  const finishCardio = () => {
    setCardioInProgress(false);
    console.log(`Ejercicio cardiovascular terminado con ${cardioTime} segundos restantes.`);
  
    const updatedSession = { ...sessionCopy };
    updatedSession.session[currentSetIndex].time = cardioTime;
    setSessionCopy(updatedSession);
  
    // Se actualiza cardioTime a 0 aquí para reflejar que el ejercicio ha terminado completamente
    setCardioTime(0);
    

    if (currentSetIndex < workoutSession.session.length - 1) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else {
      // Finaliza el entrenamiento
      navigation.goBack();
    }
  };
  
  
  

  useEffect(() => {
    let interval;
    if (isResting && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResting(false); // Detiene el descanso cuando el temporizador llega a cero
    }

    return () => clearInterval(interval);
  }, [isResting, timer]);

  useEffect(() => {
    if (timer === 0 && isResting) {
      setIsResting(false); // Termina el descanso
      if (currentSetIndex < workoutSession.session.length - 1) {
        setCurrentSetIndex(currentSetIndex + 1); // Mueve al siguiente set
        setWeight(workoutSession.session[currentSetIndex + 1].weight.toString());
        setReps(workoutSession.session[currentSetIndex + 1].reps.toString());
        setTimer(workoutSession.session[currentSetIndex + 1].rest);
      } else {
        // Manejar el final del entrenamiento en la Base de datos
        if (currentSetIndex >= workoutSession.session.length - 1) {
          // Entrenamiento completado
          console.log('Entrenamiento Finalizado. Resumen de pesos, repeticiones y tiempo utilizados:');
          sessionCopy.session.forEach((set, index) => {
            if(set.exerciseToWork.type === "Cardiovascular") {
              // Para ejercicios cardiovasculares, mostrar el tiempo en lugar de peso y repeticiones
              console.log(`Set ${index + 1}: Ejercicio: ${set.exerciseToWork.name}, Tiempo realizado: ${set.time} segundos`);
            } else {
              // Para ejercicios no cardiovasculares, mostrar peso y repeticiones
              console.log(`Set ${index + 1}: Ejercicio: ${set.exerciseToWork.name}, Peso utilizado: ${set.weight} kg, Repeticiones: ${set.reps}`);
            }
          });
          setTrainingCompleted(true);
        }
      }
    }
  }, [timer, isResting, currentSetIndex, workoutSession.session, sessionCopy]);

  useEffect(() => {
    if (trainingCompleted) {
      // Finaliza el entrenamiento GUARDAR DATOS EN LA BASE DE DATOS AQUI
      navigation.goBack();
    }
  }, [trainingCompleted, navigation]);
  
  

// Asegúrate de que este useEffect esté presente en tu componente
useEffect(() => {
  if (currentSetIndex < workoutSession.session.length) {
    const currentExercise = workoutSession.session[currentSetIndex];
    // Actualiza weight y reps para el nuevo ejercicio
    setWeight(currentExercise.weight.toString());
    setReps(currentExercise.reps.toString());
    // Configura el tiempo de descanso o el tiempo del ejercicio cardiovascular
    if (currentExercise.exerciseToWork.type === "Cardiovascular") {
      setCardioTime(currentExercise.time);
    } else {
      setTimer(currentExercise.rest);
    }
  }
}, [currentSetIndex]); // Escucha los cambios en currentSetIndex

  
  

  const handleExitPress = () => {
    Alert.alert(
      "Terminar Entrenamiento",
      "¿Estás seguro de que quieres terminar el entrenamiento?",
      [
        {
          text: "No",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Sí", onPress: () => {
            // Antes de finalizar, ajusta los sets no realizados.
            const updatedSession = sessionCopy.session.map((set, index) => {
              if (index >= currentSetIndex) {
                // Para ejercicios cardiovasculares no realizados, ajusta el tiempo a 0
                if (set.exerciseToWork.type === "Cardiovascular") {
                  return { ...set, time: 0 };
                }
                return { ...set, weight: 0, reps: 0 };
              }
              return set; 
            });
  
            setSessionCopy({ ...sessionCopy, session: updatedSession });
  
            // Aquí podrías agregar lógica adicional para guardar el estado actual en la base de datos o realizar otras acciones de limpieza.
  
            if (isTimerRunning) {
              clearInterval(interval); 
              setIsTimerRunning(false);
            }
  
            // Log de salida para debug. Remover o reemplazar según se requiera.
            console.log('Entrenamiento Finalizado Prematuramente. Resumen final:');
            updatedSession.forEach((set, index) => {
              if(set.exerciseToWork.type === "Cardiovascular") {
                // Para ejercicios cardiovasculares, mostrar el tiempo en lugar de peso y repeticiones
                console.log(`Set ${index + 1}: Ejercicio: ${set.exerciseToWork.name}, Tiempo realizado: ${set.time} segundos`);
              } else {
                // Para ejercicios no cardiovasculares, mostrar peso y repeticiones
                console.log(`Set ${index + 1}: Ejercicio: ${set.exerciseToWork.name}, Peso utilizado: ${set.weight} kg, Repeticiones: ${set.reps}`);
              }
            });
  
            // Utiliza navigation para volver a la pantalla anterior
            setTrainingCompleted(true);
            navigation.goBack();
          }
        }
      ]
    );
  };
  
  
  const handleSkipSet = () => {
    Alert.alert(
      "Saltar Set",
      "¿Estás seguro de que quieres saltar este set?",
      [
        {
          text: "No",
          onPress: () => console.log("No se saltó el set"),
          style: "cancel"
        },
        {
          text: "Sí", onPress: () => {
            // Logica para saltar el set
            const updatedSession = {...sessionCopy};
            // Actualiza el set actual a 0 para peso y repeticiones
            updatedSession.session[currentSetIndex].weight = 0;
            updatedSession.session[currentSetIndex].reps = 0;
  
            setSessionCopy(updatedSession); // Actualiza la copia de la sesión
  
            if (currentSetIndex < workoutSession.session.length - 1) {
              // Avanza al siguiente set si es posible
              const nextSetIndex = currentSetIndex + 1;
              setCurrentSetIndex(nextSetIndex); // Mueve al siguiente set
  
              // Actualiza el estado local para reflejar el siguiente set
              setWeight(updatedSession.session[nextSetIndex].weight.toString());
              setReps(updatedSession.session[nextSetIndex].reps.toString());
              setTimer(updatedSession.session[nextSetIndex].rest);
            } else {
              // Aquí podrías manejar el caso de que sea el último set
              console.log("Último set alcanzado. No se puede saltar más.");
              const updatedSession = { ...sessionCopy };
              const currentExercise = updatedSession.session[currentSetIndex];

              if (currentExercise.exerciseToWork.type === "Cardiovascular") {
                  currentExercise.time = 0; // Ajusta el tiempo a 0 para cardio
              } else {
                  currentExercise.weight = 0; // Ajusta peso y repeticiones a 0
                  currentExercise.reps = 0;
              }
              
              setSessionCopy(updatedSession); // Actualiza la sesión
              setTrainingCompleted(true); // Marca el entrenamiento como completado
              return; // Evita ejecutar el resto de la función
            }
          }
        }
      ]
    );
  };
  

  const startRestTimer = () => {
    if (!isResting) {
      setIsResting(true);
      setTimer(workoutSession.session[currentSetIndex].rest); // Usa el tiempo de descanso del set actual
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

    <View style={styles.container}>
      {/* Barra de Progreso */}
      <View style={styles.progressBarContainer}>
      <Text style={styles.progressBarText} >{(progress * 100).toFixed(1)}% Completado</Text>
      <Progress.Bar progress={progress} width={null} height={25} color="#aaff00" animated={true} borderWidth={0} />
      </View>

      {/* Contenido de la pantalla */}
      <View style={styles.exerciseContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.exerciseHeader}>Ejercicio actual</Text>
        <TouchableOpacity style={styles.exitIcon} onPress={handleExitPress}>
        <Ionicons name="exit-outline" size={30} color="#E53E3E"  />
        </TouchableOpacity>

      </View>

      <Text style={styles.exerciseName}>{workoutSession.session[currentSetIndex].exerciseToWork.name}</Text>



      {workoutSession.session[currentSetIndex].exerciseToWork.type === "Cardiovascular" ? (
          // Contenido específico para ejercicios cardiovasculares
          <View style={styles.cardioContainer}>
            <Text style={styles.timerLabel}>Tiempo:</Text>
            <Text style={styles.timer}>{`${formatTime(cardioTime)}`}</Text>

            {cardioInProgress ? (
              <TouchableOpacity style={styles.stopButton} onPress={finishCardio}>
                <Text style={styles.skipButtonText}>Terminar Cardio</Text>
              </TouchableOpacity>
            ):(
              <>
            <TouchableOpacity style={styles.startButton} onPress={startCardio}>
              <Text style={styles.skipButtonText}>Iniciar {workoutSession.session[currentSetIndex].exerciseToWork.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkipSet}>
              <Text style={styles.skipButtonText}>Saltar {workoutSession.session[currentSetIndex].exerciseToWork.name}</Text>
            </TouchableOpacity>
            </>
            )}
          </View>
        ) : (
          // Contenido para ejercicios que no son cardiovasculares
          <>
            <View style={styles.exerciseDetails}>
              <View style={styles.exerciseDetailRow}>
                <Text style={styles.timerLabel}>Peso kg</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={updateWeight}
                  value={weight}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.exerciseDetailRow}>
                <Text style={styles.timerLabel}>Reps</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={updateReps}
                  value={reps}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <Text style={styles.timerLabel}>Descanso</Text>
            <Text style={styles.timer}>{formatTime(timer)}</Text>
            <TouchableOpacity style={styles.checkButton} onPress={startRestTimer}>
              <MaterialCommunityIcons name="check-bold" size={90} color="#eee" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.skipButton, disableSkipButton ? styles.disabledButton : {}]} 
                onPress={handleSkipSet}
                disabled={disableSkipButton}
              >
              <Text style={styles.skipButtonText}>Saltar Set</Text>
            </TouchableOpacity>
          </>
        )}
        

      </View>
      {currentSetIndex < workoutSession.session.length - 1  ? (

      <View style={styles.exerciseContainer}>
      <Text style={styles.nextExercise}>Siguiente ejercicio</Text>
      <Text style={styles.nextExerciseName}>{workoutSession.session[currentSetIndex + 1].exerciseToWork.name}</Text>
      </View>
      ):(
      <View style={styles.exerciseContainer}>
      <Text style={styles.nextExercise}>¡Fin de entrenamiento!</Text>
      </View>
      )}


    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    marginTop: 40,
    marginBottom: 10,
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 20,
  },
  exerciseContainer: {
    alignItems: 'center',
  },
  exerciseHeader: {
    fontSize: 30,
  },
  exerciseName: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    margin: 50,
  },
  checkButton: {
    padding: 20,
    borderRadius: 100,
    backgroundColor: '#0790cf',
    margin: 25,
  },
  timerLabel: {
    fontSize: 18,
  },
  timer: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  nextExercise: {
    fontSize: 24,
    color: '#7A7A7A',
  },
  nextExerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7A7A7A',
  },progressBarContainer:{
    position: 'relative',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'center',
  },
  progressBarText:{
    position: 'absolute',
    zIndex: 1,
    top: 0,
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: 'bold',
    marginTop: 5,
  },
  exerciseDetailRow:{
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  input: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80, 
    borderBottomWidth: 1, 
    borderColor: 'grey',
    marginHorizontal: 10, 
  },
  skipButtonText: {
    fontSize: 18,
    color: '#eee',
  },
  skipButton:{
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#E53E3E',
  },
  exitWorkout:{
    flexDirection: 'row',
    margin: 0,
    width : "100%",
    justifyContent: 'flex-end',
  },  headerContainer: {
    width: '100%', // Ocupa el ancho completo
    alignItems: 'center', // Alinea los hijos verticalmente en el centro
  },
  exerciseHeader: {
    fontSize: 30,
  },
  exitIcon: {
    position: 'absolute', 
    right: "-20%", 
    top: '50%', 
    marginTop: -15, 
  },
  stopButton:{
    margin: 40,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#E53E3E',
  },
  startButton:{
    margin: 40,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#0790cf',
  },
  cardioContainer:{
    padding: 20,
    marginBottom: 10,
    alignContent: 'center',
    justifyContent  : 'center',
    alignItems: 'center',
  },
  disabledButton:{
    backgroundColor: '#ccc',
  }
});

export default WorkoutScreen;
