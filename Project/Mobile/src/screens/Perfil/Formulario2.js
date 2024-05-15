import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Button } from 'react-native';
import * as Progress from "react-native-progress";
import { AntDesign } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_APP } from '../../../FirebaseConfig'; // Asegúrate de que la ruta sea correcta.
import config from "../../utils/conf";

const EntrenadorNutricionista2 = ({ navigation, route }) => {
    const [experience, setExperience] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const [document, setDocument] = useState(null);
    const { serviceType, description, imageUrl } = route.params;
    console.log(serviceType, description, imageUrl);

    const pickDocument = async () => {
      const result = await DocumentPicker.getDocumentAsync({
          type: 'application/pdf',
          copyToCacheDirectory: true, // Asegura que hay una copia temporal local del archivo
      });
  
      // Verifica si la selección fue exitosa y maneja el primer archivo seleccionado
      if (!result.canceled && result.assets && result.assets.length > 0) {
          const documentUri = result.assets[0].uri;
          console.log("Documento seleccionado URI:", documentUri);
          setDocument(documentUri); // Asegúrate de que setDocument es una función de estado definida correctamente
      } else if (result.canceled) {
          console.log("Selección de documento cancelada por el usuario.");
      } else {
          console.log("Resultado inesperado del DocumentPicker:", result);
      }
  };
  
  
  

    const handleContinue = async () => {
      // Validaciones de los campos
      if (!experience.trim() || !serviceDescription.trim() || !document) {
        alert('Por favor, completa todos los campos y sube tus documentos antes de continuar.');
        return;
      }
    
      // Subir el documento a Firebase Storage
      try {
        const documentName = `certifications/${Date.now()}-${document.split('/').pop()}`;
        const documentRef = storageRef(getStorage(FIREBASE_APP), documentName);
    
        const response = await fetch(document);
        const blob = await response.blob();

        if (blob.size > 5000000) { // Comprueba nuevamente el tamaño del blob
          alert('El documento no debe ser mayor de 5 MB.');
          return;
      }
    
        await uploadBytes(documentRef, blob);
        const documentUrl = await getDownloadURL(documentRef);
    
        // Aquí tienes la URL de tu documento y la imagen que puedes usar para hacer la llamada a tu API
        console.log('Imagen URL:', imageUrl);
        console.log('Documento URL:', documentUrl);
    
        const ID_Usuario = await AsyncStorage.getItem('userOID');

        const ID_Tipo_Web = serviceType === 'Nutricionista' ? 1 : serviceType === 'Entrenador' ? 2 : null;


        // Llamada a la API
        // Suponiendo que tienes una función para hacer la llamada POST a tu AP
        const postData = {
          ID_Tipo_Web,
          descripcion: description,
          foto_perfil: imageUrl,
          experiencia_laboral: experience,
          servicio: serviceDescription,
          titulos: documentUrl,
          ID_Usuario
        };
    
        const apiResponse = await fetch(`${config.apiBaseUrl}/insertTrainer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
    
        if (!apiResponse.ok) throw new Error('Respuesta de la API no fue exitosa');
    
        const apiResult = await apiResponse.json();
        console.log('Respuesta de la API:', apiResult);
        alert('Solicitud enviada con éxito.');
        navigation.replace('Perfil');
    
        // Aquí puedes manejar la navegación o actualización de estado según sea necesario después del éxito
      } catch (error) {
        console.error('Error al subir el documento o al hacer la llamada a la API:', error);
        alert('Hubo un error al enviar tu solicitud. Por favor, intenta de nuevo.');
      }
    };
    

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
    <View style={styles.progress}>
        <Progress.Bar progress={1} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>2 de 2</Text>  
      <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                <Text style={styles.uploadButtonText}>Sube aquí tus títulos y/o certificaciones en formato pdf.</Text>
                <AntDesign name="pdffile1" size={36} color="#fff" />
            </TouchableOpacity>

            {document && (
                <Text style={styles.uploadedDocumentText}>Documento cargado</Text>
            )}

            <Text style={styles.descriptionText}>Describe tu experiencia laboral previa en el ramo</Text>
            <TextInput
                style={styles.input}
                onChangeText={setExperience}
                value={experience}
                multiline
                numberOfLines={4}
            />
            <Text style={styles.descriptionText}>Describe el servicio que brindas</Text>
            <TextInput
                style={styles.input}
                onChangeText={(text) => {
                    if (text.length <= 2000) {
                        setServiceDescription(text);
                    } else {
                        alert('La descripción del servicio no puede exceder los 2000 caracteres.');
                    }
                }}                
                value={serviceDescription}
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleContinue}>
                <Text style={styles.sendButtonText}>Enviar solicitud</Text>
            </TouchableOpacity>  
    </View>
  );
};

const styles = {
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        backgroundColor: '#0790cf',
        marginBottom: 20,
    },
    descriptionText: {
        alignSelf: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop:15,
        marginBottom: 10,
      },
    uploadButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left',
        marginRight: 10,
    },
    uploadedDocumentText: {
        color: '#0790cf',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        height: 130,
        textAlignVertical: 'top',
    },
    sendButton: {
        backgroundColor: '#0790cf',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize:18,
    },
    linkText: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    progress: {
      width: "100%",
      zIndex: -1,
      paddingTop: 25,
    },
    pageText: {
      fontSize: 16,
      color: "#666",
      textAlign: "center",
      marginBottom: 40,
    },
    arrowContainer: {
      position: "absolute",
      top: 85,
      right: 20,
    },
  };

export default EntrenadorNutricionista2;
