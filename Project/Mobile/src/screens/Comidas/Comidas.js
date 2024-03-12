import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Asegúrate de tener esta librería instalada
import config from "../../utils/conf";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';



const MainMenu = ({ navigation }) => {
  const [dietData, setDietData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkedItems, setCheckedItems] = useState(new Set());
  
  const MealTimeItem = ({ data, onCheck }) => {

    const renderItem = (item, index) => {
      const itemId = `${item.ID_Alimento || item.ID_Receta}`; 
      const isChecked = checkedItems.has(itemId);
  
      let content = item.nombre || item.receta; // Usa 'nombre' para alimentos o 'receta' para recetas
      let details = `Porción: ${item.porcion}g`;
  
      if (item.calorias) { // Agrega 'calorias' si el ítem es una receta
        details += ` - Calorías: ${item.calorias}`;
      }
  
      return (
        <TouchableOpacity key={index} style={styles.card} onPress={() => onCheck(item, data.ID_DiasComida)}>
        <View style={styles.cardContent}>
          <Text style={styles.foodName}>{item.nombre || item.receta}</Text>
          <Text style={styles.calories}>{item.calorias ? item.calorias + ' cal' : ''}</Text>
          <Text style={styles.amount}>{item.porcion + 'g'}</Text>
        </View>
        <Icon
          name={isChecked ? "check-circle" : "circle-thin"} // Cambia el icono basado en isChecked
          size={34}
          color={isChecked ? "green" : "#ccc"}
        />
      </TouchableOpacity>
      );
    };
  
    return (
      <View style={styles.mealTimeContainer}>
        {data.alimentos.map(renderItem)}
        {data.recetas.map(renderItem)}    
      </View>
    );
  };
  

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    onDateChange(currentDate); // Llama a la función pasada por props para actualizar el estado en el componente padre
  };

const fetchDietData = async () => {
      try {
        const oid = await AsyncStorage.getItem('userOID');
        if (!oid) {
          console.error('OID not found');
          return;
        }
        const formattedDate = selectedDate.toISOString().split('T')[0];
        const response = await fetch(`${config.apiBaseUrl}/dietaactual/${oid}/${formattedDate}`);
        const { diasComida } = await response.json();
        if (diasComida && diasComida.length > 0) {
          setDietData(diasComida); // Actualiza esto para manejar la estructura correcta
        } else {
          console.log("No hay días de comida para la fecha seleccionada.");
          setDietData([]); // Asegura que dietData esté vacío si no hay datos
        }
      } catch (error) {
        console.error('Error fetching diet data:', error);
      }
    };
  useEffect(() => {
    fetchDietData();
  }, [selectedDate]);

  const handleCheckItem = async (item, dayId) => {
    const oid = await AsyncStorage.getItem('userOID');
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const isChecked = checkedItems.has(itemId);
    const itemId = `${item.ID_Alimento || item.ID_Receta}`; 

    let endpoint;
    let method;
  
    // Define el endpoint y el método HTTP dependiendo de si el ítem está siendo marcado o desmarcado
    if (isChecked) {
      // Si el ítem ya estaba marcado, ahora se está desmarcando, así que usamos un endpoint de eliminación
      endpoint = `${config.apiBaseUrl}/eliminarCompletado`;
      method = 'DELETE';
    } else {
      // Si el ítem está siendo marcado como completado, usamos un endpoint de creación
      endpoint = `${config.apiBaseUrl}/registrocompletado`;
      method = 'POST';
    }

    console.log("esto", item);

    // Prepara los datos a enviar
    const data = {
      ID_Usuario: oid,
      FechaCompletado: formattedDate,
      ID_DiasComida: item.ID_DiasComida,
      PorcionConsumida: item.porcion,
    };

    if ('ID_Alimento' in item) {
      data.ID_Alimento = item.ID_Alimento;
      data.ID_DiasComida = dayId; // Asume que este dato está disponible
  } else if ('ID_Receta' in item) {
      data.ID_Receta = item.ID_Receta;
      data.ID_DiasComida = dayId; // Asume que este dato está disponible
  }

    console.log(data);
  
    
    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
      console.log("Respuesta del servidor: ", responseData);
  
      if (response.ok) {
        console.log('Respuesta exitosa del servidor.');
        setCheckedItems(prev => {
          const updated = new Set(prev);
          if (isChecked) {
            updated.delete(itemId);
          } else {
            updated.add(itemId);
          }
          return updated;
        });
      } else {
        console.error('Respuesta del servidor no fue exitosa: ', responseData);
      }
    } catch (error) {
      console.error('Error al realizar la solicitud: ', error);
    }
  };

  const handleTabSelect = (mealTimeId) => {
    setSelectedMealTime(mealTimeId);
  };

  const handleDateChange = (event, newDate) => {
    setShowDatePicker(false);
    if (newDate) {
      setSelectedDate(newDate);
    }
  };

  const [selectedMealTime, setSelectedMealTime] = useState(1); // null para todos, o '1' para desayuno, '2' para colación, etc.

  const filterByMealTime = (item) => {
    if (selectedMealTime === null) {
      return true; // Si selectedMealTime es null, no se filtra nada
    } else {
      const alimentos = Array.isArray(item.alimentos) ? item.alimentos : [];
      const recetas = Array.isArray(item.recetas) ? item.recetas : [];
      return alimentos.some(alimento => alimento.ID_TiempoComida === selectedMealTime) ||
             recetas.some(receta => receta.ID_TiempoComida === selectedMealTime);
    }
  };
  
  
  const MealTimeTabs = ({ onTabSelect, selectedTab }) => {
    const tabs = [
      { id: 2, label: 'Desayuno' },
      { id: 1, label: 'Colación' },
      { id: 3, label: 'Comida' },
      { id: 4, label: 'Merienda' },
      { id: 5, label: 'Cena' },
    ];
  
    return (
      <View style={styles.mealsBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabSelect(tab.id)}
            style={[styles.mealButton, selectedTab === tab.id && styles.selectedMeal]}
          >
            <Text
              style={[
                styles.mealButtonText,
                selectedTab === tab.id && styles.selectedMealText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>Fecha seleccionada: {selectedDate.toISOString().split('T')[0]}</Text>
      </TouchableOpacity>      
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}      
      <ScrollView>
      <MealTimeTabs onTabSelect={handleTabSelect} selectedTab={selectedMealTime} />
      <FlatList
  data={dietData.filter((item) => filterByMealTime(item))}
  renderItem={({ item }) => (
    <MealTimeItem data={item} onCheck={handleCheckItem} checkedItems={checkedItems} />
  )}
  keyExtractor={(item, index) => String(index)}
/>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calories: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 2,
  },
  amount: {
    fontSize: 14,
    color: '#666',
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  calories: {
    fontSize: 14,
    color: '#666',
  },
  datePicker: {
    margin: 20,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'blue',
    padding: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
  },
  foodItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 20, // Ajuste para hacerlo redondo
  },
  mealsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  mealButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectedMeal: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  mealButtonText: {
    color: 'black',
    fontSize: 16,
  },
  mealTimeContainer: {
    marginBottom: 20,
  },
  mealTimeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemContainer: {
    paddingVertical: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  linkText: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },

});

export default MainMenu;
