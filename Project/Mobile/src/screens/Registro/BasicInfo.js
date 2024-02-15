import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedButton } from "react-native-really-awesome-button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../utils/conf";

const FirstPageForm = ({ navigation, route }) => {
  const { oid, name, givenName, surname, emails } = route.params;

  const email = emails[0];
  console.log("Datos del usuario:", oid, name, givenName, surname, email);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [selectedGender, setSelectedGender] = useState("");
  const [genderError, setGenderError] = useState("");


  const handleContinue = async () => {
  await AsyncStorage.setItem('oid', oid);
    if (
      !oid ||
      !name ||
      !givenName ||
      !surname ||
      !email ||
      !dateOfBirth ||
      !selectedGender
    ) {
      if (!selectedGender) {
        setGenderError("Por favor, selecciona tu género.");
      }
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oid: oid,
          name: name,
          givenName: givenName,
          surname: surname,
          email: email,
          dateOfBirth: dateOfBirth.toISOString().split("T")[0],
          gender: selectedGender,
        }),
      });

      if (response.ok) {
        navigation.replace("Questionnaire", {
          screen: "FirstPageForm",
          params: { oid: oid },
        });
      } else {
        console.error("Error al guardar los datos");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
    setGenderError("");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.datePicker}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.label}>Fecha de Nacimiento:</Text>
        <Text style={styles.dateText}>
          {dateOfBirth.toISOString().split("T")[0] || "Seleccionar Fecha"}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
      <View style={styles.genderButtons}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === "H" && styles.selectedMale,
          ]}
          onPress={() => handleGenderChange("H")}
        >
          <Text style={[
    styles.genderButtonText,
    selectedGender === "H" ? styles.selectedGenderText : {},
  ]}>Hombre</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton,
            selectedGender === "M" && styles.selectedFemale,
          ]}
          onPress={() => handleGenderChange("M")}
        >
          <Text style={[
    styles.genderButtonText,
    selectedGender === "M" ? styles.selectedGenderText : {},
  ]}
>Mujer</Text>
        </TouchableOpacity>
      </View>

      <ThemedButton
        name="bruce"
        type="primary"
        onPress={handleContinue}
        backgroundColor="#0790cf"
        backgroundDarker="#0790cf"
        borderColor="#0790cf"
        height={55}
        textSize={18}
        style={styles.button}
      >
        Continuar
      </ThemedButton>
      {genderError ? <Text style={styles.errorText}>{genderError}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  datePicker: {
    width: "100%",
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    paddingBottom: 20,
  },
  dateText: {
    fontSize: 28,
    color: "black",
  },
  label: {
    marginTop: 30,
    fontSize: 25,
    fontWeight: "bold",
  },
  genderButtons: {
    flexDirection: "row",
    marginTop: 80,
  },
  selectedGenderText: {
    color: "white", // Cambia el color del texto a blanco
  },
  genderButton: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  selectedMale: {
    backgroundColor: "#0790cf",
    borderColor: "#0790cf",
  },
  selectedFemale: {
    backgroundColor: "pink",
    borderColor: "pink",
  },
  genderButtonText: {
    fontSize: 24,
    color: "black",
    fontWeight: "bold",
  },
  button: {
    marginTop: 80,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },
});

export default FirstPageForm;
