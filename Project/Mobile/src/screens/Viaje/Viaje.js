import React, { useState, useEffect } from 'react';
import { View,ScrollView, Text, TextInput, Switch, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard  } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';



const MainMenu = ({ navigation }) => {
  const [preferredWorkoutTime, setPreferredWorkoutTime] = useState(new Date());
  const [defaultStartingLocation, setDefaultStartingLocation] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [reminder, setReminder] = useState(false);
  const [region, setRegion] = useState({});
  const [oid, setOid] = useState('');
  const [travelTime, setTravelTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeTime = (event, selectedTime) => {

    setShowTimePicker(false);
    const currentTime = selectedTime || preferredWorkoutTime;
    setPreferredWorkoutTime(currentTime);
  };

  useEffect(() => {

  handleCheckTravelTime();

  }, [defaultStartingLocation, gymAddress]);


  const handleCheckTravelTime = async () => {
    if (!defaultStartingLocation || !gymAddress) {
        console.log("Both locations must be set.");
        return;
    }
    const time = await getTravelTime(defaultStartingLocation, gymAddress);
    setTravelTime(time);
    console.log(`Travel time: ${time}`);
  };

  const getTravelTime = async (origin, destination) => {
    try {
      const params = {
        origin: origin,
        destination: destination,
        key: 'AIzaSyB-Odwa_VfMK_UPPhAcRyU31K8Lnm0KAPo',
        mode: 'driving'
    };
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', { params });
        const route = response.data.routes[0];
        const durationText = route.legs[0].duration.text;  
        const durationValue = route.legs[0].duration.value;  


        let date = new Date();
        date.setHours(0, 0, 0, 0); 
        date.setSeconds(durationValue); 

        setTravelTime(date); 
        console.log(`Estimated travel time: ${durationText}`);
        return date;
    } catch (error) {
        console.error("Failed to fetch travel time:", error);
        return null;
    }
};



useEffect(() => {
  console.log("useEffect is running");

  getLocationPermission().then(() => {
      console.log("Location permissions handled");
  }).catch(console.error);

  const fetchOID = async () => {
    console.log("Fetching OID");
    const oid = await AsyncStorage.getItem("userOID");
    console.log("OID fetched:", oid);
    if (!oid) {
        console.error("OID not found");
        return;
    }

    try {
        console.log("Making API call");
        const response = await fetch(`${config.apiBaseUrl}/viaje/${oid}`);
        const jsonData = await response.json();
        console.log("Data received from API:", jsonData);
        if (jsonData[0]) {
            const { Hora_Preferida, Lugar_Gimnasio, Lugar_Salida, Notificaciones_Activas } = jsonData[0];
            if (Hora_Preferida) {
                setPreferredWorkoutTime(new Date(Hora_Preferida));
            } else {
                // Set time to 12:00 PM if Hora_Preferida is not provided
                const defaultTime = new Date();
                defaultTime.setHours(12, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds
                setPreferredWorkoutTime(defaultTime);
            }
            setDefaultStartingLocation(Lugar_Salida);
            setGymAddress(Lugar_Gimnasio);
            setReminder(Notificaciones_Activas);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    setOid(oid);
  };

  fetchOID();
}, []);




  async function getLocationPermission() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      });
    } catch (error) {
      console.error("Failed to fetch location", error);
    }
  }



  const handleStartJourney = async () => {
    try {

  
      // Abrir Google 
      const encodedAddress = encodeURIComponent(gymAddress);
      const url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
      const supported = await Linking.canOpenURL(url);
  
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error("Don't know how to open this URL: " + url);
      }
    } catch (error) {
      console.error('Error scheduling notification or opening maps:', error);
    }
  };

  const handleSaveInfo = async () => {
    handleCheckTravelTime();
    const timeString = `${travelTime.getHours()}:${travelTime.getMinutes()}:${travelTime.getSeconds()}`;
    const timeP = `${preferredWorkoutTime.getHours()}:${preferredWorkoutTime.getMinutes()}:${preferredWorkoutTime.getSeconds()}`;

    const data = {
      Hora_Preferida: timeP,
      Lugar_Salida: defaultStartingLocation,
      Lugar_Gimnasio: gymAddress,
      Notificaciones_Activas: reminder,
      Tiempo_Estimado: timeString,
    };

    try {
      const response = await fetch(`${config.apiBaseUrl}/viaje/update/${oid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Algo salió mal.");
      }

      // Respuesta del servidor
      const result = await response.json();
      console.log(result);
      console.log("Datos de viaje añadidos con éxito.");
      alert("Datos de viaje añadidos con éxito.");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      console.log("Error al guardar los datos.");
    }

  }


  return (
    <>
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.header}>
        <Text style={styles.headerTitle}>Viaje a gimnasio</Text>
        <TouchableOpacity onPress={handleSaveInfo}>
        <Ionicons name="save-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.note}>Nota: Copiar las direcciones directamente como vienen en google maps, no links.</Text>
      <Text>Hora preferida de entrenamiento</Text>
      <TouchableOpacity onPress={() => setShowTimePicker(true)} >
        <Text style={styles.hour}>{preferredWorkoutTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
        style={styles.timePicker}
          value={preferredWorkoutTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}
      <Text>Lugar predeterminado de salida</Text>
      <TextInput
        style={styles.input}
        placeholder="Lugar predeterminado de salida"
        value={defaultStartingLocation}
        onChangeText={setDefaultStartingLocation}
      />
      <Text>Lugar preferido de entrenamiento</Text>
      <TextInput
        style={styles.input}
        placeholder="Lugar preferido de entrenamiento"
        value={gymAddress}
        onChangeText={setGymAddress}
      />
      <View style={styles.switchContainer}>
        <Text>Activar Recordatorio de entrenamiento</Text>
        <Switch
          onValueChange={setReminder}
          value={reminder}
        />
      </View> 
      <Text style={styles.tiempo}>Tiempo estimado de viaje: {travelTime.getHours()} hrs {travelTime.getMinutes()} minutos</Text>
      <MapView
          onPress={handleStartJourney}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion} 
        >
        </MapView>
      <TouchableOpacity
            style={styles.button}
        title="Comenzar viaje"
        onPress={handleStartJourney}>
      <Text style={styles.buttonText}>¡Comenzar Viaje!</Text>
      </TouchableOpacity>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 20,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 28,
  },
  input: {
    fontSize: 16,
    height: 40,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 5,
    paddingHorizontal: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0790cf",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },  map: {
    height: 250, 
    width: '100%',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  saveButton: {
    color: "#0790cf",
    fontSize: 18,
    fontWeight: "bold",
  },
  note:{
    fontStyle: 'italic',
    color: 'gray',
    marginBottom: 10
  },
  timePicker: {
    width: '100%',
    fontSize:16,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hour:{
    display: 'flex',
    fontSize:16,
    fontWeight:'bold',
    marginVertical:10,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    height: 40,
    marginTop: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  tiempo:{
    fontSize:16,
    fontWeight:'bold',
    marginVertical:10,
    height: 40,
    marginTop: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  }
});


export default MainMenu;