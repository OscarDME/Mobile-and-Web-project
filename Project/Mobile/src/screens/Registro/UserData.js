import React from 'react';
import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

const UserData = ({ navigation }) => {
    const handleContinue = () => {
        navigation.navigate('BasicInfoForm'); // Navegar a la siguiente pantalla
      };
    

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Informacion del usuario ajua</Text>
      <Button title="Continuar" onPress={handleContinue} />
    </View>
  );
};

export default UserData;