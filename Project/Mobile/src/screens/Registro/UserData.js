import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, Button } from "react-native";
import { decode as atob } from 'base-64';

const UserData = ({ navigation }) => {
  const route = useRoute();
  const token = route.params?.token;

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1];
      const decodedToken = JSON.parse(atob(payload));
      return decodedToken;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const [tokenData, setTokenData] = useState(null);

  useEffect(() => {
    if (token) {
      const decodedToken = decodeToken(token);
      setTokenData(decodedToken);
      console.log("Token decodificado:", decodedToken);
    }
  }, [token]);

  const handleContinue = () => {
      navigation.navigate("BasicInfoForm", {
      name: tokenData ? tokenData.name : "",
      givenName: tokenData ? tokenData.given_name : "",
      surname: tokenData ? tokenData.family_name : "",
      emails: tokenData ? tokenData.emails : "",
      // Otros parámetros que desees pasar
    });  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18 }}>
      Tus datos:{"\n"}
        Nombre de usuario: {tokenData ? tokenData.name : "No disponible"} {"\n"}
        Nombre: {tokenData ? tokenData.given_name : "No disponible"} {"\n"}
        Apellido: {tokenData ? tokenData.family_name : "No disponible"} {"\n"}
        Correo: {tokenData ? tokenData.emails : "No disponible"} {"\n"}
      </Text>
      <Button title="Continuar" onPress={handleContinue} />
    </View>
  );
};

export default UserData;
