import React, { useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform,View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Button, Alert, Modal } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIRESTORE_DB, STORAGE_BUCKET } from '../../../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const UserChat = ({ route }) => {
  const [mensajes, setMensajes] = useState([]);
  const [mensajeTexto, setMensajeTexto] = useState('');
  const { conversacion } = route.params;
  const [oid, setOid] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const flatListRef = useRef();
  const [isPickingDocument, setIsPickingDocument] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const fetchMensajes = async () => {
      const oid = await AsyncStorage.getItem('userOID');
      if (!oid) return;
  
      setOid(oid);
      const mensajesRef = collection(FIRESTORE_DB, `conversaciones/${conversacion.id}/mensajes`);
      const q = query(mensajesRef, orderBy('enviadoEn', 'asc'));
  
      return onSnapshot(q, (querySnapshot) => {
        const fetchedMensajes = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMensajes(fetchedMensajes);
        // Mueve el scroll al final solo cuando se reciben los mensajes
        if (fetchedMensajes.length > 0) {
          flatListRef.current?.scrollToEnd({ animated: true });
        }
      }, (error) => {
        console.error('Error al obtener mensajes:', error);
      });
    };
  
    const unsubscribe = fetchMensajes();
  
    return () => unsubscribe && unsubscribe();
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
  

  useEffect(() => {
    if (mensajes.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [mensajes]);
  
  



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
  
  
  
  
  const renderItem = ({ item }) => {
    const isCurrentUserMessage = item.enviadoPor === oid;
    const mensajeFecha = item.enviadoEn?.toDate(); // Convierte el timestamp a Date
    const horaMensaje = mensajeFecha ? `${mensajeFecha.getHours()}:${mensajeFecha.getMinutes().toString().padStart(2, '0')}` : '';
  
    return (
      <View
        style={[
          styles.mensaje,
          isCurrentUserMessage ? styles.currentUserMessage : styles.otherUserMessage,
        ]}>
        {/* Muestra el texto del mensaje si existe */}
        {item.texto && <Text style={styles.mensajeTexto}>{item.texto}</Text>}
  
        {/* Renderiza la imagen si el tipo de archivo es una imagen */}
        {item.fileType === 'image/jpeg' && (
          <Image source={{ uri: item.fileUrl }} style={styles.imagen} />
        )}
  
        {/* Renderiza un enlace para abrir el PDF si el tipo de archivo es un PDF */}
        {item.fileType === 'application/pdf' && (
          <TouchableOpacity onPress={() => Linking.openURL(item.fileUrl)}>
            <Text style={styles.archivoTexto}>Ver PDF</Text>
          </TouchableOpacity>
        )}
  
        {/* Muestra la hora del mensaje */}
        <Text style={styles.horaMensaje}>{new Date(item.enviadoEn.seconds * 1000).toLocaleDateString()}</Text>
      </View>
    );
  };
  

  return (
    <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === "ios" ? "padding" : "height"} 
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
  >
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={mensajes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem} 
      />
        <View style={styles.inputContainer}>
        <TouchableOpacity onPress={toggleModal} style={styles.modalToggleButton}>
          <Ionicons name="add-circle-outline" size={24} color="black" />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={mensajeTexto}
          onChangeText={setMensajeTexto}
          placeholder="Escribe un mensaje aquí..."
          multiline
        />

        <TouchableOpacity onPress={() => mensajeTexto.trim() && enviarMensaje(mensajeTexto)} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
        </View>


        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        >
                <View style={styles.modalView}>
                  <Button title="Enviar Imagen" onPress={() => { seleccionarYEnviarImagen(); toggleModal(); }} />
                  <Button title="Enviar PDF" onPress={() => { seleccionarYEnviarPDF(); toggleModal(); }} />
                  <Button title="Cancelar" onPress={toggleModal} color="#FF6347" />
                </View>
        </Modal>
        </View>
        </KeyboardAvoidingView>
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
  container: {
    flex: 1,
    padding: 10,
  },
  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  modalToggleButton: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 35,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  sendButton: {
    marginLeft: 10,
  },  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#D8F2FE',
  },

  // Estilos para mensajes de otros usuarios
  otherUserMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },

  // Contenedor para input y botones
  inputAndButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Asegurar espacio alrededor del input
    paddingHorizontal: 10, // Opcional: para no pegar el contenido a los bordes
  },
  horaMensaje: {
    fontSize: 10,
    color: '#CCCCCC',
    alignSelf: 'flex-end', // Alinea a la derecha
    marginTop: 5, // Espaciado con el texto del mensaje
  },
});

export default UserChat;