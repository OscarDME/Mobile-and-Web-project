import React, { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  useAuthRequest,
  useAutoDiscovery,
} from 'expo-auth-session';
import { Button, Text, SafeAreaView } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery(
    'https://login.microsoftonline.com/common/v2.0',
  );
  
  /**
   * Generates a redirect URI for authentication using Expo's makeRedirectUri. 
   * The redirect URI contains the scheme and path that will be used 
   * after authentication is complete.
  */
  const redirectUri = makeRedirectUri({
    scheme: 'FitHub',
    path: 'auth',
  });

  const clientId = '397efb78-e816-419e-aa9f-71b4a475de92';

  // We store the JWT in here
  const [token, setToken] = useState(null);

  // Request
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['openid', 'profile', 'email', 'offline_access'],
      redirectUri,
    },
    discovery,
  );

  useEffect(() => {
    const handleCodeExchange = async (codeResponse) => {
      if (request && codeResponse?.type === 'success' && discovery) {
        const res = await exchangeCodeAsync(
          {
            clientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
            redirectUri,
          },
          discovery,
        );
        setToken(res.accessToken);
      }
    };

    promptAsync().then(handleCodeExchange);
  }, [request, discovery, redirectUri, clientId]);

  return (
    <SafeAreaView>
      <Button
        disabled={!request}
        title="Inicia Sesion"
        onPress={() => {}}
      />
      <Text>{token}</Text>
    </SafeAreaView>
  );
}