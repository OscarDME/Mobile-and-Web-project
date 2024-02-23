import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const MainMenu = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esta mierda es rutinas</Text>
      <Button
        title="Crear rutina"
        onPress={() => navigation.navigate("AddRutina")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  // Aquí puedes agregar más estilos si lo necesitas
});

export default MainMenu;
