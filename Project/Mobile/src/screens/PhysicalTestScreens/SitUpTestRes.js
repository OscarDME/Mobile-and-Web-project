import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons"; 

const TimerScreen = ({ navigation, route }) => {
  const [pushUpCount, setPushUpCount] = useState('0');
  const [timer, setTimer] = useState(60); // Tiempo inicializado en segundos
  const [timerRunning, setTimerRunning] = useState(false);

  const handleIncrement = () => {
    setPushUpCount(String(parseInt(pushUpCount, 10) + 1));
  };

  const handleDecrement = () => {
    setPushUpCount(String(Math.max(parseInt(pushUpCount, 10) - 1, 0)));
  };

  const handleContinue = () => {
    // Asegúrate de convertir el valor a número antes de navegar
    const count = parseInt(pushUpCount, 10) || 0;
    
    navigation.navigate('Select', { pushUpCount: route.params.pushUpCount, SitUpCount: count });
  };

  // Actualiza el estado solo con valores numéricos
  const handleChangeText = (text) => {
    if (text) {
      setPushUpCount(text.replace(/[^0-9]/g, ''));
    } else {
      setPushUpCount('0');
    }
    };
    const handleEndEditing = () => {
      const numericValue = parseInt(pushUpCount, 10);
      setPushUpCount(String(numericValue));
    };



  useEffect(() => {
    let interval;
    if (timerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerRunning(false); // Detiene el temporizador cuando llega a cero
    }
    return () => clearInterval(interval);
  }, [timer, timerRunning]);

  const handleStartTimer = () => {
    setTimerRunning(true);
  };

  const handleRestartTimer = () => {
    setTimerRunning(false);
    setTimer(60);
  };

  const handleStopTimer = () => {
    setTimerRunning(false);
  };

  // Formatear el tiempo en minutos:segundos
  const formatTime = () => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.44}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>4 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime()}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStartTimer} disabled={timerRunning}>
          <Text style={styles.buttonText}>Iniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleRestartTimer}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStopTimer} disabled={!timerRunning}>
          <Text style={styles.buttonText}>Detener</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.text}>Selecciona la cantidad de abdominales realizadas:</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.selectorButton}>
          <AntDesign name="minus" size={34} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.countText}
          value={pushUpCount}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing}
          keyboardType="number-pad"
          returnKeyType="done"
          maxLength={5} // Ajusta según el máximo de lagartijas que esperas
        />
        <TouchableOpacity onPress={handleIncrement} style={styles.selectorButton}>
          <AntDesign name="plus" size={34} color="black" />
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
    alignItems: 'center', // Centra el texto horizontalmente
    marginTop: 110,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Color de texto oscuro para el contraste
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
  button: {
    backgroundColor: '#0790cf', // Un color atractivo para el botón
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 10, // Espacio entre los botones
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
    textAlign: 'center',
    padding: 0, // Quitar padding para que parezca un Text
    marginHorizontal: 20,
  },
  input: {
    marginHorizontal: 20,
    fontSize: 24,
    padding: 5,
    width: 60,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  selectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  },
  continueButton: {
    backgroundColor: '#0790cf',
    padding: 10,
    borderRadius: 5,
  },
  text: {
    marginHorizontal: 30,
    fontSize: 30,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5, // Agregamos bordes redondeados para que se vea más bonito
  },
});

export default TimerScreen;
