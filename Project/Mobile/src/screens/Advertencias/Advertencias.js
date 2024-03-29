import React, {useState, useEffect} from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Dimensions } from "react-native";
import { AntDesign } from '@expo/vector-icons';
const screenHeight = Dimensions.get("window").height-100;
const screenWidth = Dimensions.get("window").width - 40;

const MainMenu = ({ navigation }) => {
  //SOLAMENTE PONGO TODOS LOS TIPOS DE ADVERTENCIAS QUE HAY, HABRA QUE MAPEAR SOBRE TODOS ESTOS
  const [selectedCategory, setSelectedCategory] = useState("Todas"); // Nuevo estado para la categoría seleccionada


  const handleCategoryFilter = (category) => {
    setSelectedCategory(category); // Actualiza la categoría seleccionada
    if (category === "Todas") {

    } else if (category === "Al asignarse una rutina") {

    } else if (category === "Al terminar un entrenamiento") {

    }else if (category === "Al crear una rutina") {

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
      <View style={styles.item}>
      <View style={[styles.achievementHeader, styles.achievementConsistency]}>
      <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Carga</Text>
        </View>
        <View style={styles.achievementBodyConsistency}>
        <Text style={styles.achievementDescription}>
          En tu última sesión de entrenamiento, nos dimos cuenta que pasaste de levantar
          <Text style={styles.emphasis}> 20kg </Text>en
          <Text style={styles.emphasis}> press de banca </Text> 
          a <Text style={styles.emphasis}> 269kg</Text>, en comparacion a la semana anterior.
          Ten cuidado al aumentar cargas de una manera tan agresiva, ya que podría causar lesiones.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader, styles.achievementConsistency]}>
      <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Sesión prolongada</Text>
        </View>
        <View style={styles.achievementBodyConsistency}>
        <Text style={styles.achievementDescription}>
          En tu último entrenamiento duraste un total de <Text style={styles.emphasis}> 3 horas y 45 minutos</Text>,
          cuando debio durar un total de 
          <Text style={styles.emphasis}> 3 horas y 30 minutos</Text>,
          ten en cuenta que debes respetar los tiempos de descanso y repeticiones de tu rutina.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader,  styles.achievementsResistence]}>
      <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Lesión</Text>
        </View>
        <View style={styles.achievementBodyResistence}>
        <Text style={styles.achievementDescription}>
          La rutina <Text style={styles.emphasis}> KFC </Text>
          que tienes asignada, puede dañarte el 
           <Text style={styles.emphasis}> hombro </Text>
           ten cuidado al realizar el entrenamiento.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader,  styles.achievementsResistence]}>
      <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Objetivo</Text>
        </View>
        <View style={styles.achievementBodyResistence}>
        <Text style={styles.achievementDescription}>
          La rutina <Text style={styles.emphasis}> me voy a desmayar </Text>
          puede que no se alinee con tu objetivo de entrenamiento.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader, styles.achievementsStrength]}>
      <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Sobreentrenamiento</Text>
        </View>
        <View style={styles.achievementBodyStrenght}>
          <Text style={styles.achievementDescription}>
          La rutina<Text style={styles.emphasis}> ill go shredded or ill die</Text>,
          tiene 
           <Text style={styles.emphasis}> 5 días </Text>
           consecutivos sin descanso, recuerda que debes descansar.
          </Text>
        </View>
      </View>
      <View style={styles.item}>
      <View style={[styles.achievementHeader, styles.achievementsStrength]}>
      <AntDesign name="warning" size={24} color="#333333" />
        <Text style={styles.achievementTitle}>Variabilidad</Text>
        </View>
        <View style={styles.achievementBodyStrenght}>
          <Text style={styles.achievementDescription}>
          La rutina<Text style={styles.emphasis}> patas de canguro </Text>
          cuenta con demasiados ejercicios de 
           <Text style={styles.emphasis}> pierna</Text>.
           ¿Estas realizando el ejercicio correcto?
          </Text>
        </View>
      </View>
    </ScrollView>
    </>
  )
};

export default MainMenu;


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