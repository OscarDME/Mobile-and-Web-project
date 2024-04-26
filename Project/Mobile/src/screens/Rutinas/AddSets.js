import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import config from "../../utils/conf";

const AddSetsScreen = ({ navigation, route }) => {
  const [sets, setSets] = useState([]);
  const [error, setError] = useState('');
  const [datosCargados, setDatosCargados] = useState(false);


  const ID_Modalidad = route.params.ID_Modalidad
  const { exerciseId } = route.params.ID_EjerciciosDia;
  const [bloqueSets, setBloqueSets] = useState({
    ID_EjerciciosDia: route.params.ID_EjerciciosDia, // Asume que este es el ID del ejercicio del día
    ConjuntoSeries: [] // Aquí irán los conjuntos de series, incluyendo los dropset
  });

 

  useEffect(() => {
    const cargarSetsExistentes = async () => {
      const url = `${config.apiBaseUrl}/sets/${bloqueSets.ID_EjerciciosDia}`;
      try {
        const respuesta = await fetch(url);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          const setsInicializados = datos.map((set, index) => ({
            id: String(index + 1), // Generamos un ID representativo basado en el índice
            reps: set.repeticiones,
            weight: set.peso !== null ? set.peso : 0,  // Asegura que el peso no sea null
            tiempo: set.tiempo,
            dropSet: set.subsets.length > 0, // Si tiene subsets, es un dropset
            subsets: set.subsets.map((subset, subsetIndex) => ({
              id: `D${index + 1}-${subsetIndex + 1}`, // ID representativo para el subset
              reps: subset.repeticiones,
              weight: subset.peso,
            })),
          }));
          setSets(setsInicializados);
          setDatosCargados(true);
        } else if (respuesta.status === 404) {
          console.log('No se encontraron sets para este ejercicio.');
          if (ID_Modalidad === 3) {
            setSets([{ id: `set-${Date.now()}`, tiempo: 0, reps: null, weight: null }]);
          }
          setDatosCargados(false);        }
        else {
          setDatosCargados(false);
          console.error('Respuesta no exitosa:', respuesta);
        }
      } catch (error) {
        console.error('Error al cargar sets existentes:', error);
      }
    };
  
    cargarSetsExistentes();
  }, [bloqueSets.ID_EjerciciosDia]);
  
  

  const addSet = () => {
    const newSetId = String(sets.length + 1);
    setSets([
      ...sets,
      { id: newSetId, reps: 0, weight: 0, tiempo:0, dropSet: false, subsets: [] },
    ]);
  };

  const deleteSet = (setId) => {
    setSets(sets.filter((set) => set.id !== setId));
  };

  const toggleDropSet = (setId) => {
    const setIndex = sets.findIndex((set) => set.id === setId);
    if (sets[setIndex].dropSet === false) {
      // Solo agrega un nuevo subset si dropSet es falso
      addSubSet(setId);
    }
    // No elimina el dropset si ya existe, solo cambia su estado
    setSets(
      sets.map((set, index) =>
        index === setIndex ? { ...set, dropSet: !set.dropSet } : set
      )
    );
  };



  // Función para manejar la adición de un subset a un dropset
  const addSubSet = (setId) => {
    setSets(sets.map((set) => {
      if (set.id === setId) {
        const newSubsetId = `D${setId}-${set.subsets.length + 1}`;
        const newSubsets = [
          ...set.subsets,
          { id: newSubsetId, reps: '', weight: '' }
        ];
        return { ...set, subsets: newSubsets, dropSet: true };
      }
      return set;
    }));
  };
  const updateSet = (setId, field, value) => {
    setSets(sets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          [field]: value,
          subsets: set.subsets // Asumiendo que no necesitas modificar los subsets aquí
        };
      }
      return set;
    }));
  };
  
  const updateSubSet = (setId, subSetId, field, value) => {
    setSets(sets.map(set => {
      if (set.id === setId) {
        return {
          ...set,
          subsets: set.subsets.map(subset => {
            if (subset.id === subSetId) {
              return {
                ...subset,
                [field]: value
              };
            }
            return subset;
          })
        };
      }
      return set;
    }));
  };
  
  const convertirMinutosAHoras = (minutos) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    // Asumiendo que el tiempo de ejercicio no superará las 24 horas, no se consideran los días
    return `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:00`;
  };
    

  // Eliminar un subset específico
  const deleteSubSet = (setId, subSetId) => {
    setSets(
      sets.map((set) => {
        if (set.id === setId) {
          return {
            ...set,
            subsets: set.subsets.filter((subset) => subset.id !== subSetId),
          };
        }
        return set;
      })
    );
  };

  const saveSetsToDatabase = async () => {
    let todosTienenDatosValidos;

  if (ID_Modalidad === 3) { // Para ejercicios cardiovasculares
    // Aquí, solo necesitas verificar que el tiempo esté establecido correctamente.
    todosTienenDatosValidos = sets.every(set => set.tiempo > 0);
  } else { // Para ejercicios de fuerza
    todosTienenDatosValidos = sets.every(set => 
      set.reps > 0 && 
      (set.subsets.length === 0 || set.subsets.every(subset => subset.reps > 0))
    );
  }

  if (!todosTienenDatosValidos) {
    setError('Todos los sets deben tener los datos correctamente asignados.');
    return; // Detiene la ejecución si no se cumplen las condiciones
  }

    // Restablecer mensaje de error si la validación es exitosa
    setError('');    
    const data = {
      ID_EjerciciosDia: bloqueSets.ID_EjerciciosDia,
      series: sets.map(set => ({
        ID_Series: set.id, // Asumiendo que este ID es único y generado previamente o será ignorado en el backend
        reps: set.reps,
        weight: set.weight,
        tiempo: convertirMinutosAHoras(set.tiempo),
        dropSet: set.dropSet,
        subsets: set.subsets ? set.subsets.map(subset => ({ 
          reps: subset.reps,
          weight: subset.weight
        })) : [] 
      }))
    };
    console.log(data);
  
    const setsExisten = sets.length > 0;
    const method = datosCargados ? 'PUT' : 'POST';
    const url = `${config.apiBaseUrl}/bloquesets`; 
  
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log('Success:', jsonResponse);
        navigation.goBack();
      } else {
        console.error('Server responded with an error:', response.status);
        // Manejar error de servidor
      }
    } catch (error) {
      console.error('Error sending data to server:', error);
      // Manejar error de conexión
    }
  };

  return (
    <TouchableWithoutFeedback>
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{route.params.ejercicio}</Text>
        <TouchableOpacity
          onPress={saveSetsToDatabase}
        >
          <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {ID_Modalidad === 3 ? (
        <>
      {sets.map((set, index) => (
        <View style={styles.cardioContainer}>
          <Text style={styles.ejercicioText}>Tiempo (minutos)</Text>
          <TextInput
                style={styles.inputn}
                placeholder="Tiempo (min)"
                value={String(set.tiempo)}
                keyboardType="numeric"
                onChangeText={(text) => updateSet(set.id, 'tiempo', text)}
              />
        </View>
        ))}
        </>
      ):(
        <>
      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Set</Text>
        <Text style={styles.tableHeaderText}>Reps</Text>
        <Text style={styles.tableHeaderText}>Peso (kg)</Text>
        <Text style={styles.tableHeaderText}>Acción</Text>
      </View>

      <FlatList
        data={sets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <>
            <View style={styles.setItem}>
              <Text style={styles.setNumber}>{item.id}</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => updateSet(item.id, "reps", text)}
                value={String(item.reps)}
                placeholder="Reps"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.inputw}
                onChangeText={(text) => updateSet(item.id, "weight", text)}
                value={String(item.weight)}
                placeholder="Peso"
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => deleteSet(item.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
              <Text onPress={() => addSubSet(item.id)} style={styles.addDropSetText}>
                Añadir Dropset
              </Text>
            </View>
            {item.dropSet &&
              item.subsets.map((subset, index) => (
                <View key={index} style={styles.subsetItem}>
                  <TextInput
                    style={styles.subsetInput}
                    onChangeText={(text) =>
                      updateSubSet(item.id, subset.id, "reps", text)
                    }
                    value={String(subset.reps)}
                    placeholder="Reps"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.subsetInput}
                    onChangeText={(text) =>
                      updateSubSet(item.id, subset.id, "weight", text)
                    }
                    value={String(subset.weight)}
                    placeholder="Peso"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    onPress={() => deleteSubSet(item.id, subset.id)}
                    style={styles.deleteSubSetButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
          </>
        )}
      />
      {error !== '' && (
        <Text style={styles.errorMessage}>{error}</Text>
      )}
      <TouchableOpacity style={styles.addButton} onPress={addSet}>
        <Text style={styles.addButtonText}>Agregar nuevo set</Text>
      </TouchableOpacity>
      </>
      )}
    </View>
    </TouchableWithoutFeedback>
  );
};

