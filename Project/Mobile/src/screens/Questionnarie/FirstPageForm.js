import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ThemedButton } from "react-native-really-awesome-button";

const ConfirmScreen = ({ navigation, route }) => {
  const { oid } = route.params;

  const handleYes = () => {
    navigation.navigate("TimeAndDaysForm", { oid: oid });
  };

  const handleNo = () => {
    navigation.replace("Main", {
      screen: "MainMenu",
      params: { oid: oid },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>
        ¿Deseas completar el formulario de rutina personalizada?
      </Text>
      <View style={styles.buttonContainer}>
        <ThemedButton
          name="bruce"
          type="primary"
          onPress={handleYes}
          backgroundColor="#e75050"
          backgroundDarker="#e75050"
          borderColor="#e75050"
          height={55}
          width={250}
          textSize={18}
        >
          Realizar
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
          Omitir
        </ThemedButton>
      </View>
      <Text style={styles.note}>
        Observación: La información recolectada en el formulario de registro se emplea tanto en la elaboración de rutinas personalizadas como en la optimización continua de esta aplicación.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 40,
  },
  note: {
    marginTop: 50,
    paddingHorizontal: 20,
    color: "gray",
    textAlign: "center",
  },
});

export default ConfirmScreen;
