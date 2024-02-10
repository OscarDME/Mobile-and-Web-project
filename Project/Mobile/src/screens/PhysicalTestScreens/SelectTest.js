import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons"; // Asegúrate de tener instalado '@expo/vector-icons'

const ChooseScreen = ({ navigation, route }) => {
  const { oid } = route.params;

  const handleYes = () => {
    navigation.navigate('Rockport', { pushUpCount: route.params.pushUpCount, SitUpCount: route.params.SitUpCount });
  };

  const handleNo = () => {
    navigation.navigate('Cooper', { pushUpCount: route.params.pushUpCount, SitUpCount: route.params.SitUpCount });
  };

  return (
    <View style={styles.container}>
    <View style={styles.progress}>
        <Progress.Bar
          progress={0.55}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>5 de 8</Text>
     
      <Text style={styles.question}>
        ¿Cuál de las siguientes pruebas de capacidad aeróbica deseas realizar?
      </Text>
      <View style={styles.buttonContainer}>
        <ThemedButton
          name="bruce"
          type="primary"
          onPress={handleYes}
          backgroundColor="#0790cf"
          backgroundDarker="#0790cf"
          borderColor="#0790cf"
          height={55}
          width={250}
          textSize={18}
        >
          Test de Rockport
        </ThemedButton>
      </View>
      <View style={styles.buttonContainer}>
        <ThemedButton
          name="bruce"
          type="primary"
          onPress={handleNo}
          backgroundColor="#0790cf"
          backgroundDarker="#0790cf"
          borderColor="#0790cf"
          height={55}
          width={250}
          textSize={18}
        >
        Test de Cooper
        </ThemedButton>
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
  question: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 110,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
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
});

export default ChooseScreen;
