import React, {useState, useEffect} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
const screenHeight = Dimensions.get("window").height-100;
const screenWidth = Dimensions.get("window").width - 40;
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";


const Warnings = ({ navigation }) => {
  const [oid, setOid] = useState("");
  const [warnings, setWarnings] = useState([]);
  const [filteredWarnings, setFilteredWarnings] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(true);


  const descripcionAdvertenciaMap = {
    1: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        cuenta con más de 4 ejercicios de un mismo músculo en
        <Text style={styles.emphasis}> {warning.dia}</Text>.
        Esto no es recomendado porque puede sobrecargar el músculo.
      </Text>
    ),
    2: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        cuenta con más de 12 ejercicios de un solo músculo en toda la semana.
        Se recomienda distribuir mejor los ejercicios entre los distintos días, 
        trabajar un mismo músculo varias veces por semana puede que no sea lo ideal
        y podrías llegar a sobrecargarlo. Es recomendado distribuir mejor los ejercicios entre los distintos grupos musculares.
      </Text>
    ),
    3: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre} </Text>, 
        cuenta con más de 8 ejercicios en el día <Text style={styles.emphasis}> {warning.dia}</Text>.
        Esto puede llegar a ser muy extenso y pesado para una sola sesión de entrenamiento, 
        se recomienda distribuir mejor los ejercicios entre los distintos días.
      </Text>
    ),
    4: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        tiene dos días consecutivos en los que se trabajan los mismos grupos musculares principales, 
        esto no es recomendado ya que el músculo necesita tiempo para recuperarse.
        Distribuya mejor los grupos musculares trabajados entre los distintos días de su entrenamiento.
      </Text>
    ),
    5: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        cuenta con 5 días consecutivos de entrenamiento sin descanso entre ellos, 
        lo recomendable es dejar al menos un día de descanso entre sesiones para que
        el cuerpo se recupere adecuadamente.
      </Text>
    ),
    6: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        tiene una duración mayor a 2 horas sin tomar en cuenta los descansos, 
        lo recomendable es que una rutina no supere las 2 horas de duración total para evitar fatiga excesiva.
      </Text>
    ),
    7: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        tiene algunos ejercicios con un descanso menor a 1 minuto en el día 
        <Text style={styles.emphasis}> {warning.dia}</Text>, lo recomendable es tomar mas 1 minuto de descanso entre 
        ejercicios para que el cuerpo se recupere adecuadamente y que las series sean efectivas.
      </Text>
    ),
    8: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        realiza el mismo ejercicio más de 3 veces en la misma semana.
        Es recomendable variar los ejercicios para trabajar todos los músculos de forma equilibrada.
      </Text>
    ),
    9: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        entrena menos de 4 músculos en la semana, se recomienda trabajar al menos 4 grupos musculares
         distintos para lograr un entrenamiento equilibrado.
      </Text>
    ),
    10: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, 
        utiliza el mismo material en 4 ejercicios o más en el dia 
        <Text style={styles.emphasis}>{warning.dia}</Text> sin variarlo. Es recomendable
        alternar los materiales utilizados durante las sesiones de entrenamiento.
      </Text>
    ),
    11: (warning) =>(
      <Text style={styles.achievementDescription}>
        En la rutina <Text style={styles.emphasis}>{warning.nombre}</Text>
        hay 3 ejercicios o más los cuales tienen un nivel de dificultad alto en el día
        <Text style={styles.emphasis}>{warning.dia}</Text>, 
        es recomendable distribuir mejor los ejercicios de alta intensidad entre los días para evitar sobrecargar al cuerpo.
      </Text>
    ),
    13: (warning) =>(
      <Text style={styles.achievementDescription}>
        La rutina <Text style={styles.emphasis}>{warning.nombre}</Text>, que te asignaste para entrenar
        tiene ejercicios los cuales interfieren con tu lesión la cual especificaste en tu perfil, 
        se recomienda modificar la rutina eliminando o sustituyendo esos ejercicios por otros que no afecten la zona lesionada.
      </Text>
    ),
    14: (warning) =>(
      <Text style={styles.achievementDescription}>
        Los objetivos de entrenamiento de la rutina <Text style={styles.emphasis}>{warning.nombre}</Text>
        no se alinean con tus objetivos de entrenamiento declarados en tu perfil.
        ¿Estás seguro que esta rutina es la ideal para ti?
      </Text>
    ),
    15: (warning) =>(
      <Text style={styles.achievementDescription}>
        Al terminar tu última sesión de entrenamiento,
        nos percatamos de que duró más de lo que debería haber durado, 
        recuerda que es importante respetar los tiempos de descanso y las repeticiones para que
        tu entrenamiento sea efectivo y seguro.
      </Text>
    ),
    16: (warning) =>(
      <Text style={styles.achievementDescription}>
        Al terminar tu última sesión de entrenamiento,
        nos dimos cuenta que algunos de los pesos utilizados fueron al menos 20% mayores comparados a la sesión anterior 
        a esta, recuerda incrementar los pesos de forma gradual para evitar lesiones.
      </Text>
    )
  };
  

  const categoryToTimeIdMap = {
    "Todas": null, 
    "Al asignarse una rutina": 2,
    "Al terminar un entrenamiento": 3,
    "Al crear una rutina": 1,
  };


  const [selectedCategory, setSelectedCategory] = useState("Todas");

  useEffect(() => {
    AsyncStorage.getItem("userOID").then((value) => {
      if (value) {
        setOid(value);
        console.log("Entrra a advertencias User OID: " + value);

        fetchWarnings(value); 
      }
    });
  }, []);
  
  useEffect(() => {
    const updateFilteredWarnings = () => {
      const timeId = categoryToTimeIdMap[selectedCategory];
      const newFilteredWarnings = timeId == null ? warnings : warnings.filter(warning => warning.ID_AdvertenciaTiempo === timeId);
  
      setFilteredWarnings(newFilteredWarnings);
    };
  
    updateFilteredWarnings();
  }, [warnings, selectedCategory]); 
  
  const fetchWarnings = async (oidValue) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/allWarnings/${oidValue}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setWarnings(data);
      } else {
        throw new Error("No se pudieron obtener las advertencias");
      }
    } catch (error) {
      console.error('Error al cargar advertencias:', error);
    }
  };

  useEffect(() => {
    if (oid && shouldFetch) {
      fetchWarnings(oid);
      setShouldFetch(false);
    }
  });


  const handleCategoryFilter = (category) => {
    setSelectedCategory(category); 
  

    const timeId = categoryToTimeIdMap[category];
    const filteredWarnings = timeId == null ? warnings : warnings.filter(warning => warning.ID_AdvertenciaTiempo === timeId);
    setFilteredWarnings(filteredWarnings);
  };


  const handleNavigate = (warning) => {
    switch(warning.ID_AdvertenciaTiempo) {
      case 1: // Al crear una rutina
      navigation.navigate('DetallesRutina', { routineId: warning.ID_Rutina });
        break;
      case 2: // Al asignarse una rutina
        navigation.navigate('DetallesRutina', { routineId: warning.ID_Rutina });
        break;
      case 3: // Al terminar un entrenamiento
        console.log("Navigating with:", { screen: 'ProgressExercise' });
        navigation.navigate('Progreso', { screen: 'ProgressExercise' });
        break;
      default:
        console.log('No navigation handler for this warning');
    }
  };


  return (
    <>
    <View style={styles.header}>
    <Text style={styles.title}>Mejoras a tu entrenamiento y advertencias</Text>
  </View>
  <ScrollView
          horizontal
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Todas")}
            style={[
              styles.categoryButton,
              selectedCategory === "Todas" ? styles.selectedButton : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Al asignarse una rutina")}
            style={[
              styles.categoryButton,
              selectedCategory === "Al asignarse una rutina" ? styles.selectedButton : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Al asignarse una rutina</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Al terminar un entrenamiento")}
            style={[
              styles.categoryButton,
              selectedCategory === "Al terminar un entrenamiento" ? styles.selectedButton : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Al terminar un entrenamiento</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Al crear una rutina")}
            style={[
              styles.categoryButton,
              selectedCategory === "Al crear una rutina" ? styles.selectedButton : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Al crear una rutina</Text>
          </TouchableOpacity>
  </ScrollView>
    <ScrollView style={styles.container}>
    {filteredWarnings.map((warning, index) => (
      <TouchableOpacity  onPress={() => handleNavigate(warning)} key={index}>
    <View  style={styles.item}>
      <View style={[styles.achievementHeader, 
          warning.ID_AdvertenciaTiempo === 1 ? styles.achievementsCreate : 
          warning.ID_AdvertenciaTiempo === 2 ? styles.achievementsAssign : 
          warning.ID_AdvertenciaTiempo === 3 ? styles.achievementRealize : null
        ]}>
        <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>{warning.Descripcion}</Text>
      </View>
      <View style={[
          warning.ID_AdvertenciaTiempo === 1 ? styles.achievementBodyCreate : 
          warning.ID_AdvertenciaTiempo === 2 ? styles.achievementBodyAssign : 
          warning.ID_AdvertenciaTiempo === 3 ? styles.achievementBodyRealize : null
        ]}>
          {typeof descripcionAdvertenciaMap[warning.ID_DescripcionAdvertencia] === 'function' ?
            descripcionAdvertenciaMap[warning.ID_DescripcionAdvertencia](warning) :
            <Text style={styles.achievementDescription}>
              {descripcionAdvertenciaMap[warning.ID_DescripcionAdvertencia]}
            </Text>
          }
        </View>
      </View>
      </TouchableOpacity>
    ))}
    </ScrollView>
    </>
  )
};

export default Warnings;


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: "80%",
    width: '100%',
  },
  item: {
    display: 'flex',
    marginVertical: 10,
    alignContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  achievementTitle:{
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
    padding: 10,
  },
  achievementHeader:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementRealize:{
    backgroundColor: '#9F7AEA',
    padding: 10,
    width:screenWidth,
    borderRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
    paddingHorizontal: 20,
  },
  achievementsAssign:{
    backgroundColor: '#F6E05E',
    padding: 10,
    width:screenWidth,
    borderRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
    paddingHorizontal: 20,

  },
  achievementsCreate:{
    backgroundColor: '#4FD080',
    padding: 10,
    width:screenWidth,
    borderRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
    paddingHorizontal: 20,

  },
  achievementBody:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementBodyCreate:{
    backgroundColor: '#CFF2DC',
    paddingVertical: 10,
    padding: 10,
    borderTopLeftRadius:0,
    width:screenWidth,
    borderTopRightRadius:0,
    borderRadius: 10,
  },
  achievementBodyAssign:{
    backgroundColor: '#FCF3C5',
    padding: 10,
    borderTopLeftRadius:0,
    width:screenWidth,
    borderTopRightRadius:0,
    borderRadius: 10,
  },
  achievementBodyRealize:{
    backgroundColor: '#D9CAF7',
    padding: 10,
    width:screenWidth,
    borderTopLeftRadius:0,
    borderTopRightRadius:0,
    borderRadius: 10,
  },
  emphasis:{
    fontWeight: 'bold',
    color: '#333333',
  },
  achievementDescription:{
    fontSize: 16,
    color: '#333333',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15
  },
  title: {
    fontSize: 24,
  },
  scrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },  selectedButton: {
    backgroundColor: "#a0a0a0", // Un color diferente para destacar la selección
  },
  categoryButton: {
    alignContents: "center",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 20,
  },
})