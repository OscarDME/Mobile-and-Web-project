import React, {useEffect, useState} from 'react'
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import { Feather } from '@expo/vector-icons';
const screenHeight = Dimensions.get("window").height-100;
const screenWidth = Dimensions.get("window").width - 40;
import config from "../../utils/conf";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';



export default function Achievements() {

  const [logroConsistencia, setLogroConsistencia] = useState({ semanas: 0, meses: 0, años: 0 });

  const [logrosPeso, setLogrosPeso] = useState([]);
  const [logrosResistencia, setLogrosResistencia] = useState([]);

  const timeStringToSeconds = (timeString) => {
    if (!timeString) return 0;
    const parts = timeString.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parseFloat(parts[2]); 
    return hours * 3600 + minutes * 60 + seconds;
  };

  const calculateTimeDifference = (tiempoUltimo, tiempoPenultimo) => {
    const dateUltimo = new Date(tiempoUltimo);
    const datePenultimo = new Date(tiempoPenultimo);
    const differenceInSeconds = (dateUltimo - datePenultimo) / 1000;
    return Math.abs(differenceInSeconds); 
  };
  

  useEffect(() => {
    const fetchOIDAndWorkoutData = async () => {
      const oid = await AsyncStorage.getItem("userOID");
      if (!oid) {
        console.error("OID not found");
        return;
      }
      fetchAchievements(oid);
    };
    fetchOIDAndWorkoutData();
  },[]);


  const fetchAchievements = async (oid) => {
    try {
      // Logros por consistencia de no fallar entrenamientos
      const response = await fetch(`${config.apiBaseUrl}/consistencyAchievements/${oid}`);
      const data = await response.json();
    
      if (Array.isArray(data)) {
        const semanasCompletadas = data.filter((semana) => semana.IsWeekCompleted).length;
        const mesesCompletados = Math.floor(semanasCompletadas / 4);
        const añosCompletados = Math.floor(mesesCompletados / 12);
  

        const logrosConsistenciaTransformados = {
          semanas: semanasCompletadas % 4,
          meses: mesesCompletados % 12,
          años: añosCompletados
        };
  
        setLogroConsistencia(logrosConsistenciaTransformados);
      } else {
        setLogroConsistencia({ semanas: 0, meses: 0, años: 0 });
      }


      // Logros por tiempo de ejercicios cardiovasculares
      const response2 = await fetch(`${config.apiBaseUrl}/cardiovascularAchievements/${oid}`);
      const data2 = await response2.json();
      console.log('tiempos', data2);
      if (Array.isArray(data2)) {
        const logrosTransformados = data2.map((logro) => {
          const tiempoDiferencia = calculateTimeDifference(logro.TiempoUltimo, logro.TiempoPenultimo);
          return {
            ultimoID: logro.UltimoID,
            serie: logro.ID_Serie,
            fechaUltimo: logro.FechaUltimo,
            fechaPenultimo: logro.FechaPenultimo,
            tiempoUltimo: logro.TiempoUltimo,
            tiempoPenultimo: logro.TiempoPenultimo,
            nombreEjercicio: logro.NombreEjercicio,
            tiempoDiferencia: tiempoDiferencia,
          };
        });
        setLogrosResistencia(logrosTransformados);
      } else {
        setLogrosResistencia([]); 
      }
    
      // Logros por peso de ejercicios compuestos
      const response3 = await fetch(`${config.apiBaseUrl}/compuoundAchievements/${oid}`);
      const data3 = await response3.json();
      if (Array.isArray(data3)) {
        const logrosTransformados2 = data3.map((logro) => ({
          ultimoID: logro.UltimoID,
          serie: logro.ID_Serie,
          fechaUltimo: logro.FechaUltimo,
          fechaPenultimo: logro.FechaPenultimo,
          pesoUltimo: logro.PesoUltimo,
          pesoPenultimo: logro.PesoPenultimo,
          nombreEjercicio: logro.NombreEjercicio
        }));
        setLogrosPeso(logrosTransformados2);
      } else {
        setLogrosPeso([]);
      }
    } catch (error) {
      console.error("Error al obtener los logros:", error);
    }
  };

  return (
    <>
    <ScrollView style={styles.container}>
    {(!logroConsistencia || (logroConsistencia.semanas === 0 && logroConsistencia.meses === 0 && logroConsistencia.años === 0)) && !logrosPeso.length && !logrosResistencia.length? (
      <View style={styles.centerContainer}>
        <Text style={styles.textNoAchievements}>Aún no tienes logros  <Entypo name="emoji-sad" size={24} color="black" />

         </Text>
         <Text style={styles.textNoAchievements}>!Sigue entrenando para conseguirlos!</Text>
      </View>
    ):(
      <>
      {logroConsistencia && (logroConsistencia.semanas > 0 || logroConsistencia.meses > 0 || logroConsistencia.años > 0) && (
        <View style={styles.item} key={"logroConsistencia"}>
          <View style={[styles.achievementHeader, styles.achievementConsistency]}>
            <Feather name="award" size={24} color="#333333" />
            <Text style={styles.achievementTitle}>Logro por consistencia</Text>
          </View>
          <View style={styles.achievementBodyConsistency}>
            <Text style={styles.achievementDescription}>
              ¡No fallaste en ningún entrenamiento por 
              <Text style={styles.emphasis}>
                {logroConsistencia.años > 0 ? ` ${logroConsistencia.años} año(s) ` : ""}
                {logroConsistencia.meses > 0 ? ` ${logroConsistencia.meses} mes(es) ` : ""}
                {logroConsistencia.semanas > 0 ? ` ${logroConsistencia.semanas} semana(s)` : ""}
              </Text>!
            </Text>
          </View>
        </View>
      )}
    {logrosResistencia.map((logro, index) => (
      <View style={styles.item} key={index}>
      <View style={[styles.achievementHeader,  styles.achievementsResistence]}>
      <Feather name="award" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Logro por resistencia</Text>
        </View>
        <View style={styles.achievementBodyResistence}>
        <Text style={styles.achievementDescription}>
          En <Text style={styles.emphasis}>{logro.nombreEjercicio} </Text>
          has aumentado 
           <Text style={styles.emphasis}> {logro.tiempoDiferencia} minutos </Text>
           desde tu última marca personal. ¡Sigue así!
          </Text>
        </View>
      </View>
    ))}

    {logrosPeso.map((logro, index) => (
      <View style={styles.item} key={index}>
      <View style={[styles.achievementHeader, styles.achievementsStrength]}>
      <Feather name="award" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Logro por aumento de fuerza</Text>
        </View>
        <View style={styles.achievementBodyStrenght}>
          <Text style={styles.achievementDescription}>
          En <Text style={styles.emphasis}>{logro.nombreEjercicio} </Text>
          has aumentado 
           <Text style={styles.emphasis}> {(Number(logro.pesoUltimo)-  Number(logro.pesoPenultimo).toString())}kg </Text>
           desde tu último entrenamiento. ¡Sigue así!
          </Text>
        </View>
      </View>
    ))}
    </>
    )}
    </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: "80%",
    width: '100%',
    marginVertical: 20,

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
  achievementConsistency:{
    backgroundColor: '#9F7AEA',
    padding: 10,
    width:screenWidth,
    borderRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
  },
  achievementsResistence:{
    backgroundColor: '#F6E05E',
    padding: 10,
    width:screenWidth,
    borderRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
  },
  achievementsStrength:{
    backgroundColor: '#4FD080',
    padding: 10,
    width:screenWidth,
    borderRadius:10,
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0,
  },
  achievementBody:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementBodyStrenght:{
    backgroundColor: '#CFF2DC',
    paddingVertical: 10,
    padding: 10,
    borderTopLeftRadius:0,
    width:screenWidth,
    borderTopRightRadius:0,
    borderRadius: 10,
  },
  achievementBodyResistence:{
    backgroundColor: '#FCF3C5',
    padding: 10,
    borderTopLeftRadius:0,
    width:screenWidth,
    borderTopRightRadius:0,
    borderRadius: 10,
  },
  achievementBodyConsistency:{
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
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    height: screenHeight -250,
    alignSelf: "center",
  },
  textNoAchievements:{
    fontSize: 20,
    color: '#333333',
    fontWeight: 'bold',
    padding: 10,
  }
})