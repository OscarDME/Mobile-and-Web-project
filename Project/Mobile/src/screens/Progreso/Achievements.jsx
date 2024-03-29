import React from 'react'
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import { Feather } from '@expo/vector-icons';
const screenHeight = Dimensions.get("window").height-100;
const screenWidth = Dimensions.get("window").width - 40;


export default function Achievements() {
  //SOLAMENTE PONGO TODOS LOS TIPOS DE LOGROS QUE HAY, HABRA QUE MAPEAR SOBRE TODOS ESTOS
  return (
    <>
    <ScrollView style={styles.container}>
      <View style={styles.item}>
      <View style={[styles.achievementHeader, styles.achievementConsistency]}>
        <Feather name="award" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Logro por consistencia</Text>
        </View>
        <View style={styles.achievementBodyConsistency}>
        <Text style={styles.achievementDescription}>
          ¡No fallaste en ningún entrenamiento por <Text style={styles.emphasis}>3 semanas</Text>!
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader,  styles.achievementsResistence]}>
      <Feather name="award" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Logro por resistencia</Text>
        </View>
        <View style={styles.achievementBodyResistence}>
        <Text style={styles.achievementDescription}>
          En <Text style={styles.emphasis}>trote </Text>
          has aumentado 
           <Text style={styles.emphasis}> 10 minutos </Text>
           desde tu última marca personal. ¡Sigue así!
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader, styles.achievementsStrength]}>
      <Feather name="award" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Logro por aumento de fuerza</Text>
        </View>
        <View style={styles.achievementBodyStrenght}>
          <Text style={styles.achievementDescription}>
          En <Text style={styles.emphasis}>sentadilla con mancuerna </Text>
          has aumentado 
           <Text style={styles.emphasis}> 10kg </Text>
           desde tu última marca personal. ¡Sigue así!
          </Text>
        </View>
      </View>
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
  }
})