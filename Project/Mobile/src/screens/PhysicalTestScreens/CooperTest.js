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
import {workoutSession} from './CALENTAMIENTO_DATA';


const CooperTestScreen = ({ navigation, route }) => {
  const handleWarmUp = () => {
    navigation.navigate("Calentamiento", {workoutSession: workoutSession});
  }
  const handleContinue = () => {
    // Navegar a la pantalla para ingresar el resultado
    navigation.navigate("CooperIn",  { pushUpCount: route.params.pushUpCount, SitUpCount: route.params.SitUpCount });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.66}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>6 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test de Cooper</Text>
        <Text style={styles.sectionStyleTitle}>Explicación de la prueba:</Text>
        <Text style={styles.sectionStyle}>
          Corra la mayor cantidad de distancia durante 12 minutos.
          La prueba de carrera de 12 minutos de Cooper requiere que la persona
          sometida a la prueba corra o camine lo más lejos posible en un periodo
          de 12 minutos. El objetivo de la prueba es medir la distancia máxima
          recorrida por el individuo durante el período de 12 minutos y
          generalmente se realiza en una pista de atletismo, pero también puede
          ser realizada en una caminadora, para que, al medir la distancia,
          resulte más fácil.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionStyleTitle}>
          Factores a tomar en cuenta:
        </Text>
        <Text style={styles.sectionStyle}>
          Distancia: El usuario registra el número total de millas o kilómetros
          que recorrió en 12 minutos.
        </Text>
        <Text style={styles.sectionStyle}>
          Equipo: El usuario necesitará un cronómetro en caso de estar corriendo
          en una pista, para saber cuándo han transcurrido 12 minutos.
        </Text>
        <Text style={styles.sectionStyle}>
          Ubicación: Esta prueba está diseñada para realizarse en una pista con
          la distancia claramente marcada. El usuario puede realizar la prueba
          en una cinta de correr.
        </Text>
        <Text style={styles.sectionStyle}>
          Seguridad: Esta es una prueba de condición física extenuante y se
          recomienda que tenga la autorización de su médico antes de realizarla
          por su cuenta.
        </Text>
        <Text style={styles.sectionStyle}>
          Velocidad: Cuando el usuario haya calentado, corre o camina lo más
          lejos que pueda en 12 minutos.
        </Text>
        <Text style={styles.sectionStyle}>
          Calentamiento: El usuario debe realizar un breve calentamiento de 10 a
          15 minutos de actividad extenuante de baja a moderada antes de
          realizar cualquier prueba de condición física.
        </Text>
        <TouchableOpacity onPress={handleWarmUp}>
        <Text style={styles.linkText}>
          Realizar calentamiento
        </Text>
      </TouchableOpacity>
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
  linkText: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  sectionStyle: {
    fontSize: 16,
    marginBottom: 10,
  },
  sectionStyleTitle: {
    fontSize: 20,
    marginBottom: 0,
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

export default CooperTestScreen;
