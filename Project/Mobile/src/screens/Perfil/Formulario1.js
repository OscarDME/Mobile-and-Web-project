import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Progress from "react-native-progress";
import { FIREBASE_APP } from '../../../FirebaseConfig'; // Asumiendo que esto es la ruta correcta
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import config from "../../utils/conf";

const EntrenadorNutricionista1 = ({ navigation, route }) => {
    const [serviceType, setServiceType] = useState(null);
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
  
    const pickImage = async () => {
      // Permiso para acceder a la galería
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert('Se requiere permiso para acceder a la galería.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 12],  //Forzar el aspecto a 16:9
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    };
  
    const handleContinue = async () => {
      if (!serviceType) {
        alert('Por favor, selecciona si eres Entrenador o Nutricionista.');
        return;
      }
    
      // Validación para la descripción
      if (!description.trim()) {
        alert('Por favor, escribe una breve descripción sobre ti.');
        return;
      }
      if (!image) {
        alert('Por favor, selecciona una imagen antes de continuar.');
        return;
      }
      const storage = getStorage(FIREBASE_APP); // Utiliza getStorage para obtener la instancia de Firebase Storag
      const imageName = `profile_images/${Date.now()}-${image.split('/').pop()}`;
      const imageRef = ref(storage, imageName);
      try {
        const response = await fetch(image);
        const blob = await response.blob();

        if (blob.size > 3000000) { 
          alert('La imagen no debe ser mayor de 3 MB.');
          return;
        }

        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);
        navigation.navigate('Formulario2', { serviceType, description, imageUrl });
      } catch (error) {
        console.error(error);
        alert('Hubo un error al subir la imagen. Por favor, intenta de nuevo.');
      }
    };

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
    <View style={styles.progress}>
        <Progress.Bar progress={0.5} width={null} height={30} color="#0790cf" />
      </View>
      <Text style={styles.pageText}>1 de 2</Text>
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black"  />
      </TouchableOpacity>  
      <Text style={styles.questionText}>¿Qué tipo de servicios ofreces?</Text>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity
        style={[styles.button, serviceType === 'Entrenador' ? styles.selectedButton : styles.unselectedButton]}
        onPress={() => setServiceType('Entrenador')}
      >
        <Text style={serviceType === 'Entrenador' ? styles.selectedButtonText : styles.unselectedButtonText}>Entrenador</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, serviceType === 'Nutricionista' ? styles.selectedButton : styles.unselectedButton]}
        onPress={() => setServiceType('Nutricionista')}
      >
        <Text style={serviceType === 'Nutricionista' ? styles.selectedButtonText : styles.unselectedButtonText}>Nutricionista</Text>
      </TouchableOpacity>
      </View>

      <Text style={styles.descriptionText}>Describe brevemente quien eres</Text>
      <TextInput
        style={styles.descriptionInput}
        multiline
        numberOfLines={4}
        onChangeText={(text) => {
          if (text.length <= 700) {  // Limita a 700 caracteres
            setDescription(text);
          } else {
            Alert.alert("Límite de caracteres", "La descripción no puede exceder los 700 caracteres.");
          }
        }}        
        value={description}
      />

     <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>Sube aquí tu foto de perfil en formato jpg.</Text>
        <AntDesign name="upload" size={20} color="#fff" />
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {/* Botón para continuar aquí */}
      <TouchableOpacity style={styles.arrowContainer} onPress={handleContinue}>
        <AntDesign name="arrowright" size={34} color="black" />
      </TouchableOpacity>   
    </View>
  );
};

const styles = {
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center',
      },
      questionText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      button: {
        width: '100%',
        height: 55,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
      },
      selectedButton: {
        backgroundColor: '#0790cf',
      },
      unselectedButton: {
        borderWidth: 1,
        borderColor: '#0790cf',
      },
      selectedButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
      unselectedButtonText: {
        color: '#000',
        fontSize: 18,
      },
      descriptionText: {
        alignSelf: 'flex-start',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop:40,
        marginBottom: 10,
      },
      descriptionInput: {
        borderWidth: 1,
        borderColor: '#000',
        width: '100%',
        padding: 10,
        borderRadius: 5,
        marginBottom: 60,
        height: 180,
        textAlignVertical: 'top',
      },
      uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        height:60,
        backgroundColor: '#0790cf',
        width: '100%',
      },
      uploadButtonText: {
        marginRight: 10,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      },
      imagePreview: {
        width: 100,
        height: 100,
        marginBottom: 20,
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

export default EntrenadorNutricionista1;
