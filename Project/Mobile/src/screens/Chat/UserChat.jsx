import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Button } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';


const UserChat = ({ route }) => {
  const [mensajes, setMensajes] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const { conversacion } = route.params;
  const [oid, setOid] = useState('');

  

  useEffect(() => {
    AsyncStorage.getItem('userOID').then((value) => {
        if (value !== null) {
          setOid(value);
        }
      });
    const mensajesRef = collection(FIRESTORE_DB, `conversaciones/${conversacion.id}/mensajes`);
    const q = query(mensajesRef, orderBy('enviadoEn', 'asc')); 

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedMensajes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensajes(fetchedMensajes);
    }, (error) => {
      console.error('Error al obtener mensajes:', error);
    });

    return () => unsubscribe();
  }, [conversacion.id]);

  const openPDF = async (url) => {
    // Intenta abrir el PDF con el enlace proporcionado
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      Linking.openURL(url);
    } else {
      console.log('No se puede abrir el PDF');
    }
  };

  const enviarMensaje = async () => {
    if (mensajeTexto.trim() === '') {
      console.log('No se puede enviar un mensaje vacío');
      return;
    }

    try {
      const mensajesRef = collection(FIRESTORE_DB, `conversaciones/${conversacion.id}/mensajes`);
      await addDoc(mensajesRef, {
        texto: mensajeTexto,
        enviadoPor: oid,
        enviadoEn: new Date(),
      });
      setMensajeTexto(''); // Limpiar el campo de texto después del envío
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mensajes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.mensaje}>
            {item.texto && <Text style={styles.mensajeTexto}>{item.texto}</Text>}
            {item.fileType === 'image/jpeg' && (
              <Image source={{ uri: item.fileUrl }} style={styles.imagen} />
            )}
            {item.fileType === 'application/pdf' && (
              <TouchableOpacity onPress={() => openPDF(item.fileUrl)}>
                <Text style={styles.archivoTexto}>Abrir PDF</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
       <TextInput
        style={styles.input}
        value={mensajeTexto}
        onChangeText={setMensajeTexto}
        placeholder="Escribe un mensaje aquí..."
      />
      <Button title="Enviar" onPress={enviarMensaje} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mensaje: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  mensajeTexto: {
    fontSize: 16,
  },

  imagen: {
    width: 200, 
    height: 200, 
    resizeMode: 'contain',
    marginVertical: 5,
  },
  archivoTexto: {
    color: '#0000ff',
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default UserChat;
