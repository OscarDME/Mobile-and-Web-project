import * as WebBrowser from "expo-web-browser";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

import { useNavigation } from "@react-navigation/native";
import { Button, View, Text, SafeAreaView, StyleSheet, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { decodeToken } from "../../navigators/navigationRoutes";
import * as Network from "expo-network"; // Importa Expo Network
import { ThemedButton } from "react-native-really-awesome-button";
import { AwesomeButton } from "react-awesome-button";
import Logo from "../../../assets/logo.png"
import config from "../../utils/conf";

const Login = () => {
  const navigation = useNavigation();

  WebBrowser.maybeCompleteAuthSession();
  // const [ipAddress, setIPAddress] = useState(null);

  // // Effect to fetch IPv4 address when component mounts
  // useEffect(() => {
  //   const fetchIP = async () => {
  //     try {
  //       const ip = await Network.getIpAddressAsync(); // Usa Expo Network.getIpAddressAsync()
  //       setIPAddress(ip);
  //     } catch (error) {
  //       console.error('Error obteniendo la dirección IP:', error);
  //     }
  //   };
  //   fetchIP();
  // }, []);

  // Endpoint
  const discovery = useAutoDiscovery(
    "https://FitHubMX.b2clogin.com/FitHubMX.onmicrosoft.com/B2C_1_FitHub_Login/v2.0/"
  );

  /**
   * Generates a redirect URI for authentication using Expo's makeRedirectUri.
   * The redirect URI contains the scheme and path that will be used
   * after authentication is complete.
   */
  const redirectUri = makeRedirectUri({
    scheme: "FitHub",
    path: "auth",
  });

  const clientId = "397efb78-e816-419e-aa9f-71b4a475de92";

  // We store the JWT in here
  const [token, setToken] = useState(null);

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["openid", "profile", "email", "offline_access"],
      redirectUri,
    },
    discovery
  );

  // Define handleCodeExchange outside of useEffect
  const handleCodeExchange = async (codeResponse) => {
    console.log("Code exchange initiated...");
    if (request && codeResponse?.type === "success" && discovery) {
      try {
        const res = await exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
            redirectUri,
          },
          discovery
        );

        console.log("Code exchange successful. Response:", res);
        setToken(res.idToken); // Change here to access the idToken

        const decodedToken = decodeToken(res.idToken); // Decodificar el token aqui
        console.log(decodedToken.name);
        // navigation.navigate("Validation", {screen: 'WelcomeScreen', params: {token: res.idToken}});

        if (decodedToken) {
          const oid = decodedToken.oid;
          console.log(oid);
          console.log("Llegue aqui 4");
          // Asegúrate de obtener el campo correcto del token
          // Verificar si el usuario existe en la base de datos antes de redirigir
          const userExistsResponse = await fetch(
            `${config.apiBaseUrl}/users/${oid}`,
            {
              method: "GET",
            }
          );
          const userExists = await userExistsResponse.text();
          if (userExistsResponse.status === 200) {
            navigation.replace("Main", {
              screen: "MainMenu",
              params: { token: res.idToken },
            });
          } else {
            // El usuario no existe, realizar alguna acción (por ejemplo, mostrar mensaje de error)
            navigation.navigate("Validation", {
              screen: "WelcomeScreen",
              params: { token: res.idToken },
            });
          }
        } else {
          // Manda error
          console.log("Error decoding token :::((((");
        }
      } catch (error) {
        console.error("Error exchanging code for token:", error);
      }
    }
  };

  useEffect(() => {
    if (request) {
      console.log("Authentication request ready.");
      // No need to initiate prompt here. It will be triggered when the button is pressed.
    }
  }, [request, discovery, redirectUri, clientId]);

  const handleLoginPress = () => {
    console.log("Login button pressed. Initiating prompt...");
    promptAsync()
      .then(handleCodeExchange)
      .catch((error) => {
        console.error("Authentication prompt error:", error);
      });
  };

  const handleLogoutPress = () => {
    console.log("Logout button pressed. Clearing token...");
    setToken(null);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ marginBottom: 20, alignItems: "center"}}>
      <Image source={Logo} style={{ width: 250, height: 250, marginBottom: 50,}}  />
        <ThemedButton
          name ="bruce"
          type="primary"
          disabled={!request}
          onPress={handleLoginPress}
          backgroundColor = "#0790cf"
          backgroundDarker = "#0790cf"
          borderColor = "#0790cf"
          height={55}
          textSize={18}
        >
          Acceder
        </ThemedButton>

        {/* <ThemedButton disabled={!token} title="Logout" onPress={handleLogoutPress} /> */}
      </View>
      {/* <Text style={{ fontSize: 18 }}>Token: {token}</Text> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  ThemedButton: {
    activityColor: "#F0F0F0",
  },
});

export default Login;

