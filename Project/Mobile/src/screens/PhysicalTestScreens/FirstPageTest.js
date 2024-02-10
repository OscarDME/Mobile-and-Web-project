import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TestScreen = () => {
  const navigation = useNavigation();

  const handleYes = () => {
    // Si el usuario responde que sí, llevarlo a la siguiente pantalla
    navigation.navigate('PushUpsTest');
  };

  const handleNo = () => {
    // Si el usuario responde que no, llevarlo a la pantalla anterior
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>¿Quieres realizar el test de condición física?</Text>
      <View style={styles.buttonsContainer}>
        <Button title="Quiero realizarlo" onPress={handleYes} color="green" />
        <View style={styles.separator} />
        <Button title="Volver" onPress={handleNo} color="red" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  separator: {
    height: 10,
  },
});

export default TestScreen;
