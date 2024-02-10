import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserInfoScreen = ({ navigation, route }) => {
  const [oid, setOid] = useState("");

  useEffect(() => {
    const fetchOid = async () => {
      const oidValue = await AsyncStorage.getItem("oid");
      if (oidValue !== null) {
        setOid(oidValue);
      }
    };

    fetchOid();
  }, []);
  const Cardiac = route.params?.Cardiac;
  const walkingTime = route.params?.walkingTime;
  const walkingDistance = route.params?.walkingDistance;
  const PushUpCount = route.params?.pushUpCount;
  const SitUpCount = route.params?.SitUpCount;
  const [weight, setWeight] = useState("70"); // Peso inicial predeterminado en kg
  const [height, setHeight] = useState("170"); // Altura inicial predeterminada en cm

  function calcularEdad(fechaNacimiento) {
    const diferencia = Date.now() - fechaNacimiento.getTime();
    const edadFecha = new Date(diferencia);
    return Math.abs(edadFecha.getUTCFullYear() - 1970);
  }

  const handleContinue = async () => {
    const numericWeight = parseInt(weight, 10) || 0;
    const numericHeight = parseInt(height, 10) || 0;

    let vo2Max = 0;
    let condicionFisica = 0;

    // Calcula IMC
    const imc = numericWeight / ((numericHeight / 100 ) * (numericHeight / 100));

    if (Cardiac && walkingTime) {
      console.log(`Cardiac: ${Cardiac}, Walking Time: ${walkingTime}`);
    }
    if (walkingDistance) {
      console.log(`Walking Distance: ${walkingDistance}`);
    }
    console.log(oid);
    console.log("Lagartijas:", PushUpCount);
    console.log("Abdominales:", SitUpCount);
    console.log("Peso: ", numericWeight);
    console.log("Altura: ", numericHeight);

    let edad = 20; // O un valor predeterminado adecuado
    let sexo = 0;

    try {
      // Reemplaza esta URL con la dirección de tu API y el endpoint apropiado
      const response = await fetch(
        `http://192.168.100.5:3001/api/birthdate/${oid}`,
        {
          method: "GET", // o 'POST', dependiendo de tu API
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los datos del usuario");
      }

      const data = await response.json();
      const fechaNacimiento = new Date(data.fechaNacimiento);
      edad = calcularEdad(fechaNacimiento);

      // Ajustar sexoValor basado en el sexo del usuario
      sexo = data.sexo === "H" ? 6.135 : 0;
    } catch (error) {
      console.error("Error al obtener la edad del usuario:", error);
    }

    if (Cardiac && walkingTime && sexo !== undefined && edad) {
      // Cálculo del VO2 Max usando la fórmula de Rockport
      vo2Max =
        132.853 -
        0.1692 * numericWeight -
        0.3877 * edad +
        sexo -
        3.2649 * walkingTime -
        0.1565 * Cardiac;
    } else if (walkingDistance) {
      // Cálculo del VO2 Max usando la fórmula de Cooper, asumiendo que walkingDistance está en kilómetros
      vo2Max = 22.351 * walkingDistance - 11.288;
    } else {
      console.log("Datos insuficientes para calcular el VO2 Max");
    }

    console.log("Edad: ", edad);
    console.log("Sexo: ", sexo);

    // Calcula la condición física
    condicionFisica =
      1 * vo2Max +
      0.5 * PushUpCount +
      0.5 * SitUpCount +
      (-0.2) * edad +
      (-0.1) * imc +
      (-0.1) * numericWeight;

    // Clasifica la condición física
    let clasificacion = "Baja";
    if (condicionFisica > 80) {
      clasificacion = "Alta";
    } else if (condicionFisica >= 60 && condicionFisica <= 80) {
      clasificacion = "Media";
    }

    console.log("VO2 Max:", vo2Max.toFixed(2));
    console.log("IMC:", imc.toFixed(2));
    console.log(
      "Condición Física:",
      condicionFisica.toFixed(2),
      "Clasificación:",
      clasificacion
    );

    navigation.navigate('Congratulations', { clasificacion: clasificacion });
  };

  const handleWeightChange = (text) => {
    const newText = text.replace(/[^0-9]/g, '');
    if (newText === '') {
      setWeight('0');
    } else {
      setWeight(String(parseInt(newText, 10)));
    }
  };
  
  const handleHeightChange = (text) => {
    const newText = text.replace(/[^0-9]/g, '');
    if (newText === '') {
      setHeight('0');
    } else {
      setHeight(String(parseInt(newText, 10)));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={1}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>8 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>

      {/* Selector de peso */}
      <Text style={styles.text}>Peso (kg):</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          onPress={() =>
            setWeight(String(Math.max(parseInt(weight, 10) - 1, 0)))
          }
          style={styles.selectorButton}
        >
          <AntDesign name="minus" size={34} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={handleWeightChange}
          keyboardType="number-pad"
          maxLength={3}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          onPress={() => setWeight(String(parseInt(weight, 10) + 1))}
          style={styles.selectorButton}
        >
          <AntDesign name="plus" size={34} color="black" />
        </TouchableOpacity>
      </View>

      {/* Selector de altura */}
      <Text style={styles.text}>Altura (cm):</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity
          onPress={() =>
            setHeight(String(Math.max(parseInt(height, 10) - 1, 0)))
          }
          style={styles.selectorButton}
        >
          <AntDesign name="minus" size={34} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={height}
          onChangeText={handleHeightChange}
          keyboardType="number-pad"
          maxLength={3}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          onPress={() => setHeight(String(parseInt(height, 10) + 1))}
          style={styles.selectorButton}
        >
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
    alignItems: "center", // Centra el texto horizontalmente
    marginTop: 110,
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
    fontSize: 24,
    textAlign: "center",
    marginHorizontal: 10,
    minWidth: 60, // Asegura un ancho mínimo para el input
    color: "#333", // Color del texto para que parezca texto normal
    padding: 0, // Elimina el padding
    borderWidth: 0, // Elimina el borde
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
    marginTop: 50,
    marginBottom: 50,
  },
});

export default UserInfoScreen;
