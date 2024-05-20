import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck, faTimes, faEdit, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import signOut from "../Inicio/authService";
import Chat from "../Chat/UserChat";
import { Rating } from "react-native-elements"; 
import config from "../../utils/conf";

const ProfileScreen = ({ route }) => {
  const [performanceModule, setPerformanceModule] = useState(false);
  const [gymModule, setGymModule] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [userData, setUserData] = useState({});
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [trainerData, setTrainerData] = useState([]); // Nuevo estado para almacenar los datos del entrenador/nutricionista
  const [rating, setRating] = useState(null); // Valor inicial arbitrario

  const updateCalificacion = async (clientId, calificacion) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/updatecalificacion`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: clientId,
          calificacion: calificacion,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update calificacion");
      }

      console.log(`Calificacion updated to ${calificacion}`);
    } catch (error) {
      console.error("Error updating calificacion:", error);
    }
  };

  const handleRatingCompleted = async (rating) => {
    console.log("Rating is: " + rating);
    setRating(rating);

    const userOID = await AsyncStorage.getItem("userOID");
    console.log("User OID: " + userOID);
    if (userOID) {
      updateCalificacion(userOID, rating);
    } else {
      console.log("No user OID found");
    }
  };

  const navigation = useNavigation();

  const updatePreference = async (preferenceName, value) => {
    const userOID = await AsyncStorage.getItem("userOID");
    if (!userOID) {
      console.log("No user OID f");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/${preferenceName}/${userOID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preference: preferenceName,
            value: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user preference");
      }

      console.log(`Preference ${preferenceName} updated to ${value}`);
    } catch (error) {
      console.error("Error updating user preference:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const togglePerformanceModule = (newValue) => {
    setPerformanceModule(newValue);
    updatePreference("Rendimiento", newValue);
  };

  const toggleGymModule = (newValue) => {
    setGymModule(newValue);
    updatePreference("ViajeGimnasio", newValue);
  };

  const handleLogoutFromTrainer = async (trainer) => {
    try {
      // Muestra una alerta de c
      const confirmLogout = await new Promise((resolve) => {
        Alert.alert(
          "Confirmación",
          "¿Estás seguro de que quieres desligarte de tu entrenador?",
          [
            {
              text: "Cancelar",
              onPress: () => resolve(false),
              style: "cancel",
            },
            {
              text: "Aceptar",
              onPress: () => resolve(true),
            },
          ],
          { cancelable: false }
        );
      });
  
      if (confirmLogout) {
        const userOID = await AsyncStorage.getItem("userOID");
        const response = await fetch(`${config.apiBaseUrl}/clientLeaveTrainer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clientUserID: userOID,
            trainerUserID: trainer.ID_Usuario,
          }),
        });
  
        if (response.ok) {
          // Si la llamada a la API es exitosa, actualiza los datos del entrenador en el estado
          setTrainerData(null);
          console.log("Te has desligado exitosamente del entrenador");
        } else {
          throw new Error("Error al desligarse del entrenador");
        }
      }
    } catch (error) {
      console.error("Error al desligarse del entrenador:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userOID = await AsyncStorage.getItem("userOID");
    if (!userOID) {
      console.log("No user OID found");
      return;
    }
    try {
      const response = await fetch(`${config.apiBaseUrl}/user/${userOID}`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      setUserData(data);
      setPerformanceModule(data.ComparacionRendimiento);
      setGymModule(data.ViajeGimnasio);
      const invitationsResponse = await fetch(
        `${config.apiBaseUrl}/pendingclient/${userOID}`,
        {
          method: "GET",
        }
      );

      if (!invitationsResponse.ok) {
        throw new Error("Failed to fetch pending invitation");
      }
      const invitationsData = await invitationsResponse.json();
      setPendingInvitations(invitationsData);
      const trainerResponse = await fetch(
        `${config.apiBaseUrl}/trainerinfo/${userOID}`,
        {
          method: "GET",
        }
      );

      if (trainerResponse.ok) {
        const traineData = await trainerResponse.json();
        setTrainerData(traineData);
        console.log("Trainer data:", trainerData);
      } else {
        setTrainerData(null);
      }
    } catch (error) {
      console.error("Error fetching user data or pending invitation:", error);
    }
  };

  const deleteTrainerClientRequest = async (ID_SolicitudEntrenadorCliente) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/deletesolicitud/${ID_SolicitudEntrenadorCliente}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Respuesta de red no fue ok");
      }

      console.log("Solicitud de entrenador a cliente eliminada correctamente");
    } catch (error) {
      console.error(
        "Error al eliminar la solicitud de entrenador a cliente:",
        error
      );
      throw error;
    }
  };

  const handleBecomeTrainerPress = () => {
    navigation.navigate("Formulario1");
  };

  const handleLogoutButtonPress = () => {
    signOut(navigation);
  };

  const handleAcceptInvitation = async (ID_SolicitudEntrenadorCliente) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/acceptclient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId: ID_SolicitudEntrenadorCliente,
        }),
      });
      if (!response.ok) {
        throw new Error("Respuesta de red no fue ok");
      }
      setPendingInvitations((prevInvitations) =>
        prevInvitations.filter(
          (invitation) =>
            invitation.ID_SolicitudEntrenadorCliente !==
            ID_SolicitudEntrenadorCliente
        )
      );
      console.log("Invitación aceptada exitosamente");
    } catch (error) {
      console.error("Error al aceptar la invitación:", error);
    }
  };

  const handleRejectInvitation = async (ID_SolicitudEntrenadorCliente) => {
    try {
      await deleteTrainerClientRequest(ID_SolicitudEntrenadorCliente);

      setPendingInvitations((prevInvitations) =>
        prevInvitations.filter(
          (invitation) =>
            invitation.ID_SolicitudEntrenadorCliente !==
            ID_SolicitudEntrenadorCliente
        )
      );
    } catch (error) {
      console.error(
        "Error al eliminar la solicitud de entrenador a cliente:",
        error
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{userData.nombre_usuario}</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.editIcon}>
          {/* <FontAwesomeIcon icon={faEdit} size={20} color="#0790cf" /> */}
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Mis datos:</Text>
        <Text style={styles.data}>
          {userData.nombre} {userData.apellido}
        </Text>
        <Text style={styles.data}>{userData.correo}</Text>
        <Text style={styles.data}>
          {userData.sexo === "H"
            ? "Hombre"
            : userData.sexo === "M"
            ? "Mujer"
            : "No especificado"}
        </Text>
        <Text style={styles.data}>
          {userData.fecha_nacimiento
            ? userData.fecha_nacimiento.split("T")[0]
            : "Fecha no disponible"}
        </Text>
      </View>

      <TouchableOpacity style={[styles.button, styles.completeButton]} onPress={() => {
  AsyncStorage.getItem('userOID').then(userOID => {
    if (userOID) {
      navigation.navigate('Questionnaire', { screen: 'TimeAndDaysForm', params: { oid: userOID } });
    } else {
      console.log("No user OID found");
    }
  });
}}>
  <Text style={styles.buttonText}>Completar/Modificar Cuestionario</Text>
</TouchableOpacity>


      <TouchableOpacity
        style={[styles.button, styles.becomeTrainerButton]}
        onPress={handleBecomeTrainerPress}
      >
        <Text style={styles.buttonText}>
          Convertirse en Entrenador/Nutricionista
        </Text>
      </TouchableOpacity>

      {trainerData && trainerData.length > 0 ? (
        trainerData.map((trainer, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.sectionTitle}>
              Datos del Entrenador/Nutricionista:
            </Text>
            <Text style={styles.data}>
              {trainer.nombre_entrenador} {trainer.apellido_entrenador} (
              {trainer.tipo_usuario_web})
            </Text>
            <View style={styles.ratingContainer}>
              <Rating
                imageSize={30}
                startingValue={trainer.calificacion_cliente} // Usar la califdentrenador/nutricionist
                ratingColor="#f1c40f" // Cambia el color de las estrellas
                onFinishRating={handleRatingCompleted}
                style={{ marginTop: 15 }} // Espaciado vertical desde el nombre
              />
            </View>
            <TouchableOpacity onPress={() => handleLogoutFromTrainer(trainer)}>
              <FontAwesomeIcon icon={faSignOutAlt} size={24} color="#cf0709"/>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <></>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Invitaciones:</Text>
        {pendingInvitations.map((invitation, index) => (
          <View style={styles.invitationContainer} key={index}>
            <Text style={styles.data}>
              {invitation.nombre_usuario_web} {invitation.apellido_usuario_web}{" "}
              ({invitation.tipo_usuario_web})
            </Text>
            <View style={styles.iconRow}>
              <TouchableOpacity
                onPress={() =>
                  handleAcceptInvitation(
                    invitation.ID_SolicitudEntrenadorCliente
                  )
                }
              >
                <FontAwesomeIcon icon={faCheck} size={24} color="#0790cf" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  handleRejectInvitation(
                    invitation.ID_SolicitudEntrenadorCliente
                  )
                }
              >
                <FontAwesomeIcon icon={faTimes} size={24} color="#cf0709" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Preferencias:</Text>
        <View style={styles.preference}>
          <Text style={styles.data}>Comparación de rendimiento</Text>
          <Switch
            value={performanceModule}
            onValueChange={togglePerformanceModule}
          />
        </View>
        <View style={styles.preference}>
          <Text style={styles.data}>Módulo de viaje a tu gimnasio</Text>
          <Switch value={gymModule} onValueChange={toggleGymModule} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogoutButtonPress}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    marginLeft: 20,
    backgroundColor: "transparent",
    textAlign: "left",
  },
  card: {
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
    padding: 20,
    margin: 20,
    marginTop: 0,
    elevation: 1,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: "#000",
    shadowOffset: { height: 0, width: 0 },
  },
  data: {
    fontSize: 18,
  },
  editIcon: {
    position: "absolute",
    top: 20,
    right: 30,
    padding: 8,
    borderRadius: 16,
    zIndex: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  invitationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: "row",
    width: 60,
    justifyContent: "space-between",
  },
  preference: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#0790cf",
    padding: 15,
    margin: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "#0790cf",
    marginBottom: -10,
  },
  becomeTrainerButton: {
    backgroundColor: "#0790cf",
  },
  logoutButton: {
    backgroundColor: "#cf0709",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // ... más estilos ...
});

export default ProfileScreen;
