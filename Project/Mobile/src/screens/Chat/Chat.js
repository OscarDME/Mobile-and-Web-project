import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig"; 
const Chat = ({ navigation }) => {
  const [conversaciones, setConversaciones] = useState([]);

  useEffect(() => {
    const fetchConversaciones = async () => {
      const oid = await AsyncStorage.getItem("userOID");
      if (oid) {
        const conversacionesRef = collection(FIRESTORE_DB, 'conversaciones');
        const q = query(conversacionesRef, where('participantes', 'array-contains', oid));
  
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const fetchedConversaciones = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setConversaciones(fetchedConversaciones);
        }, (error) => {
          console.error('Error al obtener conversaciones:', error);
        });
  
        // Retorna la función de limpieza que cancela la suscripción
        return () => unsubscribe();
      }
    };
  
    fetchConversaciones();
  }, []); 

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Conversaciones</Text>
      </View>
      <ScrollView
        style={styles.conversacionesContainer}
        showsVerticalScrollIndicator={false}
      >
        {conversaciones.map((conversacion) => (
          <TouchableOpacity
            key={conversacion.id}
            style={styles.conversacionCard}
            onPress={() =>
              navigation.navigate("UserChat", {
                conversacion: conversacion,
              })
            }
          >
            <Text style={styles.conversacionNombre}>Conversación ID: {conversacion.id}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignSelf: "stretch",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
  },
  conversacionesContainer: {
    alignSelf: "stretch",
  },
  conversacionCard: {
    backgroundColor: "#07c", // Ajusta el color según tu preferencia
    borderRadius: 10,
    marginBottom: 16,
    padding: 20,
  },
  conversacionNombre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  // Agrega más estilos aquí según sea necesario
});

export default Chat;
