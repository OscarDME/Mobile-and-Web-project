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

const RockportTestScreen = ({ navigation, route }) => {
    const handleWarmUp = () => {
        //Aqui lo vamos a mandar al calentamiento
    }

  const handleContinue = () => {
    // Navegar a la pantalla para ingresar el resultado
    navigation.navigate("RockportIn",  { pushUpCount: route.params.pushUpCount, SitUpCount: route.params.SitUpCount });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.75}
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
        <Text style={styles.sectionTitle}>Test de Rockport</Text>
        <Text  style={styles.sectionStyleTitle}>Explicación de la prueba:</Text>
        <Text  style={styles.sectionStyle}>
        Esta prueba consiste medir la cantidad de tiempo que una persona se tarda en caminar 1609 metros (alrededor de 4 vueltas en una pista de atletismo) lo más rápido posible en una pista de atletismo o en un caminadora, justo cuando llegue a la meta de 1609 metros (o una milla) se detiene el tiempo y se mide el ritmo cardiaco en un periodo de 15 segundos, después de realizar la prueba, se recomienda caminar por otros 5 minutos para que el ritmo cardiaco de la persona vuelva a su estado de reposo.         </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionStyleTitle}>Factores a tomar en cuenta:</Text>
          <Text  style={styles.sectionStyle}>
            Tiempo: El usuario registra la cantidad de tiempo que le tomó recorrer la milla.
          </Text>
          <Text  style={styles.sectionStyle}>
            Ubicación: Esta prueba está diseñada para realizarse en una pista con la distancia claramente marcada. El usuario puede realizar la prueba en una cinta de correr.
          </Text>
          <Text  style={styles.sectionStyle}>
            Velocidad: Cuando el usuario haya calentado, camina lo rápido que pueda por 1 milla.
          </Text>
          <Text  style={styles.sectionStyle}>
            Calentamiento: El usuario debe realizar un breve calentamiento de 10 a 15 minutos de actividad extenuante de baja a moderada antes de realizar cualquier prueba de condición física.
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
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
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

export default RockportTestScreen;
