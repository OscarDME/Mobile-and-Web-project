import React, { useState, useEffect } from "react";
import { useRoute } from '@react-navigation/native';
import { View, Text, Button, StyleSheet } from "react-native";
import { decodeToken } from '../../navigators/navigationRoutes';
import { ThemedButton } from "react-native-really-awesome-button";

const UserData = ({ navigation }) => {
  const route = useRoute();
  const token = route.params?.token;

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
      oid: tokenData ? tokenData.oid : "",
      name: tokenData ? tokenData.name : "",
      givenName: tokenData ? tokenData.given_name : "",
      surname: tokenData ? tokenData.family_name : "",
      emails: tokenData ? tokenData.emails : "",
      // Otros parámetros que desees pasar
    });  };

    return (
      <View style={styles.container}>
        <View style={styles.dataBox}>
          <Text style={styles.dataText}>
            Estos son tus datos:{"\n\n"}
            <Text style={styles.boldText}>Nombre de usuario:</Text> {tokenData ? tokenData.name : "No disponible"} {"\n\n"}
            <Text style={styles.boldText}>Nombre:</Text> {tokenData ? tokenData.given_name : "No disponible"} {"\n\n"}
            <Text style={styles.boldText}>Apellido:</Text> {tokenData ? tokenData.family_name : "No disponible"} {"\n\n"}
            <Text style={styles.boldText}>Correo:</Text> {tokenData ? tokenData.emails : "No disponible"} {"\n"}
          </Text>
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
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    dataBox: {
      backgroundColor: "#fff",
      padding: 20,
      borderRadius: 10,
      elevation: 3,
      marginBottom: 20,
    },
    dataText: {
      fontSize: 20,
      lineHeight: 24,
    },
    boldText: {
      fontWeight: "bold",
    },
    button: {
      marginTop: 20,
    },
  });
  
  export default UserData;