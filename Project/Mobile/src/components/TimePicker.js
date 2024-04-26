import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const TimePicker = ({ onChange }) => {
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(0);

  const handleHourChange = (newHours) => {
    if (newHours >= 1 && newHours <= 2) {
      setHours(newHours);
      onChange({ hours: newHours, minutes });
    } else {
      Alert.alert("Límite de horas", "Solo puedes seleccionar menos de tres horas.");
    }
  };

  const handleMinuteChange = (newMinutes) => {
    if (newMinutes >= 0 && newMinutes <= 59) {
      setMinutes(newMinutes);
      onChange({ hours, minutes: newMinutes });
    } else {
      Alert.alert("Límite de minutos", "Los minutos deben estar entre 0 y 59.");
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>¿Cuántas horas al día puedes dedicar al entrenamiento?</Text>
      <View style={styles.row}>
        <View style={styles.timeSection}>
          <Text style={styles.label}>Horas</Text>
          <View style={styles.timeRow}>
            <TouchableOpacity onPress={() => handleHourChange(hours - 1)} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{hours}</Text>
            </View>
            <TouchableOpacity onPress={() => handleHourChange(hours + 1)} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.timeSection}>
          <Text style={styles.label}>Minutos</Text>
          <View style={styles.timeRow}>
            <TouchableOpacity onPress={() => handleMinuteChange(minutes - 1)} style={styles.button}>
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{minutes.toString().padStart(2, '0')}</Text>
            </View>
            <TouchableOpacity onPress={() => handleMinuteChange(minutes + 1)} style={styles.button}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70,
    marginTop: 90,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  instruction: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 40,
  },
  timeSection: {
    alignItems: 'center',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
  },
  timeContainer: {
    minWidth: 40,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  time: {
    fontSize: 28,
  },
  button: {
    padding: 5,
    borderRadius: 5,
    borderColor: 'black',
    borderWidth: 1,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 18,
  },
});

export default TimePicker;
