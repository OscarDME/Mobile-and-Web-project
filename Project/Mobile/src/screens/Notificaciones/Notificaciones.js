import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import config from "../../utils/conf";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const MainMenu = (navigation) => {
  const [notifications, setNotifications] = useState([]);
  const [travelNotifications, setTravelNotifications] = useState([]);
  const [rutinasPronto, setRutinasPronto] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );
  const fetchNotifications = async () => {
    const userOID = await AsyncStorage.getItem('userOID');
    if (!userOID) {
      console.log("No user OID found");
      return;
    }
  
    try {
      // Fetch pending appointments
      const citasResponse = await fetch(`${config.apiBaseUrl}/citaspendientes/${userOID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (citasResponse.ok) {
        const citasData = await citasResponse.json();
        setNotifications(citasData);
      } else {
        console.error("Failed to fetch appointments", citasResponse.status);
      }
  
      // Fetch travel notifications
      const viajeResponse = await fetch(`${config.apiBaseUrl}/viajeNotificaciones/${userOID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (viajeResponse.ok) {
        const viajeData = await viajeResponse.json();
        setTravelNotifications(viajeData);
      } else {
        console.error("Failed to fetch travel notifications", viajeResponse.status);
      }
  
      // Fetch routines about to end
      const rutinasResponse = await fetch(`${config.apiBaseUrl}/rutinaspronto/${userOID}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (rutinasResponse.ok) {
        const rutinasData = await rutinasResponse.json();
        setRutinasPronto(rutinasData);
      } else if (rutinasResponse.status === 404) {
        console.log("No hay rutinas próximas a terminar.");
        setRutinasPronto([]); // Asegura que no se muestren datos antiguos o incorrectos
      } else {
        console.error("Failed to fetch routines about to end", rutinasResponse.status);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  
  

  const handlePressLocation = (location) => {
    // Abrir el enlace al lugar de la cita
    Linking.openURL(location);
  };

  const handleAcceptNotification = async (notificationId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/aceptarcita/${notificationId}`, {
        method: 'PUT', // o 'PATCH' dependiendo de tu API
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update cita statu');
      }
  
      const data = await response.json();
      console.log("Cita aceptada exitosamente:", data);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.ID_Cita !== notificationId)
      );
  
    } catch (error) {
      console.error("Error al aceptar la cita:", error);
    }
  };
  

  const handleRejectNotification = async (notificationId) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/rechazarcita/${notificationId}`, {
        method: 'PUT', // o 'PATCH' dependiendo de tu API
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to update cita status');
      }
  
      const data = await response.json();
      console.log("Cita rechazada exitosamente:", data);
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.ID_Cita !== notificationId)
      );
  
    } catch (error) {
      console.error("Error al aceptar la cita:", error);
    }
  };

  const format12HourTime = (timeString) => {
    if (!timeString) return '';
  
    // Convertir el string de tiempo a un objeto Date
    const timeParts = timeString.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2]));
  
    // Formatear a tiempo de 12 horas
    return timeDate.toLocaleTimeString('es-MX', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titlemajor}>Notificaciones:</Text>
      {notifications.map((notification, index) => (
        <View key={index} style={styles.notificationCard}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.titlemajor}>Cita pendiente por aceptar</Text>
              <Text style={styles.title}>{notification.nombre_usuario_web} {notification.apellido_usuario_web}</Text>
              <Text>{notification.Tipo_Web}</Text>
              <TouchableOpacity onPress={() => handlePressLocation(notification.lugar)}>
                <Text style={styles.locationLink}>Lugar de la cita</Text>
              </TouchableOpacity>
              <Text>Hora de inicio: {notification.hora_inicio}</Text>
              <Text>Hora de fin: {notification.hora_final}</Text>
              {/* Agrega más detalles según sea necesario */}
            </View>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => handleAcceptNotification(notification.ID_Cita)}>
                <FontAwesomeIcon icon={faCheck} size={24} color="#0790cf" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRejectNotification(notification.ID_Cita)}>
                <FontAwesomeIcon icon={faTimes} size={24} color="#cf0709" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      {travelNotifications.map((notification, index) => (
        <>
        <View key={index} style={styles.notificationCard}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.titlemajor}>¡Atiende a tu entrenamiento de Hoy!</Text>
              <Text>Sal de tu lugar predeterminado de salida a las <Text style={styles.empha}>{format12HourTime(notification.Hora_De_Salida)}</Text> para llegar a tiempo a tu gimnasio.</Text>
            </View>
          </View>
        </View>
        </>
      ))}
      {rutinasPronto.map((rutina, index) => (
      <View key={index} style={styles.notificationCard}>
        <View style={styles.row}>
          <View style={styles.textContainer}>
            <Text style={styles.titlemajor}>Rutina a punto de terminar</Text>
            <Text style={styles.title}>{rutina.NombreRutina}</Text>
            <Text>Termina el: {new Date(rutina.fecha_fin).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  notificationCard: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  icon: {
  marginRight: 30, // Ajusta este valor según sea necesario para separar los iconos entre sí
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  titlemajor: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLink: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  empha: {
    fontWeight: 'bold',
  }
});

export default MainMenu;
