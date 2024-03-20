import React, { useState, useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Descubre from "../../assets/descubre.png";
import Comidas from "../../assets/comidas.png";
import Biblioteca from "../../assets/biblioteca.png";
import Advertencias from "../../assets/advertencias.png";
import Viaje from "../../assets/viaje.png";
const height_proportion = '-180%';

const Mas = ({ onDismiss }) => {
  const [preferences, setPreferences] = useState({});

  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const userOID = await AsyncStorage.getItem('userOID');
    if (!userOID) {
      console.log("No user OID found");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/user/${userOID}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setPreferences({
        ComparacionRendimiento: data.ComparacionRendimiento,
        ViajeGimnasio: data.ViajeGimnasio,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


  const handleModalClose = () => {
    onDismiss();
  };

  const handleIconPress = (routeName) => {
    navigation.navigate(routeName);
    handleModalClose();
  };

  return (
      <View style={styles.modalContainer}> 
        <Modal
          visible
          onRequestClose={handleModalClose}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.contentContainer}>
            <TouchableOpacity onPress={() => handleIconPress("Descubre")} style={styles.touchableOpacity}>
              <Image source={Descubre} style={styles.icon}/>                
              <Text>Descubre</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleIconPress("Comidas")} style={styles.touchableOpacity}>
              <Image source={Comidas} style={styles.icon} />              
              <Text>Comidas</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleIconPress("Biblioteca")} style={styles.touchableOpacity}>
            <Image source={Biblioteca} style={styles.icon} />              
              <Text>Biblioteca</Text>
            </TouchableOpacity>
            {preferences.ViajeGimnasio && (
            <TouchableOpacity onPress={() => handleIconPress("Viaje")} style={styles.touchableOpacity}>
            <Image source={Viaje} style={styles.icon} />              
              <Text>Viaje</Text>
            </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleIconPress("Advertencias")} style={styles.touchableOpacity}>
            <Image source={Advertencias} style={styles.icon} />              
              <Text>Advertencia</Text>
            </TouchableOpacity>
          </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    modalContainer: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 60,
        zIndex: 10,
      },
      contentContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        borderColor: "#ddd",
        bottom: height_proportion,
      },
      icon: {
        alignItems: "center",
        width: 24,
        height: 24,
      },
      touchableOpacity: {
        alignItems: "center",
      },
});

export default Mas;
