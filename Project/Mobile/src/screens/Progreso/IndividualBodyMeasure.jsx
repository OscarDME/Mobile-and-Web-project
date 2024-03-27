import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { STORAGE_BUCKET } from '../../../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';


const IndividualBodyMeasure = ({navigation, route }) => {
  const measureDetails = route.params?.measureDetails;
  const [images, setImages] = useState([])

  const date = new Date();

  const defaultMeasureDetails = {
    fecha: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear(),
    peso: '',
    porcentajeDeGrasa: '',
    IMC: '',
    masaMuscularNeta: '',
    ritmoCardiacoEnReposo: '',
    presionArterial: '',
    cuello: '',
    pantorrillas: '',
    cadera: '',
    biceps: '',
    antebrazo: '',
    hombros: '',
    pecho: '',
    cintura: '',
    muslos: '',
  };


  const [details, setDetails] = useState(measureDetails || defaultMeasureDetails);

  const handleInputChange = (name, value) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const saveChanges = () => {
//GUARDAR CAMBIOS EN LA BASE DE DATOS O GUARDAR NUEVA MEDIDA EN LA BASE DE DATOS
    console.log('Detalles guardados:', details);
  };


  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Necesitas permitir permisos para poder agregar fotos');
      }
    })();
  }, []);

  const seleccionarYEnviarImagen = async () => {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    const puedeSubirImagen = await actualizarContadorDeSubidas();
    if (!puedeSubirImagen) {
      return; 
    }

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
      const fileName = `progress-images/${new Date().getTime()}.${fileExtension}`;
      const fileRef = storageRef(STORAGE_BUCKET, fileName);
  
      const uploadTask = await uploadBytes(fileRef, blob); // Asegúrate de esperar esta tarea con await
      console.log('Archivo subido con éxito');
  
      const url = await getDownloadURL(fileRef);
      console.log(`URL obtenida con éxito: ${url}`);

    } catch (error) {
      console.error('Error al subir archivo:', error);
    }
  };

  const actualizarContadorDeSubidas = async () => {
    const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    const limiteImagenesPorDia = 3;
    const historialSubidas = JSON.parse(await AsyncStorage.getItem('historialSubidas')) || {};
  
    if (historialSubidas.fecha === hoy) {
      // Si ya se subieron imágenes hoy, verifica el contador
      if (historialSubidas.contador >= limiteImagenesPorDia) {
        Alert.alert('Límite alcanzado', 'No puedes subir más de 3 imágenes por día.');
        return false;
      } else {
        // Incrementa el contador
        historialSubidas.contador += 1;
      }
    } else {
      // Si no hay registros de hoy, inicia el contador
      historialSubidas.fecha = hoy;
      historialSubidas.contador = 1;
    }
  
    await AsyncStorage.setItem('historialSubidas', JSON.stringify(historialSubidas));
    return true;
  };
  

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{details.fecha}</Text>
        <TouchableOpacity onPress={saveChanges}>
          <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    <ScrollView style={styles.container}>
    <Text style={styles.sectionTitle}>Medidas corporales</Text>
    <View style={styles.measureContainer}>
    <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={details.peso !== '' ? String(details.peso) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>% de grasa</Text>
          <TextInput
            style={styles.input}
            value={details.porcentajeDeGrasa !== '' ? String(details.porcentajeDeGrasa) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>%</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>IMC</Text>
          <TextInput
            style={styles.input}
            value={details.IMC !== '' ? String(details.IMC) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
            editable={false}
          />
          <Text style={styles.suffix}></Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Masa Muscular</Text>
          <TextInput
            style={styles.input}
            value={details.masaMuscularNeta !== '' ? String(details.masaMuscularNeta) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ritmo Cardiaco</Text>
          <TextInput
            style={styles.input}
            value={details.ritmoCardiacoEnReposo !== '' ? String(details.ritmoCardiacoEnReposo) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>lpm</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Presión arterial</Text>
          <TextInput
            style={styles.input}
            value={details.presionArterial !== '' ? String(details.presionArterial) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>mm hg</Text>
        </View>
        </View>
    <Text style={styles.sectionTitle}>Circunferencias</Text>
    <View style={styles.measureContainer}>
    <View style={styles.inputContainer}>
          <Text style={styles.label}>Cuello</Text>
          <TextInput
            style={styles.input}
            value={details.cuello !== '' ? String(details.cuello) : '-'}
            onChangeText={(text) => handleInputChange('cuello', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pecho</Text>
          <TextInput
            style={styles.input}
            value={details.pecho !== '' ? String(details.pecho) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hombros</Text>
          <TextInput
            style={styles.input}
            value={details.hombros !== '' ? String(details.hombros) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bicep</Text>
          <TextInput
            style={styles.input}
            value={details.biceps !== '' ? String(details.biceps) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Antebrazo</Text>
          <TextInput
            style={styles.input}
            value={details.antebrazo !== '' ? String(details.antebrazo) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cintura</Text>
          <TextInput
            style={styles.input}
            value={details.cintura !== '' ? String(details.cintura) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cadera</Text>
          <TextInput
            style={styles.input}
            value={details.cadera !== '' ? String(details.cadera) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pantorrillas</Text>
          <TextInput
            style={styles.input}
            value={details.pantorrillas !== '' ? String(details.pantorrillas) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Muslos</Text>
          <TextInput
            style={styles.input}
            value={details.muslos !== '' ? String(details.muslos) : '-'}
            onChangeText={(text) => handleInputChange('pecho', text)}
            keyboardType="numeric"
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        </View>
        <Button title="Seleccionar imagenes" onPress={seleccionarYEnviarImagen} />
        <View style={styles.imagesContainer}>
          {images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
    </ScrollView>
  </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontSize: 24,
    color: '#333',
  },
  input: {
    fontSize: 36,
    flex: 1,
    borderWidth: 1,
    paddingvertical: 5,
    borderRadius: 5,
    borderColor: 'transparent',
    textAlign: 'right',
  },
  buttonContainer: {
    marginTop: 20,
  },
  
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
  },
  measureContainer:{
    flexDirection: 'column',
    justifyContent:'center',
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 40,
    marginHorizontal: 10,
  },
  suffix:{
    fontSize: 20,
    paddingLeft: 5,
    width: 40,
  },
  sectionTitle:{
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 35,
    paddingBottom: 10,
    fontWeight: 'bold',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

export default IndividualBodyMeasure;
