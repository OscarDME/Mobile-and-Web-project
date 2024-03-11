import { View, Text, Button } from 'react-native';
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../utils/conf";


const MainMenu = ({ navigation }) => {
  
  const [oid, setOid] = useState("");
  useEffect(() => {
    AsyncStorage.getItem("userOID")
      .then((value) => {
        if (value !== null) {
          setOid(value);
          console.log("OID obtenido:", value);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el OID:", error);
      });
  }, []);

  console.log("OID:", oid);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Chat</Text>
    </View>
  );
};

export default MainMenu;