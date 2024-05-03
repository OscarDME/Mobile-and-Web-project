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
import { SelectList } from "react-native-dropdown-select-list";
import config from "../../utils/conf";


const dayOptions = [
  { key: '1', value: '1 día' },
  { key: '2', value: '2 días' },
  { key: '3', value: '3 días' },
  { key: '4', value: '4 días' },
  { key: '5', value: '5 días' },
  { key: '6', value: '6 días' },
  { key: '7', value: '7 días' }
];

const durationOptions = [
  { key: '<1', value: '< 1 hora' },
  { key: '1-2', value: '1-2 horas' },
  { key: '2-3', value: '2-3 horas' },
  { key: '>3', value: '> 3 horas' }
];


const MainMenu = ({ navigation }) => {
  const [rutinas, setRutinas] = useState([]);
  const [rutinasPublicas, setRutinasPublicas] = useState([]);
  const [rutinasSugeridas, setRutinasSugeridas] = useState([]);
  const [selectedDayFilter, setSelectedDayFilter] = useState('');
  const [selectedDurationFilter, setSelectedDurationFilter] = useState('');
  const [selectedPublicDayFilter, setSelectedPublicDayFilter] = useState('');
  const [selectedPublicDurationFilter, setSelectedPublicDurationFilter] = useState('');

  const fetchRutinas = async () => {
    try {
      const oid = await AsyncStorage.getItem("userOID");
      const response = await fetch(`${config.apiBaseUrl}/rutinas/${oid}`);
      if (response.ok) {
        let data = await response.json();

        // Aplicar filtros si están establecidos
        if (selectedDayFilter) {
          data = data.filter(r => r.CantidadDiasEntreno === parseInt(selectedDayFilter));
        }
        if (selectedDurationFilter) {
          const durationMapping = {
            '<1': [0, 59],
            '1-2': [60, 119],
            '2-3': [120, 179],
            '>3': [180, Infinity]
          };
          const [min, max] = durationMapping[selectedDurationFilter];
          data = data.filter(r => r.DuracionTotalMinutos >= min && r.DuracionTotalMinutos <= max);
        }

        setRutinas(data);
      } else {
        console.log("Error al obtener las rutinas");
      }
    } catch (error) {
      console.error("Error al cargar las rutinas:", error);
    }
  };

  const fetchRutinasPublicas = async () => {
    try {
      const oid = await AsyncStorage.getItem("userOID");
      const response = await fetch(`${config.apiBaseUrl}/rutinaspublicas/${oid}`);
      if (response.ok) {
        let data = await response.json();

        // Aplicar filtros si están establecidos
        if (selectedPublicDayFilter) {
          data = data.filter(r => r.CantidadDiasEntreno === parseInt(selectedPublicDayFilter));
        }
        if (selectedPublicDurationFilter) {
          const durationMapping = {
            '<1': [0, 59],
            '1-2': [60, 119],
            '2-3': [120, 179],
            '>3': [180, Infinity]
          };
          const [min, max] = durationMapping[selectedPublicDurationFilter];
          data = data.filter(r => r.DuracionTotalMinutos >= min && r.DuracionTotalMinutos <= max);
        }

        setRutinasPublicas(data);
      } else {
        console.log("Error al obtener las rutinas públicas");
      }
    } catch (error) {
      console.error("Error al cargar las rutinas públicas:", error);
    }
  };

  // Datos de ejemplo para las rutina
  useEffect(() => {
    fetchRutinas();
    fetchRutinasPublicas();
    fetchRutinasSugeridas();
  }, []);

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
                console.log("Error al obtener las rutinas sugeridas");
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
      setSelectedDayFilter('');
      setSelectedDurationFilter('');
      setSelectedPublicDayFilter('');
      setSelectedPublicDurationFilter(''); 
    });
  
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchRutinas();
    fetchRutinasPublicas();
  }, [selectedDayFilter, selectedDurationFilter, selectedPublicDayFilter, selectedPublicDurationFilter]);

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
        <View style={styles.filters}>
        <View style={styles.firstFilter}>
          <SelectList
            setSelected={setSelectedDayFilter}
            data={dayOptions}
            placeholder="Días"
          />
        </View>
          <SelectList
            setSelected={setSelectedDurationFilter}
            data={durationOptions}
            placeholder="Duración"
          />
        </View>
      </View>
      <ScrollView
        horizontal={true}
        style={styles.rutinasContainer}
        showsHorizontalScrollIndicator={false}
      >
      {rutinas.length > 0 ? (
        rutinas.map((rutina) => (
          <TouchableOpacity
            key={rutina.ID_Rutina}
            style={styles.rutinaCard}
            onPress={() => navigation.navigate("DetallesRutina", { routineId: rutina.ID_Rutina })}
          >
            <Text style={styles.rutinaNombre}>{rutina.NombreRutina}</Text>
            <Text style={styles.rutinaAutor}>Por: {rutina.Autor}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noRutinasText}>No hay rutinas para mostrar</Text>
      )}
      </ScrollView>
      <View style={styles.header}>
      <Text style={styles.secondTitle}>Rutinas Públicas</Text>
      <View style={styles.filtersPublicas}>
        <View style={styles.firstFilter}>
          <SelectList
            setSelected={setSelectedPublicDayFilter}
            data={dayOptions}
            placeholder="Días"
          />
        </View>
          <SelectList
            setSelected={setSelectedPublicDurationFilter}
            data={durationOptions}
            placeholder="Duración"
          />
        </View>
      </View>
      <ScrollView
        horizontal={true}
        style={styles.rutinasContainer2}
        showsHorizontalScrollIndicator={false}
      >
        {rutinasPublicas.length > 0 ? (
        rutinasPublicas.map((rutina) => (
          <TouchableOpacity
            key={rutina.ID_Rutina}
            style={styles.rutinaCard}
            onPress={() => navigation.navigate("DetallesRutinaVisualizar", { routineId: rutina.ID_Rutina })}
          >
            <Text style={styles.rutinaNombre}>{rutina.NombreRutina}</Text>
            <Text style={styles.rutinaAutor}>Por: {rutina.Autor}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noRutinasText}>No hay rutinas públicas para mostrar</Text>
      )}
      </ScrollView>
      <Text style={styles.thirdTitle}>Rutinas Sugeridas</Text>
      <ScrollView
        horizontal={true}
        style={styles.rutinasContainer3}
        showsHorizontalScrollIndicator={false}
      >
         {rutinasSugeridas.length > 0 ? (
        rutinasSugeridas.map((rutina) => (
          <TouchableOpacity
            key={rutina.ID_Rutina}
            style={styles.rutinaCard}
            onPress={() => navigation.navigate("DetallesRutinaVisualizar", { routineId: rutina.ID_Rutina })}
          >
            <Text style={styles.rutinaNombre}>{rutina.NombreRutina}</Text>
            <Text style={styles.rutinaAutor}>Por: {rutina.Autor}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noRutinasText}>No hay rutinas sugeridas para mostrar</Text>
      )}
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
    marginBottom: 10,
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
    marginRight: 80,
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
    marginBottom: 0,
    marginTop:10,
  },
  rutinasContainer2: {
    flexDirection: "row",
    marginBottom: 0,
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
  filters: {
    flexDirection: 'row',
    width: '22%',
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
    position:'relative',
  },
  filtersPublicas: {
    flexDirection: 'row',
    width: '22%',
    height: 40,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  firstFilter: {
    marginRight: 10,
  },
  noRutinasText: {
    fontSize: 18,
    color: 'grey',
    textAlign: 'center',
    marginTop: 20,
    alignSelf: 'center', // Asegúrate de que el texto se centre correctamente en el ScrollView
  },
});

export default MainMenu;
