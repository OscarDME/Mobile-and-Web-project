import * as WebBrowser from "expo-web-browser";
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from "expo-auth-session";

import { useNavigation } from "@react-navigation/native";
import { Button, View, Text, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";

const Login = () => {
  const navigation = useNavigation();

  WebBrowser.maybeCompleteAuthSession();

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

        // En el componente Login, después de obtener y establecer el token
        navigation.navigate("Validation", {screen: 'WelcomeScreen', params: {token: res.idToken}});
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
      <View style={{ marginBottom: 20 }}>
        <Button
          disabled={!request}
          title="Inicia Sesion"
          onPress={handleLoginPress}
        />
        <Button disabled={!token} title="Logout" onPress={handleLogoutPress} />
      </View>
      {/* <Text style={{ fontSize: 18 }}>Token: {token}</Text> */}
    </SafeAreaView>
  );
};

export default Login;