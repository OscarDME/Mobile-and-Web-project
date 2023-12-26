import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const FirstPageForm = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('');

  const handleContinue = () => {
    // Aquí podrías guardar los datos ingresados antes de pasar a la siguiente pantalla
    // Por ejemplo: guardar en el estado global, en AsyncStorage, etc.
    // Luego, navegar a la siguiente pantalla del formulario
    navigation.navigate('TimeAndDaysForm');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Edad:</Text>
      <TextInput
        placeholder="Edad"
        value={age}
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric"
      />

      <Text>Estatura:</Text>
      <TextInput
        placeholder="Estatura"
        value={height}
        onChangeText={(text) => setHeight(text)}
        keyboardType="numeric"
      />

      <Text>Peso:</Text>
      <TextInput
        placeholder="Peso"
        value={weight}
        onChangeText={(text) => setWeight(text)}
        keyboardType="numeric"
      />

      <Text>Sexo:</Text>
      <TextInput
        placeholder="Sexo"
        value={gender}
        onChangeText={(text) => setGender(text)}
      />

      <Button title="Continuar" onPress={handleContinue} />
    </View>
  );
};

export default FirstPageForm;
