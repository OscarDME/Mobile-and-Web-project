import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIRESTORE_DB, STORAGE_BUCKET } from '../../../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';


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

  const enviarMensaje = async (texto, fileUrl, fileType) => {
    const nuevoMensaje = {
      enviadoPor: oid,
      enviadoEn: new Date(),
    };

    if (texto) {
      nuevoMensaje.texto = texto;
    }

    if (fileUrl && fileType) {
      nuevoMensaje.fileUrl = fileUrl;
      nuevoMensaje.fileType = fileType;
    }

    try {
      const mensajesRef = collection(FIRESTORE_DB, `conversaciones/${conversacion.id}/mensajes`);
      setMensajeTexto('');
      await addDoc(mensajesRef, nuevoMensaje);


      const conversationRef = doc(FIRESTORE_DB, "conversaciones", conversacion.id);
      await updateDoc(conversationRef, {
        modificadoEn: new Date(),
      });
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
    }
  };

  const seleccionarYEnviarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (resultado.cancelled) {
      return;
    }

    if (resultado.type === 'image' && resultado.fileSize <= 3 * 1024 * 1024) {
      subirYEnviarArchivo(resultado.uri, 'image/jpeg');
    } else {
      Alert.alert('Error', 'La imagen debe ser menor de 3 MB.');
    }
  };

  const subirYEnviarArchivo = async (uri, fileType) => {
    console.log(`Inicio de la subida del archivo. URI: ${uri}, Tipo: ${fileType}`);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      console.log('Blob creado con éxito');
  
      const fileExtension = uri.split('.').pop();
      const fileName = `chat-files/${new Date().getTime()}.${fileExtension}`;
      const fileRef = storageRef(STORAGE_BUCKET, fileName);
  
      const uploadTask = await uploadBytes(fileRef, blob); // Asegúrate de esperar esta tarea con await
      console.log('Archivo subido con éxito');
  
      const url = await getDownloadURL(fileRef);
      console.log(`URL obtenida con éxito: ${url}`);
      enviarMensaje(null, url, fileType);
    } catch (error) {
      console.error('Error al subir archivo:', error);
    }
  };

  const subirYEnviarArchivoPDF = async (uri, mimeType) => {
    console.log(`Inicio de la subida del archivo. URI: ${uri}, Tipo: ${mimeType}`);
    
    try {
      const blob = await fetch(uri).then((res) => res.blob());
  
      const fileExtension = uri.split('.').pop();
      const fileName = `chat-files/${new Date().getTime()}.${fileExtension}`;
      const fileRef = storageRef(STORAGE_BUCKET, fileName);
  
      await uploadBytes(fileRef, blob);
      const url = await getDownloadURL(fileRef);
  
      console.log(`Archivo PDF subido con éxito. URL: ${url}`);
      enviarMensaje(null, url, mimeType);
    } catch (error) {
      console.error('Error al subir archivo PDF:', error);
    }
  };
  
  
  

  const seleccionarYEnviarPDF = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
  
      if (resultado.cancelled) {
        console.log('Selección de PDF cancelada.');
        return;
      }
  
      if (!resultado.assets || resultado.assets.length === 0) {
        console.error('No se encontraron assets en el resultado del DocumentPicker');
        return;
      }
  
      const archivo = resultado.assets[0];
  
      if (archivo.size > 50 * 1024 * 1024) {
        alert('El archivo PDF debe ser menor de 50 MB.');
        return;
      }
  
      console.log(`Archivo seleccionado: ${archivo.uri}`);
      subirYEnviarArchivoPDF(archivo.uri, archivo.mimeType);
    } catch (error) {
      console.error('Error al seleccionar PDF:', error);
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
            {item.fileType === 'image/jpeg' && <Image source={{ uri: item.fileUrl }} style={styles.imagen} />}
            {item.fileType === 'application/pdf' && (
              <TouchableOpacity onPress={() => Linking.openURL(item.fileUrl)}>
                <Text style={styles.archivoTexto}>Ver PDF</Text>
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
        multiline
      />
      <Button title="Enviar Mensaje" onPress={() => enviarMensaje(mensajeTexto)} />
      <Button title="Enviar Imagen" onPress={seleccionarYEnviarImagen} />
      <Button title="Enviar PDF" onPress={seleccionarYEnviarPDF} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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