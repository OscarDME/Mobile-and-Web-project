import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Rating } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from "../../utils/conf";
import { FIRESTORE_DB } from "../../../FirebaseConfig"; 
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";


const TrainerDetailsScreen = ({ route }) => {
  const { trainer } = route.params;

  const checkIfRequestAlreadyExists = async (senderId, receiverId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/checkrequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderOID: senderId,
          receiverID: receiverId,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      return result.exists; // Asume que la API devuelve un objeto con una propiedad 'exists' que es un booleano
    } catch (error) {
      console.error('Error checking for existing request:', error);
      return false; // En caso de error, supone que no existe una solicitud para no bloquear la creación
    }
  };

  const createRequest = async () => {
    const userID = await AsyncStorage.getItem('userOID');
    if (!userID) throw new Error("El ID de usuario no está disponible");
    const requestExists = await checkIfRequestAlreadyExists(trainer.ID_Usuario_WEB, userID);
      if (requestExists) {
        alert("Ya existe una solicitud pendiente entre ustedes. Por favor, espera a que el otro usuario responda.");
        return; // Detiene la ejecución si ya existe una solicitud pendiente
      }
      console.log("No existe una solicitud pendiente.");
    try {
      // Obtener el ID del usuario actual del almacenamiento
      const response = await fetch(`${config.apiBaseUrl}/crearSolicitud`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID_Usuario_WEB: trainer.ID_Usuario_WEB,
          ID_Usuario: userID,
        }),
      });

      const data = await response.json();

      // Mostrar alerta de éxito o error según la respuesta
      if (response.ok) {
        Alert.alert("Solicitud Creada", "Tu solicitud ha sido creada con éxito.");
        console.log("Id user:", userID);
        console.log("Id trainer:", trainer.ID_Usuario);
        await createConversation(userID, trainer.ID_Usuario);
      } else {
        Alert.alert("Error", data.message || "No se pudo crear la solicitud.");
      }
    } catch (error) {
      console.error('Error al crear la solicitud:', error);
      Alert.alert("Error", "Ha ocurrido un error al crear la solicitud.");
    }
  };


  const createConversation = async (senderId, receiverId) => {
    try {
      const newConversationRef = doc(collection(FIRESTORE_DB, 'conversaciones'));
      console.log("Sender ID:", senderId, "Receiver ID:", receiverId);

      await setDoc(newConversationRef, {
        participantes: [senderId, receiverId],
        creadoEn: serverTimestamp(), 
        modificadoEn: serverTimestamp() 
      });
      console.log(`Conversación creada con éxito con ID: ${newConversationRef.id}`);
    } catch (error) {
      console.error('Error al crear conversación:', error);
      Alert.alert("Error", "Ha ocurrido un error al crear la conversación.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="user-circle-o" size={120} color="#000" style={styles.profileIcon} />
        <Text style={styles.name}>{trainer.nombre} {trainer.apellido}</Text>
        <Text style={styles.type}>{trainer.tipo_usuario_web}</Text>
        <Rating
          imageSize={30}
          readonly
          startingValue={trainer.promedio_calificacion === "Sin calificaciones" ? 5 : parseFloat(trainer.promedio_calificacion)}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.sectionTitle}>¿Quién soy?</Text>
        <Text style={styles.description}>
          {trainer.descripcion || "No hay descripción disponible."}
        </Text>
        <Text style={styles.sectionTitle}>Experiencia laboral</Text>
        <Text style={styles.description}>
          {trainer.experiencia_laboral || "No hay experiencia laboral disponible."}
        </Text>
        <Text style={styles.sectionTitle}>Servicios ofrecidos</Text>
        <Text style={styles.description}>
          {trainer.servicio || "No hay servicios disponibles."}
        </Text>
      </View>
    <TouchableOpacity style={styles.contactButton} onPress={createRequest}>
      <Text style={styles.contactButtonText}>Contactar</Text>
    </TouchableOpacity>
</ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  profileIcon: {
    marginBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
  type: {
    fontSize: 20,
    color: 'gray',
    marginBottom: 8,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 24,
    marginLeft: 16,
  },
  description: {
    fontSize: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  contactButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  details: {
    marginTop: 10,
  },
});

export default TrainerDetailsScreen;
