import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";

const RockportInput = ({ navigation, route }) => {
  const [timer, setTimer] = useState(120); // Iniciar tiempo en segundos desde cero
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStartStopTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    setTimer(0);
  };

  // Formatear el tiempo en minutos:segundos
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleContinue = () => {
    const timeInMinutes = Math.floor(timer / 60);
    // Navega a la siguiente pantalla pasando el tiempo en minutos
    navigation.navigate("Cardiac", {pushUpCount: route.params.pushUpCount, SitUpCount: route.params.SitUpCount, walkingTime: timeInMinutes });

    handleResetTimer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.87}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>7 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
      <Text style={styles.text}>
        Inicia el cronometro para comenzar la prueba:
      </Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStartStopTimer}>
          <Text style={styles.buttonText}>
            {timerRunning ? "Detener" : "Iniciar"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleResetTimer}
          disabled={timerRunning}
        >
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  timerContainer: {
    alignItems: "center", // Centra el texto horizontalmente
    marginTop: 40,
  },
  timerText: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333", // Color de texto oscuro para el contraste
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    padding: 20,
  },
  button: {
    backgroundColor: "#0790cf", // Un color atractivo para el botón
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 10, // Espacio entre los botones
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
  countText: {
    minWidth: 40, // Asegúrate de que el TextInput tenga suficiente espacio
    fontSize: 24,
    textAlign: "center",
    padding: 0, // Quitar padding para que parezca un Text
    marginHorizontal: 20,
  },
  input: {
    marginHorizontal: 20,
    fontSize: 24,
    padding: 5,
    width: 60,
    textAlign: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  selectorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  selectorButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width: 55,
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    marginHorizontal: 20,
    fontSize: 24,
  },
  continueButton: {
    backgroundColor: "#0790cf",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    marginHorizontal: 30,
    fontSize: 30,
    textAlign: "center",
    marginTop: 110,
    marginBottom: 10,
  },
  input: {
    width: "80%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5, // Agregamos bordes redondeados para que se vea más bonito
  },
});

export default RockportInput;
