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

const PushUpTestScreen = ({ navigation, route }) => {
  const handleContinue = () => {
    // Navegar a la pantalla para ingresar el resultado
    navigation.navigate("SitUpTestRes", {pushUpCount: route.params.pushUpCount});
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.33}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>3 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Prueba de abdomen y estabilidad</Text>
        <Text  style={styles.sectionStyleTitle}>Explicación de la prueba:</Text>
        <Text  style={styles.sectionStyle}>
        Esta prueba consiste en realizar la mayor cantidad de repeticiones posibles de abdominales en un minuto
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionStyleTitle}>Ejecución del ejercicio:</Text>
          <Text  style={styles.sectionStyle}>
          El usuario debe acostarse en el suelo en posición supina con las rodillas dobladas en un ángulo de 45 grados. Los pies deben colocarse a aproximadamente a 30 centímetros de distancia y los dedos entrelazados detrás de la cabeza. El talón tiene que estar en contacto con el suelo. La prueba termina cuando termina el minuto.
          </Text>
          <Text style={styles.sectionStyleTitle}>
          Detalles de la prueba:
          </Text>
        <Text  style={styles.sectionStyle}>
        Se le proporcionará un cronómetro al usuario que va a tener que accionar cuando quiera comenzar la prueba. Una vez accionado el cronómetro comenzará a correr y se detendrá automáticamente cuando llegue a un minuto. Si por algún motivo el usuario no logra concretar la prueba en su totalidad, tendrá la opción de repetir prueba, y esto volverá a accionar el cronómetro igualmente hasta un minuto.
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 18,
    textAlign: "center",
  },
  sectionStyle:{
    fontSize: 18,
    marginBottom: 15,
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
