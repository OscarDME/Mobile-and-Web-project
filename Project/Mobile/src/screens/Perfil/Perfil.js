import React from 'react';
import { View, Text, Button } from 'react-native';
import { logout } from '../Inicio/authService';
import { ThemedButton } from "react-native-really-awesome-button";
import { handleLogoutPress } from '../Inicio/login';
import { useNavigation } from '@react-navigation/native';

const MainMenu = ({ route }) => {
  const navigation = useNavigation();

  const handleLogoutButtonPress = () => {
      navigation.replace("Home" , {screen: "Login"});
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Perfil de mierda</Text>
      <ThemedButton
          name ="bruce"
          type="primary"
          onPress={handleLogoutButtonPress}
          backgroundColor = "#0790cf"
          backgroundDarker = "#0790cf"
          borderColor = "#0790cf"
          height={55}
          textSize={18}
        >
          Cerrar Sesión   
        </ThemedButton>
    </View>
  );
};

export default MainMenu;