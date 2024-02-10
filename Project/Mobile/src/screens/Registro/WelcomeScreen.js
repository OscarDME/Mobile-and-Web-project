import React, { useState, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

const WelcomeScreen = ({ navigation, route }) => {
  const { token } = route.params;
  const [fadeAnim] = useState(new Animated.Value(0)); // Estado inicial para la opacidad

  useEffect(() => {
    // Animación de entrada: Aparecer suavemente
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000, // Controla la duración de la aparición
      useNativeDriver: true, // Añade esta línea para mejorar el rendimiento
    }).start();

    // Configura un temporizador para la transición a la siguiente pantalla
    const timer = setTimeout(() => {
      // Animación de salida: Desaparecer suavemente
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000, // Controla la duración de la desaparición
        useNativeDriver: true, // Añade esta línea para mejorar el rendimiento
      }).start(() => {
        // Navega a la siguiente pantalla después de la animación de desaparición
        navigation.navigate('FirstPageForm', { token });
      });
    }, 5000); // Espera 5 segundos antes de iniciar la animación de salida

    // Limpieza del temporizador al desmontar el componente
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, token]);

  return (
    <Animated.View // Usar Animated.View
      style={{
        ...styles.container,
        opacity: fadeAnim, // Aplicar la animación de opacidad
      }}
    >
      <Text style={styles.text}>Bienvenido a Fithub</Text>
    </Animated.View>
  );
};

// Estilos básicos para el contenedor y el texto
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 34,
  },
};

export default WelcomeScreen;