// Añade los estilos para los nuevos componentes aquí. Asegúrate de incluir estilos para los inputs, y botones de agregar y quitar dropsets y subsets.

const styles = StyleSheet.create({
  inputn: {
  fontSize: 16,
  marginLeft: 70,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  inputw:{
   flex: 1,
    borderWidth: 0,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    padding: 8,
    marginRight: 88,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tableHeaderText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  addDropSetText: {
    color: "#007bff",
    textAlign: "center",
    fontWeight: "bold",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  subsetItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#d6d8db", // Un gris más oscuro para los subsets
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 16,
    marginTop: 4,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  repsWeight: {
    fontSize: 16,
  },
  cardioContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  ejercicioText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    color: "#000", // Esto asegura que el texto sea negro
    flex: 1,
    borderWidth: 0,
    borderColor: "#e0e0e0",
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
    marginLeft: 38,
    textAlign: "center",
  },
  setItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 10,
    margin: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  repsWeight: {
    width: "20%",
    textAlign: "center",
    marginLeft: 40,
  },
  setText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dropSetText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "bold",
    padding: 8,
  },


  deleteButton: {
    position: 'absolute',
    left: 330,
    top: 10,
    zIndex: 1, // Asegúrate de que esté por encima de otros elementos
  },

  // Estilo para el botón de agregar dropset, asegurando que no se superponga con el botón de eliminar
  addDropSetText: {
    color: '#007bff',
    fontWeight: 'bold',
    padding: 5,
    position: 'absolute',
    left:290,
    top: 35, // Posición vertical
  },

  setDetails: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  
  subsetInput: {
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 5,
    padding: 8,
    width: "40%",
  },
  dropSetButton: {
    marginTop: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    padding: 10,
  },
  addButton: {
    backgroundColor: "#D8F2FE",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },
  dropSetText: {
    // ... (estilos para el texto de agregar/quitar dropset)
    marginRight: 10,
  },
  dropSetActive: {
    color: "#ff0000", // Color cuando está activo
  },
  subsetNumber: {
    width: "20%",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
    color: "#007bff", // Color distinto para identificar el dropset
  },
  deleteSubSetButton: {
    // Estilos para el botón de eliminar subset
  },
  errorMessage: {
    color: 'red', // Color del mensaje de error
    textAlign: 'center', // Centrar texto
    margin: 10, // Margen para separarlo de otros elementos
  },
  addSubSetButton: {
    // Estilos para el botón de agregar subset
    backgroundColor: "#007bff", // Color que prefieras para el botón
  },
});

export default AddSetsScreen;
