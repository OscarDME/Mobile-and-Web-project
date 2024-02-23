import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AddSetsScreen = ({ navigation }) => {
  const [sets, setSets] = useState([
    { id: '1', reps: 15, weight: 5 },
    { id: '2', reps: 15, weight: 5 },
    { id: '3', reps: 15, weight: 5 },
  ]);

  const [restTime, setRestTime] = useState('00:00');
  const [isSuperSet, setIsSuperSet] = useState(false);

  const addSet = () => {
    const newSetId = String(sets.length + 1);
    setSets([...sets, { id: newSetId, reps: 0, weight: 0 }]);
  };

  const deleteSet = (setId) => {
    setSets(sets.filter(set => set.id !== setId));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Día 1 - Curl</Text>
        <TouchableOpacity onPress={() => { /* Funcionalidad de guardar */ }}>
          <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.setItem}>
            <TouchableOpacity onPress={() => deleteSet(item.id)}>
              <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <Text style={styles.setText}>Set {item.id}</Text>
              <Text style={styles.setText}>Reps: {item.reps}</Text>
              <Text style={styles.setText}>Peso: {item.weight} kg</Text>
            </View>
            <Ionicons name="reorder-three-outline" size={24} color="black" />
          </View>
        )}
      />

      <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
        <Text style={styles.addSetText}>Añadir nuevo set</Text>
      </TouchableOpacity>

      <View style={styles.switchContainer}>
        <Text style={styles.restLabel}>Descanso: {restTime}</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isSuperSet ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsSuperSet}
          value={isSuperSet}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={styles.superSetLabel}>Hacer superserie con el siguiente ejercicio</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isSuperSet ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsSuperSet}
          value={isSuperSet}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  setText: {
    fontSize: 16,
    color: '#000',
  },
  addSetButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  addSetText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginTop: 20,
  },
  restLabel: {
    fontSize: 18,
    color: '#000',
  },
  superSetLabel: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    marginBottom: 10,
  },
  // Puedes añadir más estilos aquí si es necesario
});


export default AddSetsScreen;
