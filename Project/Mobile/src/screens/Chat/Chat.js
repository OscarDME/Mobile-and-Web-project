import { FIRESTORE_DB } from '../../../FirebaseConfig';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const ConversationsScreen = () => {
  const [oid, setOid] = useState('');
  const [conversaciones, setConversaciones] = useState([]);

  useEffect(() => {
    const fetchOIDAndConversations = async () => {
      const storedOID = await AsyncStorage.getItem('userOID'); // Asegúrate de haber almacenado el OID previamente
      if (storedOID) {
        setOid(storedOID);
        fetchConversaciones(storedOID);
      }
    };

    fetchOIDAndConversations();
  }, []);

  const fetchConversaciones = (userOID) => {
    const conversacionesRef = collection(FIRESTORE_DB, 'conversaciones');
    const q = query(conversacionesRef, where('participantes', 'array-contains', userOID));

    onSnapshot(q, (querySnapshot) => {
      const fetchedConversaciones = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setConversaciones(fetchedConversaciones);
    }, (error) => {
      console.error('Error al obtener conversaciones:', error);
    });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <FlatList
        data={conversaciones}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>Conversación ID: {item.id}</Text>
            {/* Aquí puedes añadir más detalles sobre la conversación */}
          </View>
        )}
      />
    </View>
  );
};

export default ConversationsScreen;

