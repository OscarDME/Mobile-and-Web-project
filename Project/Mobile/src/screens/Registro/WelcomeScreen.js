import React from 'react';
import { View, Text, Button } from 'react-native';

const WelcomeScreen = ({ navigation, route }) => {
    console.log(route.params);
    const { token } = route.params;
    const handleContinue = () => {
        navigation.navigate('FirstPageForm', { token }); // Navegar a la siguiente pantalla
      };
    

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenido a Fithub</Text>
      <Text>Procederemos a llenar el formulario</Text>
      <Button title="Continuar" onPress={handleContinue} />
    </View>
  );
};

export default WelcomeScreen;