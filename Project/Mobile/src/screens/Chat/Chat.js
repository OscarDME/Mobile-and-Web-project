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
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig"; 
import * as Notifications from 'expo-notifications';
import config from "../../utils/conf";


const Chat = ({ navigation }) => {
  const [conversaciones, setConversaciones] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  

  useEffect(() => {
    const fetchConversaciones = async () => {
      const oid = await AsyncStorage.getItem("userOID");
      if (oid) {
        const conversacionesRef = collection(FIRESTORE_DB, 'conversaciones');
        const q = query(conversacionesRef, where('participantes', 'array-contains', oid));
  
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          let fetchedConversaciones = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Filtrar el oid del usuario actual para obtener el OID del otro participante
            const otroParticipanteOID = data.participantes.filter(participanteOID => participanteOID !== oid);
            return {
              id: doc.id,
              otroParticipanteOID: otroParticipanteOID[0], // Asumiendo que siempre hay dos participantes
              ...data,
            };
          });
          // Ordenar las conversaciones por 'modificadoEn' de forma descendente
          fetchedConversaciones.sort((a, b) => b.modificadoEn.toDate() - a.modificadoEn.toDate());
          const userInfoTemp = {};
          for (const conversacion of fetchedConversaciones) {
            console.log("Intentando obtener info del usuario", conversacion.otroParticipanteOID, oid);
            const userResponse = await fetch(`${config.apiBaseUrl}/getChatInfo/${conversacion.otroParticipanteOID}/${oid}`);
            const userData = await userResponse.json();
            const user = userData.recordset[0];
            console.log("Obtenido info del usuario", userData);
            userInfoTemp[conversacion.otroParticipanteOID] = user;
          }
  
          // Set states after all data is fetched
          setConversaciones(fetchedConversaciones);
          setUserInfo(userInfoTemp);
          
        }, (error) => {
          console.error('Error al obtener conversaciones:', error);
        });
  
        // Retorna la función de limpieza que cancela la suscripción
        return () => unsubscribe();
      }


    };
  
    fetchConversaciones();
  }, []);

  const getUserInfo = async (entrenadorId) => {
    const userID = await AsyncStorage.getItem('userOID');
    if (!userID) throw new Error("El ID de usuario no está disponible");

    try {
      // Obtener el ID del usuario actual del almacenamiento
      const response = await fetch(`${config.apiBaseUrl}/getChatInfo/${entrenadorId}/${userID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

    } catch (error) {
      console.error('Error al crear la solicitud:', error);
    }
  };
  

  const eliminarConversacion = async (conversacionId) => {
    try {
      await deleteDoc(doc(FIRESTORE_DB, 'conversaciones', conversacionId));
      console.log(`Conversación ${conversacionId} eliminada con éxito`);
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
    }
  };


  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Conversaciones</Text>
      </View>
      <ScrollView
        style={styles.conversacionesContainer}
        showsVerticalScrollIndicator={false}
      >
        {conversaciones.map((conversacion) => {
          // Access user info from state
          const user = userInfo[conversacion.otroParticipanteOID] || {};

          return (
            <TouchableOpacity
              key={conversacion.id}
              style={styles.conversacionCard}
              onPress={() =>
                navigation.navigate("UserChat", {
                  conversacion: conversacion,
                })
              }
            >
              <View style={styles.conversationInfo}>
                <Text style={styles.conversacionNombre}>
                  {user.nombre ? 
                  (
                    `${user.tipo_usuario_web} ${user.nombre}`
                  ) : "Cargando..."}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.eliminarBtn}
                onPress={() => eliminarConversacion(conversacion.id)}
              >
              {user.EsCliente !== "sí" && (
                      <TouchableOpacity
                        style={styles.eliminarBtn}
                        onPress={() => eliminarConversacion(conversacion.id)}
                      >
                        <Ionicons name="trash-bin" size={32} color="#E53E3E" />
                      </TouchableOpacity>
                    )}
              </TouchableOpacity>
            </TouchableOpacity>
          );
        })}
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#CCCCCC",
    borderRadius: 10,
    marginBottom: 16,
    padding: 20,
  },
  conversacionNombre: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    fontSize: 18,
    color: "#333333",
  },
  eliminarBtn: {
    justifyContent: "center",
  },
  emph: {
    fontWeight: "bold",
    color: "#333333",
  }
});

export default Chat;
