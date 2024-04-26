import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Progress from "react-native-progress";
import { AntDesign } from "@expo/vector-icons";

const PushUpResultInputScreen = ({ navigation }) => {
  const [pushUpCount, setPushUpCount] = useState('0');

  const handleIncrement = () => {
    const currentCount = parseInt(pushUpCount, 10);
    if (currentCount < 200) {
      setPushUpCount(String(currentCount + 1));
    } else {
      Alert.alert("Límite alcanzado", "No puedes registrar más de 200 lagartijas.");
    }
  };
  
  const handleDecrement = () => {
    const currentCount = parseInt(pushUpCount, 10);
    setPushUpCount(String(Math.max(currentCount - 1, 0)));
  };
  
  
  const handleContinue = () => {
    const count = parseInt(pushUpCount, 10) || 0;
    
    if (count == null) {
      Alert.alert("Error", "Por favor, introduce un número válido de lagartijas.");
    } else {
      navigation.navigate('SitUpTest', { pushUpCount: count });  };
    }

  // Actualiza el estado solo con valores numéricos
  const handleChangeText = (text) => {
    const numericValue = parseInt(text, 10);
    if (!isNaN(numericValue) && numericValue <= 200) {
      setPushUpCount(String(numericValue));
    } else if (text === '') {
      setPushUpCount('0');
    } else {
      Alert.alert("Límite alcanzado", "No puedes registrar más de 200 lagartijas.");
      setPushUpCount('200');
    }
  };
  
  const handleEndEditing = () => {
    const numericValue = parseInt(pushUpCount, 10);
    if (!isNaN(numericValue) && numericValue <= 200) {
      setPushUpCount(String(numericValue));
    } else {
      setPushUpCount('200'); // Restablece al máximo si el valor es superior al límite
    }
  };
    
  return (
    <View style={styles.container}>
      <View style={styles.progress}>
        <Progress.Bar
          progress={0.22}
          width={null}
          height={30}
          color="#0790cf"
        />
      </View>
      <Text style={styles.pageText}>2 de 8</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>
      <Text style={styles.text}>Selecciona la cantidad de lagartijas realizadas:</Text>
      <View style={styles.selectorContainer}>
        <TouchableOpacity onPress={handleDecrement} style={styles.selectorButton}>
          <AntDesign name="minus" size={34} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.countText}
          value={pushUpCount}
          onChangeText={handleChangeText}
          onEndEditing={handleEndEditing} // Agrega esto
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
    marginTop: 200,
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

export default PushUpResultInputScreen;
