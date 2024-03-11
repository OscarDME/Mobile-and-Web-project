import { View, Text, Button, FlatList } from 'react-native';
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";
import firestore from '@react-native-firebase/firestore';


const MainMenu = ({ navigation }) => {
  
  const [oid, setOid] = useState("");
  const [conversaciones, setConversaciones] = useState([]);


  
  useEffect(() => {
    AsyncStorage.getItem("userOID")
      .then((value) => {
        if (value !== null) {
          setOid(value);
          console.log("OID obtenido:", value);
          fetchConversaciones(value); // Llama a fetchConversaciones aquí
        }
      })
      .catch((error) => {
        console.error("Error al obtener el OID:", error);
      });
  }, []);
  


  const fetchConversaciones = (oid) => {
    firestore()
      .collection('conversaciones')
      .where('participantes', 'array-contains', oid)
      .orderBy('modificadoEn', 'desc') // Asegúrate de tener un índice para esta consulta en Firestore
      .onSnapshot((querySnapshot) => {
        const conversaciones = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setConversaciones(conversaciones);
      }, (error) => {
        console.log(error);
      });
  };

  
  console.log("OID:", oid);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat</Text>
      <FlatList
        data={conversaciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text onPress={() => navigation.navigate('Chat', { conversationId: item.id })}>
            Conversación con ID: {item.id} - Modificado en: {item.modificadoEn.toDate().toDateString()}
          </Text>
        )}
      />
    </View>
  );
};

export default MainMenu;