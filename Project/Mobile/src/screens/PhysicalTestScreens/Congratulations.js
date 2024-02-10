import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withSequence, withDelay } from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { ThemedButton } from "react-native-really-awesome-button";


const screenWidth = Dimensions.get('window').width;

const CongratulationsScreen = ({ route, navigation }) => {
  const [condicionFisica, setCondicionFisica] = useState(route.params?.clasificacion || 'Media');
  const [showButton, setShowButton] = useState(false); // Estado para controlar la visibilidad del botón
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);


  const handleContinue = () => {
    navigation.navigate('Questionnaire', {screen: 'PhysicAndSpace'});
  };

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    scale.value = withSequence(withSpring(0.5), withDelay(500, withSpring(1)));
    opacity.value = withSequence(withDelay(500, withSpring(1)));

    // Establece un temporizador para mostrar el botón después de que las animaciones y el confeti hayan terminado
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 4000); // Ajusta este tiempo según sea necesario

    return () => clearTimeout(timer); // Limpia el temporizador si el componente se desmonta
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, animatedStyles]}>
        <Text style={styles.title}>¡Felicidades!</Text>
        <Text style={styles.message}>Tu nivel de condición física es "{condicionFisica}".</Text>
      </Animated.View>
      <ConfettiCannon count={200} origin={{ x: -10, y: 0 }} />

      {showButton && (
        <View style={styles.buttonContainer}>
        <ThemedButton
          name="bruce"
          type="primary"
          onPress={handleContinue}
          backgroundColor="#0790cf"
          backgroundDarker="#0790cf"
          borderColor="#0790cf"
          height={55}
          width={250}
          textSize={18}
        >
        Regresar
        </ThemedButton>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  card: {
    width: screenWidth * 0.8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CongratulationsScreen;
