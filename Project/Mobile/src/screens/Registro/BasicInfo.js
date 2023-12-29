import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';


const FirstPageForm = ({ navigation, route }) => {
  const { name, givenName, surname, emails} = route.params;
  const email = emails[0]; // Obtiene el primer correo electrónico de la lista
  console.log("Datos del usuario:", name, givenName, surname, email);


  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');


  const handleContinue = async () => {
    if (!name || !givenName || !surname || !email || !dateOfBirth || !height || !weight || !gender) {
      console.error('Por favor, completa todos los campos');
      return;
    }
    try {
      const response = await fetch('http://192.168.100.30:3001/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          givenName: givenName,
          surname: surname,
          email: email,
          // Otros datos ingresados por el usuario
          dateOfBirth: dateOfBirth.toISOString().split('T')[0],
          height: height,
          weight: weight,
          gender: gender,
          // Otros datos ingresados por el usuario
        }),
      });
  
      if (response.ok) {
        // La solicitud fue exitosa, puedes navegar a la siguiente pantalla o realizar alguna acción adicional
        navigation.navigate('TimeAndDaysForm');
      } else {
        // Manejar errores si la solicitud no fue exitosa
        console.error('Error al guardar los datos');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  const openDatePicker = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        mode: 'spinner', // Cambia el modo de selección de fecha
        date: new Date(),
      });

      if (action !== DatePickerAndroid.dismissedAction) {
        // El usuario seleccionó una fecha
        const selectedDate = new Date(year, month, day);
        setDateOfBirth(selectedDate.toISOString().split('T')[0]); // Formato YYYY-MM-DD
      }
    } catch ({ code, message }) {
      console.warn('Error al abrir el selector de fecha:', message);
    }
  };

  const handleGenderChange = (text) => {
    // Permitir solo 'H' o 'M' en el campo de género
    const sanitizedText = text.toUpperCase().replace(/[^HM]/g, '');
    setGender(sanitizedText);
  };

  const handleHeightChange = (text) => {
    // Permitir solo números y un solo punto para la estatura
    const sanitizedText = text.replace(/[^0-9.]/g, '');
    setHeight(sanitizedText);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.label}>Fecha de Nacimiento:</Text>
        <Text style={styles.dateText}>
          {dateOfBirth.toISOString().split('T')[0] || 'Seleccionar Fecha'}
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

      <Text style={styles.label}>Estatura:</Text>
      <TextInput
        style={styles.input}
        placeholder="Estatura (cm)"
        value={height}
        onChangeText={handleHeightChange}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Peso:</Text>
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Sexo:</Text>
      <TextInput
        style={styles.input}
        placeholder="Sexo (H/M)"
        value={gender}
        onChangeText={handleGenderChange}
        maxLength={1}
      />

      <Button title="Guardar datos" onPress={handleContinue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  datePicker: {
    width: '100%',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: 'black',
  },
});

export default FirstPageForm;
