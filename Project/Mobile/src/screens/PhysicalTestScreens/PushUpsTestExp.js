import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons"; // Asegúrate de tener instalado '@expo/vector-icons'

const PushUpTestScreen = ({ navigation }) => {
  const handleContinue = () => {
    // Navegar a la pantalla para ingresar el resultado
    navigation.navigate("PushUpsTestRes");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.11}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>1 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prueba de Lagartijas</Text>
        <Text  style={styles.sectionStyleTitle}>Explicación de la prueba:</Text>
        <Text  style={styles.sectionStyle}>
          Esta prueba consiste en realizar la mayor cantidad de lagartijas que
          puedas sin parar
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionStyleTitle}>Ejecución del ejercicio:</Text>
          <Text  style={styles.sectionStyle}>
            Posición inicial: El usuario debe acostarse boca abajo en el suelo
            con las manos apoyadas a la altura de los hombros.
          </Text>
          <Text  style={styles.sectionStyle}>
          Postura corporal: Se debe mantener el cuerpo recto desde la cabeza
          hasta los pies. Asegurarse de quelas manos estén alineadas con los
          hombros y que el abdomen este tenso. Descenso: Se deben doblar
          lentamente los codos y bajar el cuerpo hacia el suelo manteniendo la
          espalda recta. Reducir el pecho hasta que esté a punto de tocar el
          suelo.
          </Text>
          <Text style={styles.sectionStyle}>
          Empuje: Utilizar la fuerza de los brazos y el torso para
          empujar el cuerpo hacia arriba. Si se está realizando la variación con
          las piernas apoyadas, es importante no bloquear los codos en posición
          extendida. 
          </Text>
          <Text  style={styles.sectionStyle}>
          Respiración: Se debe exhalar al subir y respirar
          normalmente al bajar.
          </Text>
          <Text style={styles.sectionStyleTitle}>
          Detalles de la prueba:
          </Text>
        <Text  style={styles.sectionStyle}>
          No hay límite de tiempo para esta prueba. La persona debe completar
          tantas flexiones como pueda. La prueba debera interrumpirse cuando la
          persona comience a mostrar esfuerzo excesivo.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionStyle:{
    fontSize: 18,
    marginBottom: 10,
  },
  sectionStyleTitle:{
    fontSize: 20,
    marginBottom: 15,
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
});

export default PushUpTestScreen;
