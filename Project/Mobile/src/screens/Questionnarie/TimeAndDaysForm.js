import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";
import { CheckBox } from "react-native-elements";
import * as Progress from "react-native-progress";
import { AntDesign } from '@expo/vector-icons'; 
import TimePicker from "../../components/TimePicker"; 
import config from "../../utils/conf";

const TrainingSchedule = ({ navigation, route }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [trainingTime, setTrainingTime] = useState("01:00:00");
  const [preferredDays, setPreferredDays] = useState([]);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const oid = route.params.oid;

  const dayNumberMapping = {
    Lunes: 1,
    Martes: 2,
    Miércoles: 3,
    Jueves: 4,
    Viernes: 5,
    Sábado: 6,
    Domingo: 7,
  };

  useEffect(() => {
    loadCuestionarioData();
  }, []);

  const loadCuestionarioData = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/cues/${oid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      if (data) {
        const trainingTime = data.cuestionario.TiempoDisponible;
        // Asegúrate de que el tiempo está en el formato correcto
        const formattedTrainingTime = trainingTime.includes(':') ? trainingTime + ":00" : "01:00:00";
        console.log("Tiempo disponible (formateado):", formattedTrainingTime);
        setTrainingTime(formattedTrainingTime);
        setPreferredDays(data.puedeEntrenar.map(d => d.ID_Dia) || []);
        setCheckboxChecked(data.quiereEntrenar && data.quiereEntrenar.length > 0);
      }
    } catch (error) {
      Alert.alert("Error", "No se pudieron cargar los datos del cuestionario");
      console.error(error);
    }
  };


  const handleTrainingTimeChange = ({ hours, minutes }) => {
    setTrainingTime(
      `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`
    );
  };

  const handlePreferredDaysChange = (day) => {
    const dayNumber = dayNumberMapping[day];
    if (preferredDays.includes(dayNumber)) {
      setPreferredDays(preferredDays.filter((d) => d !== dayNumber));
    } else {
      setPreferredDays([...preferredDays, dayNumber]);
    }
  };

  const renderDayCircle = (day, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.dayCircle,
        preferredDays.includes(index + 1) ? styles.selectedDayCircle : null,
      ]}
      onPress={() => handlePreferredDaysChange(day)}
    >
      <Text style={styles.dayInitial}>{day.charAt(0)}</Text>
    </TouchableOpacity>
  );

  const handleSubmit = () => {
    if (!trainingTime) {
      setErrorMessage("Por favor, selecciona un tiempo de entrenamiento.");
      return;
    } else if (preferredDays.length === 0) {
      setErrorMessage("Por favor, selecciona al menos un día preferido para entrenar.");
      return;
    } else {
      setErrorMessage(""); }
    console.log("Tiempo de entrenamiento:", trainingTime);
    console.log("Días preferidos:", preferredDays);

    if (!trainingTime || preferredDays.length === 0) {
      console.error("Por favor, completa todos los campos");
      return;
    }

    if (checkboxChecked) {
      navigation.navigate("Muscles", {
        oid: route.params.oid,
        trainingTime: trainingTime,
        preferredDays: preferredDays,
    });
  } else {
    navigation.navigate("TrainingGoalsScreen", {
      oid: route.params.oid,
      trainingTime: trainingTime,
      preferredDays: preferredDays,
  });      
  }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar progress={0.2} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>1 de 5</Text>
      <TimePicker onChange={handleTrainingTimeChange} />
      
      <Text style={styles.instructionText}>Selecciona los días preferidos para entrenar:</Text>
      <View style={styles.daysContainer}>
        {[
          "Lunes",
          "Martes",
          "Miércoles",
          "Jueves",
          "Viernes",
          "Sábado",
          "Domingo",
        ].map((day, index) => renderDayCircle(day, index))}
      </View>

      <TouchableOpacity style={styles.arrowContainer} onPress={handleSubmit}>
        <AntDesign name="arrowright" size={34} color="black"  />
      </TouchableOpacity>
      {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
      <CheckBox
        title="Seleccionar los músculos que quieres entrenar"
        checked={checkboxChecked}
        onPress={() => setCheckboxChecked(!checkboxChecked)}
        containerStyle={styles.checkboxContainer}
        textStyle={styles.checkboxText}
        checkedColor="black" 
        uncheckedColor="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  pageText: {
    fontSize: 16, // Aumenta el tamaño del texto
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  progress: {
    width: "100%",
    zIndex: -1,
    paddingTop: 25,
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    marginTop: 50,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  checkboxContainer: {
    backgroundColor: "transparent", // Fondo transparente
    alignItems: "center", // Centra el checkbox
    borderWidth: 0, // Sin bordes
    margin: 0, // Sin márgenes externos
    padding: 0, // Sin padding
  },
  checkboxText: {
    fontWeight: "normal", // Estilo de texto normal o según prefieras
    fontSize: 16, // Tamaño de texto ajustable según necesites
  },
  selectedDayCircle: {
    backgroundColor: "lightblue",
  },
  dayInitial: {
  
    fontSize: 18,
    fontWeight: "bold",
  },
  instructionText: {
    fontSize: 24, // Aumenta el tamaño del texto
    textAlign: "center",
  },
  arrowContainer: {
    top: -560,
    right: -350,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  }
});

export default TrainingSchedule;