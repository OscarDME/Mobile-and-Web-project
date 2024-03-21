import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import config from "../../utils/conf";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainMenu = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const userOID = await AsyncStorage.getItem('userOID');
    if (!userOID) {
      console.log("No user OID found");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/citaspendientes/${userOID}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setNotifications(data); // Asumiendo que `data` es un arreglo de notificaciones
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
  // Agrega más estilos según necesites
});

export default MainMenu;
