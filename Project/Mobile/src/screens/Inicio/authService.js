import AsyncStorage from '@react-native-async-storage/async-storage';

const signOut = async (navigation) => {
  try {
    await AsyncStorage.clear();
    console.log("AsyncStorage cleared successfully");

    navigation.replace('Home');
    
  } catch (error) {
    console.error("Error clearing AsyncStorage:", error);
  }
};

export default signOut;
  
  