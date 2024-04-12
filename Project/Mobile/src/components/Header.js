import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Logo from "../../assets/logo.png";
import Chat from "../../assets/chat.png";
import Perfil from "../../assets/fotoperfil.png";
import Notificaciones from "../../assets/notificacion.png";

const HeaderComponent = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo on the left */}
      <TouchableOpacity onPress={() => navigation.navigate("Rutinas")}>
        <Image source={Logo} style={styles.logo} />
      </TouchableOpacity>

      {/* Empty View to push icons to the right */}
      <View style={{ flex: 1 }} />

      {/* Three icons on the right, linking to different screens */}
      <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
        <Image source={Chat} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Notificaciones")}>
        <Image source={Notificaciones} style={styles.icon} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
        <Image source={Perfil} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 15, 
    alignItems: "center",  // Align items in the center vertically
    padding: 10,  // Increase padding to increase header height
    backgroundColor: "#e6f0fa"
  },
  logo: {
    marginTop: 25,  // Adjust margin top to increase header height
    width: 55,
    height: 55,
  },
  icon: {
    marginTop: 20, 
    width: 30,
    height: 30,
    marginLeft: 20,  // Adjust margin left for spacing between logo and icons
  },
});

export default HeaderComponent;
