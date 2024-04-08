import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { STORAGE_BUCKET } from '../../../FirebaseConfig';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import config from "../../utils/conf";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const IndividualBodyMeasure = ({navigation, route }) => {
  const measureDetails = route.params?.measureDetails;
  const userType = route.params?.userType;
  const [weight, setWeight] = useState(measureDetails  ? String(measureDetails?.peso) : '');
  const [fat, setFat] = useState(measureDetails  ? String(measureDetails?.porcentaje_grasa) : '');
  const [pulse, setPulse] = useState(measureDetails  ? String(measureDetails?.ritmo_cardiaco) : '');
  const [muscleMass, setMuscleMass] = useState(measureDetails  ? String(measureDetails?.masa_muscular) : '');
  const [bloodPressure, setBloodPressure] = useState(measureDetails  ? String(measureDetails?.presion_arterial) : '');
  const [neckCircumference, setNeckCircumference] = useState(measureDetails  ? String(measureDetails?.cuello) : '');
  const [hipCircumference, setHipCircumference] = useState(measureDetails  ? String(measureDetails?.cadera) : '');
  const [waistCircumference, setWaistCircumference] = useState(measureDetails  ? String(measureDetails?.cintura) : '');
  const [chestCircumference, setChestCircumference] = useState(measureDetails  ? String(measureDetails?.pecho) : '');
  const [bicepsCircumference, setBicepsCircumference] = useState(measureDetails  ? String(measureDetails?.bicep) : '');
  const [shoulderCircumference, setShoulderCircumference] = useState(measureDetails  ? String(measureDetails?.hombro) : '');
  const [forearmsCircumference, setForearmsCircumference] = useState(measureDetails  ? String(measureDetails?.antebrazo) : '');
  const [CuadricepsiCircumference, setCuadricepsCircumference] = useState(measureDetails  ? String(measureDetails?.muslo) : '');
  const [calfCircumference, setCalfCircumference] = useState(measureDetails  ? String(measureDetails?.pantorrilla) : '');
  const [height, setHeight] = useState(measureDetails  ? String(measureDetails?.estatura) : '');
  const [IMC, setIMC] = useState(measureDetails  ? String(measureDetails?.IMC) : '0');
  const [images, setImages] = useState(measureDetails ? [measureDetails.foto_frente, measureDetails.foto_lado, measureDetails.foto_espalda] : []);
  const date = new Date();
  const [fecha, setFecha]= useState(measureDetails?.fecha || date.toISOString().slice(0,10));


  const saveChanges = () => {
    console.log("Guardando cambios...");
    handleSubmit();
  };


  const handleSubmit = async () => {
    // Verificar que ningún campo se encuentre vacío
    console.log("Guardando medidas...");
    const allMeasures = [
      weight, height
    ];
  
    if (allMeasures.some(measure => measure === null)) {
      Alert.alert("Error", "Todos los campos deben ser completados.");
      return;
    }
  
    // Validaciones específicas
    if (weight >= 300 || weight<=0) {
      Alert.alert("Error", "El peso debe ser menor a 300 kg y no debe ser cero.");
      return;
    }
  
  
    if (height >= 3 || height <= 0) {
      Alert.alert("Error", "La altura no puede ser mayor a 3 metros o cero.");
      return;
    }
    console.log("1");

    const image1 = images.length > 0 ? images[0]: null;
    const image2 = images.length > 1 ? images[1]: null;
    const image3 = images.length > 2 ? images[2]: null;

    const oid = await AsyncStorage.getItem("userOID");

    const bodyMeasurementsData = {
      fecha: new Date().toISOString(),
      ID_UsuarioMovil: oid,
      estatura: height,
      peso: weight,
      IMC: IMC,
      foto_frente: image1,
      foto_lado: image2,
      foto_espalda: image3
    };

      console.log(bodyMeasurementsData);

      try {
        const response = await fetch(`${config.apiBaseUrl}/createMilestone`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyMeasurementsData),
        });
  
        if (!response.ok) {
          throw new Error("Algo salió mal al guardar el Hito.");
        }
  
        // Respuesta del servidor
        const result = await response.json();
        console.log(result);
        console.log("Hito añadido con éxito.");

        navigation.goBack();
      } catch (error) {
        console.error("Error al guardar el Hito:", error);
        console.log("Error al guardar el Hito.");
      }
  }
  

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

    if (images.length >= 3) {
      Alert.alert('Error', 'Solo puedes agregar hasta 3 imágenes');
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
      setImages([...images, url]);

    } catch (error) {
      console.error('Error al subir archivo:', error);
    }
  };
  

  useEffect(() => {
    const weightNum = parseFloat(weight);
    const heightMeters = parseFloat(height); 
    const calculatedIMC = weightNum && heightMeters ? (weightNum/((heightMeters)**2))?.toFixed(2) : '0'; 
  
    setIMC(calculatedIMC); 
  }, [weight, height]);

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{fecha}</Text>
        {!measureDetails ?(
          <>
            <TouchableOpacity onPress={saveChanges}>
              <Ionicons name="save-outline" size={24} color="black" />
            </TouchableOpacity>
        </>
        ):(<></>)}
      </View>
    {userType === null ? (
      <View>
        <Text>
        Espere un momento...
        </Text>
      </View>
    ):( userType === 'normal'?(
        <>
        <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Medidas corporales</Text>
    <View style={styles.measureContainer}>
    <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={(text) => setWeight(text)}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Altura</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={(text) => setHeight(text)}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>m</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>IMC</Text>
          <TextInput
            style={styles.input}
            value={IMC}
            onChangeText={(text)=> setIMC(text)}
            keyboardType="numeric"
            editable={false}
          />
          <Text style={styles.suffix}></Text>
        </View>
        </View>
        {!measureDetails ?
        <>
        <Text>Nota: Puede agruegar hasta 3 imagenes para ver su progreso, lo recomendado es una de frente, una de lado y otra de espalda</Text>
        <Button title="Seleccionar imagenes" onPress={seleccionarYEnviarImagen} editable={!measureDetails} />
        </>
        :        
        <></>
        }
        <View style={styles.imagesContainer}>
          {images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
        </ScrollView>
        </>
      ):(
        <>
    <ScrollView style={styles.container}>
    <Text style={styles.sectionTitle}>Medidas corporales</Text>
    <View style={styles.measureContainer}>
    <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <TextInput
            style={styles.input}
            value={weight}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Altura</Text>
          <TextInput
            style={styles.input}
            value={height}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>m</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>IMC</Text>
          <TextInput
            style={styles.input}
            value={IMC}
            keyboardType="numeric"
            editable={false}
          />
          <Text style={styles.suffix}></Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>% de grasa</Text>
          <TextInput
            style={styles.input}
            value={fat}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>%</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Masa Muscular</Text>
          <TextInput
            style={styles.input}
            value={muscleMass}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>kg</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Ritmo Cardiaco</Text>
          <TextInput
            style={styles.input}
            value={pulse}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>lpm</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Presión arterial</Text>
          <TextInput
            style={styles.input}
            value={bloodPressure}
            keyboardType="numeric"
            editable={!measureDetails}
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
            value={neckCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pecho</Text>
          <TextInput
            style={styles.input}
            value={chestCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Hombros</Text>
          <TextInput
            style={styles.input}
            value={shoulderCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bicep</Text>
          <TextInput
            style={styles.input}
            value={bicepsCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Antebrazo</Text>
          <TextInput
            style={styles.input}
            value={forearmsCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cintura</Text>
          <TextInput
            style={styles.input}
            value= {waistCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Cadera</Text>
          <TextInput
            style={styles.input}
            value= {hipCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Pantorrillas</Text>
          <TextInput
            style={styles.input}
            value={calfCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Muslos</Text>
          <TextInput
            style={styles.input}
            value={CuadricepsiCircumference}
            keyboardType="numeric"
            editable={!measureDetails}
          />
          <Text style={styles.suffix}>cm</Text>

        </View>
        </View>
        <View style={styles.imagesContainer}>
          {images.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.image} />
          ))}
        </View>
    </ScrollView>
    </>
      )
    )}
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
    width: screenWidth/1.5,
    height: screenWidth/1.5,
    margin: 5,
  },
});

export default IndividualBodyMeasure;
