import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";

const MainMenu = ({ navigation }) => {
  const [rutinas, setRutinas] = useState([]);
  const [rutinasPublicas, setRutinasPublicas] = useState([]);
  const [rutinasSugeridas, setRutinasSugeridas] = useState([]);

  const fetchRutinas = async () => {
    console.log("Cargando rutinas");
    try {
      const oid = await AsyncStorage.getItem("userOID");
      if (oid) {
        const response = await fetch(`${config.apiBaseUrl}/rutinas/${oid}`);
        if (response.ok) {
          const rutinasObtenidas = await response.json();
          console.log(rutinasObtenidas);
          setRutinas(rutinasObtenidas);
        } else {
          console.error("Error al obtener las rutina");
        }
      }
    } catch (error) {
      console.error("Error al cargar las rutinas:", error);
    }
  };

  // Datos de ejemplo para las rutina
  useEffect(() => {
    fetchRutinas();
  }, []);

  const fetchRutinasPublicas = async () => {
    console.log("Cargando rutinas");
    try {
      const oid = await AsyncStorage.getItem("userOID");
      if (oid) {
        const response = await fetch(`${config.apiBaseUrl}/rutinaspublicas/${oid}`);
        if (response.ok) {
          const rutinasObtenidas = await response.json();
          console.log(rutinasObtenidas);
          setRutinasPublicas(rutinasObtenidas);
        } else {
          console.error("Error al obtener las rutinas publicas");
        }
      }
    } catch (error) {
      console.error("Error al cargar las rutinas:", error);
    }
  };

  const fetchRutinasSugeridas = async () => {
    console.log("Cargando rutinas sugeridas");
    try {
        const oid = await AsyncStorage.getItem("userOID");
        if (oid) {
            const response = await fetch(`${config.apiBaseUrl}/rutinassugeridas/${oid}`);
            if (response.ok) {
                const rutinasSugeridasObtenidas = await response.json();
                console.log(rutinasSugeridasObtenidas);
                setRutinasSugeridas(rutinasSugeridasObtenidas); // Usa el mismo estado si quieres reemplazar las publicas con sugeridas
            } else {
                console.error("Error al obtener las rutinas sugeridas");
            }
        }
    } catch (error) {
        console.error("Error al cargar las rutinas sugeridas:", error);
    }
};


  // Datos de ejemplo para las rutinas
  useEffect(() => {
    fetchRutinasPublicas();
  }, []);


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchRutinas();
      fetchRutinasSugeridas(); 
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddRutina")}
          style={styles.addButton}
        >
          <Ionicons name="add" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Mis Rutinas</Text>
      </View>
      <ScrollView
        horizontal={true}
        style={styles.rutinasContainer}
        showsHorizontalScrollIndicator={false}
      >
        {rutinas.map((rutina) => (
          <TouchableOpacity
            key={rutina.ID_Rutina}
            style={styles.rutinaCard}
            onPress={() =>
              navigation.navigate("DetallesRutina", {
                routineId: rutina.ID_Rutina,
              })
            }
          >
            <Text style={styles.rutinaNombre}>{rutina.NombreRutina}</Text>
            <Text style={styles.rutinaAutor}>Por: {rutina.Autor}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.secondTitle}>Rutinas Públicas</Text>
      <ScrollView
        horizontal={true}
        style={styles.rutinasContainer2}
        showsHorizontalScrollIndicator={false}
      >
        {rutinasPublicas.map((rutina) => (
          <TouchableOpacity
            key={rutina.ID_Rutina}
            style={styles.rutinaCard}
            onPress={() =>
              navigation.navigate("DetallesRutinaVisualizar", {
                routineId: rutina.ID_Rutina,
              })
            }
          >
            <Text style={styles.rutinaNombre}>{rutina.NombreRutina}</Text>
            <Text style={styles.rutinaAutor}>Por: {rutina.Autor}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Text style={styles.thirdTitle}>Rutinas Sugeridas</Text>
      <ScrollView
        horizontal={true}
        style={styles.rutinasContainer3}
        showsHorizontalScrollIndicator={false}
      >
        {rutinasSugeridas.map((rutina) => (
          <TouchableOpacity
            key={rutina.ID_Rutina}
            style={styles.rutinaCard}
            onPress={() =>
              navigation.navigate("DetallesRutinaVisualizar", {
                routineId: rutina.ID_Rutina,
              })
            }
          >
            <Text style={styles.rutinaNombre}>{rutina.NombreRutina}</Text>
            <Text style={styles.rutinaAutor}>Por: {rutina.Autor}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "flex-end", // Cambia a 'flex-start' para alinear a la izquierda
    width: "100%",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    flex:1,
    marginLeft: 10,
    // Ajusta el margen para alinear el texto como desees
  },
  secondTitle: {
    fontSize: 24,
    flex:1,
    marginRight: 200,
    marginBottom: 25,
    // Ajusta el margen para alinear el texto como desees
  },
  thirdTitle: {
    fontSize: 24,
    flex:1,
    marginRight: 180,
    width: 200,
    marginBottom: 25,
    // Ajusta el margen para alinear el texto como desees
  },
  rutinasContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  rutinasContainer2: {
    flexDirection: "row",
    marginBottom: 5,
  },
  rutinasContainer3: {
    flexDirection: "row",
    marginBottom: 0,
  },
  rutinaCard: {
    backgroundColor: "#0790cf",
    borderRadius: 10,
    height: 150,
    padding: 20,
    marginRight: 16,
    width: 250, // Ajusta el ancho según tus necesidades
  },
  rutinaNombre: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
    color:"#fff",
  
  },
  rutinaAutor: {
    fontSize: 16,
    color:"#fff",
  },
  // Agrega más estilos aquí según sea necesario
});

export default MainMenu;
