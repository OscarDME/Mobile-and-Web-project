import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Rating } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import config from "../../utils/conf";

const MainMenu = ({ navigation }) => {
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('Entrenador'); // estado inicial a 'Entrenador'

  const windowWidth = Dimensions.get('window').width;

  const filteredTrainers = trainers.filter(trainer => trainer.tipo_usuario_web === selectedType);

  const handleTypeSelection = (type) => {
    setSelectedType(type);
  };

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/alltrainers`); // Sustituye 'yourApiEndpoint' por tu endpoint real
        if (!response.ok) {
          throw new Error('Network response not ok');
        }
        const data = await response.json();
        console.log(data);
        setTrainers(data);
      } catch (error) {
        console.error('There was an error fetching the trainers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  const TrainerCard = ({ trainer }) => {
    const defaultRating = trainer.promedio_calificacion === "Sin calificaciones" ? 5 : trainer.promedio_calificacion;

    // Agrega esta función
    const navigateToDetails = () => {
      navigation.navigate('DetallesEntre', { trainer }); // Asegúrate de que 'Detalles' es el nombre correcto de la ruta en tu Stack Navigator
    };

    return (
      // Envuelve el contenido de la tarjeta en TouchableOpacity
      <TouchableOpacity onPress={navigateToDetails}>
        <View style={styles.card}>
          <FontAwesome name="user-circle-o" size={60} color="#000" style={styles.profileIcon} />
          <View style={styles.info}>
            <Text style={styles.name}>{trainer.nombre} {trainer.apellido}</Text>
            <Text style={styles.type}>{trainer.tipo_usuario_web}</Text>
            <Rating
              imageSize={20}
              readonly
              startingValue={defaultRating}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.typeContainer}>
        <TouchableOpacity onPress={() => handleTypeSelection('Entrenador')}>
          <Text style={[styles.typeText, selectedType === 'Entrenador' && styles.selectedType]}>
            Entrenadores
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTypeSelection('Nutricionista')}>
          <Text style={[styles.typeText, selectedType === 'Nutricionista' && styles.selectedType]}>
            Nutricionistas
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
      <></>
      ) : (
        <FlatList
          data={filteredTrainers}
          renderItem={({ item }) => <TrainerCard trainer={item} />}
          keyExtractor={item => item}
        />
      )}
    </View>
  );
};
  
  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      padding: 10,
      margin: 10,
      width: '90%',
      backgroundColor: '#fff',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3,
    },
    typeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
    },
    typeText: {
      fontSize: 18,
    },
    selectedType: {
      fontWeight: 'bold',
      textDecorationLine: 'underline',
    },
    profilePic: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#ccc',
    },
    info: {
      marginLeft: 10,
      justifyContent: 'center',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    type: {
      fontSize: 14,
      color: 'gray',
    },
    rating: {
      flexDirection: 'row',
    },
  });  

export default MainMenu;
