import React, { useEffect, useState, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import { decode as atob } from "base-64";
import { Menu } from "react-native-paper";
import Logo from "../../assets/logo.png";

import IRutinas from "../../assets/rutinas.png";
import IEntrenamiento from "../../assets/entrenamiento.png";
import ICalendario from "../../assets/calendario.png";
import IMore from "../../assets/mas.png";
import IProgreso from "../../assets/progreso.png";

import Login from "../screens/Inicio/login.js";
import Welcome from "../screens/Registro/WelcomeScreen";
import UserData from "../screens/Registro/UserData";
import BasicInfo from "../screens/Registro/BasicInfo";
import ConfirmScreen from "../screens/Questionnarie/FirstPageForm";
import TrainingSchedule from "../screens/Questionnarie/TimeAndDaysForm";
import MainMenu from "../screens/AppScreens/MainMenu";
import TrainingGoalsScreen from "../screens/Questionnarie/ObjectivesMuscleAndInjuriesForm.js";
import PhysicAndSpace from "../screens/Questionnarie/PhysicAndSpace";
import Generating from "../screens/Questionnarie/Generating";
import TestScreen from "../screens/PhysicalTestScreens/FirstPageTest";
import PushUpsTest from "../screens/PhysicalTestScreens/PushUpsTestExp";
import PushUpResultInputScreen from "../screens/PhysicalTestScreens/PushUpTestRes.js";
import SitUpTest from "../screens/PhysicalTestScreens/SitUpTest";
import SitUpResultInputScreen from "../screens/PhysicalTestScreens/SitUpTestRes.js";
import Entrenamiento from "../screens/Entrenamiento/Entrenamiento";
import Calendario from "../screens/Calendario/Calendario";
import DetallesCita from "../screens/Calendario/DetallesCita";
import Rutinas from "../screens/Rutinas/Rutinas";
import Progreso from "../screens/Progreso/Progreso";
import Perfil from "../screens/Perfil/Perfil";
import Chat from "../screens/Chat/Chat";
import Notificaciones from "../screens/Notificaciones/Notificaciones";
import Mas from "../components/modal";
import Descubre from "../screens/Descubre/Descubre";
import Comidas from "../screens/Comidas/Comidas";
import Biblioteca from "../screens/Biblioteca/Biblioteca";
import Advertencias from "../screens/Advertencias/Advertencias";
import Viaje from "../screens/Viaje/Viaje";
import Muscles from "../screens/Questionnarie/Muscles";
import Materials from "../screens/Questionnarie/Materials";
import Select from "../screens/PhysicalTestScreens/SelectTest";
import Rockport from "../screens/PhysicalTestScreens/RockportTest";
import Cooper from "../screens/PhysicalTestScreens/CooperTest";
import RockportInput from "../screens/PhysicalTestScreens/RockportTestIn";
import CooperInput from "../screens/PhysicalTestScreens/CooperTestIn";
import Cardiac from "../screens/PhysicalTestScreens/Cardiac";
import UserInfo from "../screens/PhysicalTestScreens/UserInfo"
import CongratulationsScreen from "../screens/PhysicalTestScreens/Congratulations";
import DetallesEjercicio from "../screens/Biblioteca/DetallesEjercicio";
import AddRutina from "../screens/Rutinas/AddRutina";
import AddEjercicio from "../screens/Rutinas/AddEjercicio";
import AddSets from "../screens/Rutinas/AddSets";
import DetallesRutina from "../screens/Rutinas/DetallesRutina";
import EditarRutina from "../screens/Rutinas/EditRoutine";
import Ejercicios from "../screens/Rutinas/Ejercicios";
import Detalles from "../screens/Rutinas/Detalles"
import UserChat from "../screens/Chat/UserChat";
import Formulario1 from "../screens/Perfil/Formulario1"
import Formulario2 from "../screens/Perfil/Formulario2"
import DetallesEntrenador from "../screens/Descubre/Detalles"
import WorkoutScreen from "../screens/Entrenamiento/Ejercicios";
import IndividualBodyMeasure from "../screens/Progreso/IndividualBodyMeasure";
import DetallesRutinaVisualizar from "../screens/Rutinas/DetallesRutinaVisualizar";
import EditRoutineView from "../screens/Rutinas/EditRoutineView";
import AddEjercicioView from "../screens/Rutinas/AddEjercicioView";
import AddSetsView from "../screens/Rutinas/AddSetsView";
import AssignRoutineScreen from "../screens/Rutinas/AsignarRutina";

import Header from "../components/Header";
{
  /* Shit to solve:
1. The username must be unique (solve if the username is added on B2C AD or in the app itself)
2. The user must be able to go backwards within screens in the nested stack and not only in the main stack
3. Validate if the user is already registered in the app to show the register menu
4. Finish the questionnaire for personalized routines
5. Take the url from your own computer
*/
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

//Decode Token:
export const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decodedToken = JSON.parse(atob(payload));
    return decodedToken;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

//Footer
const Tab = createBottomTabNavigator();
const NewComponent = () => {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>New Component</Text>
    </View>
  );
};

const TabBarItem = ({
  label,
  focused,
  onPress,
  onLongPress,
  iconName,
  ...rest
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = () => {
    setIsModalVisible(true);
  };

  const renderIcon = () => {
    if (iconName) {
      return <Image source={iconName} style={styles.icon} />;
    }
    return null;
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityStates={focused ? ["selected"] : []}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ flex: 1, alignItems: "center" }}
      {...rest}
    >
      {renderIcon()}
      <Text style={{ color: focused ? "white" : "gray" }}>{label}</Text>
      <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Mas onDismiss={() => setIsModalVisible(false)} />
      </Modal>
    </TouchableOpacity>
  );
};

const TabBar = ({ state, descriptors, navigation }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalOpen = () => {
    console.log("Opening modal");
    setIsModalVisible(true);
  };

  return (
    <View>
      {/* Renderizar tab bar items */}
      <View style={{ flexDirection: "row", paddingBottom: 25, paddingTop:10 }}>
        <TabBarItem
          label="Rutinas"
          iconName={IRutinas}
          onPress={() => navigation.navigate("Rutinas")}
        />

        <TabBarItem
          label="Entrena"
          iconName={IEntrenamiento}
          onPress={() => navigation.navigate("Entrenamiento")}
        />

        <TabBarItem
          label="Calendario"
          iconName={ICalendario}
          onPress={() => navigation.navigate("Calendario")}
        />

        <TabBarItem
          label="Progreso"
          iconName={IProgreso}
          onPress={() => navigation.navigate("Progreso")}
        />

        <TabBarItem label="Más" iconName={IMore} onPress={handleModalOpen} />
        {console.log("isModalVisible:", isModalVisible)}
      </View>
      {isModalVisible && <Mas onDismiss={() => setIsModalVisible(false)} />}
    </View>
  );
};
const FooterTabs = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        header: ({ navigation }) => <Header navigation={navigation} />,
      }}
    >
      <Tab.Screen name="Rutinas" component={RutinasStack} />
      <Tab.Screen name="Entrenamiento" component={Entrenamiento} />
      <Tab.Screen name="Calendario" component={StackCalendar} />
      <Tab.Screen name="Progreso" component={ProgressBodyMeasuresStackScreen} />
      <Tab.Screen name="Mas" component={Mas} />
      <Tab.Screen name="Chat" component={ChatStack} />
      <Tab.Screen name="Notificaciones" component={Notificaciones} />
      <Tab.Screen name="Perfil" component={ProfileStack} />
      <Tab.Screen name="Descubre" component={DescubreStack} />
      <Tab.Screen name="Comidas" component={Comidas} />
      <Tab.Screen name="Biblioteca" component={BibliotecaStack} />
      <Tab.Screen name="Advertencias" component={Advertencias} />
      <Tab.Screen name="Viaje" component={Viaje} />

      {/* <Tab.Screen 
            name="More"
            component={Mas}
          /> */}
    </Tab.Navigator>
  );
};

const StackMain = createNativeStackNavigator();

const MainStack = () => {
  return (
    <StackMain.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackMain.Screen name="Login" component={Login} />
    </StackMain.Navigator>
  );
};


const CalendarStack = createNativeStackNavigator();
const StackCalendar = () => {
  return (
    <CalendarStack.Navigator
    initialRouteName="Calendario"
    screenOptions={{
      headerShown: false,
    }}
    >
      <CalendarStack.Screen name="Calendario" component={Calendario} />
      <CalendarStack.Screen name="DetallesCita" component={DetallesCita} />
    </CalendarStack.Navigator>
    );
  }

const TrainingStack = createNativeStackNavigator();

const TrainingStackScreen = () => {
  return (
    <TrainingStack.Navigator
    initialRouteName="WorkoutScreen"
    screenOptions={{
      headerShown: false,
      gestureEnabled: false,
    }}
  >
      <TrainingStack.Screen name="WorkoutScreen" component={WorkoutScreen} />
    </TrainingStack.Navigator>
  );
};

const ProgressBodyMeasuresStack = createNativeStackNavigator();

const ProgressBodyMeasuresStackScreen = () => {
  return (
    <ProgressBodyMeasuresStack.Navigator
    initialRouteName="Progreso"
    screenOptions={{
      headerShown: false,
    }}
  >
      <ProgressBodyMeasuresStack.Screen name="Progreso" component={Progreso} />
      <ProgressBodyMeasuresStack.Screen name="IndividualBodyMeasure" component={IndividualBodyMeasure} />
    </ProgressBodyMeasuresStack.Navigator>
  );
};


const StackProfile = createNativeStackNavigator();
const ProfileStack = () => {
  return (
    <StackProfile.Navigator
      initialRouteName="Perfil"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackProfile.Screen name="Perfil" component={Perfil} />
      <StackProfile.Screen name="Formulario1" component={Formulario1} />
      <StackProfile.Screen name="Formulario2" component={Formulario2} />
    </StackProfile.Navigator>
  );
};

const StackChat = createNativeStackNavigator();
const ChatStack = () => {
  return (
    <StackChat.Navigator
      initialRouteName="Chat"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackChat.Screen name="Chat" component={Chat} />
      <StackChat.Screen name="UserChat" component={UserChat} />
    </StackChat.Navigator>
  );
};

const StackRutinas = createNativeStackNavigator();
const RutinasStack = () => {
return (
    <StackRutinas.Navigator
      initialRouteName="Rutinas"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackRutinas.Screen name="Rutinas" component={Rutinas} />
      <StackRutinas.Screen name="AddRutina" component={AddRutina} />
      <StackRutinas.Screen name="DetallesRutina" component={DetallesRutina} />
      <StackRutinas.Screen name="EditarRutina" component={EditarRutina} />
      <StackRutinas.Screen name="AddEjercicio" component={AddEjercicio} />
      <StackRutinas.Screen name="Ejercicios" component={Ejercicios} />
      <StackRutinas.Screen name="Detalles" component={Detalles} />
      <StackRutinas.Screen name="AddSets" component={AddSets} />
      <StackRutinas.Screen name="DetallesRutinaVisualizar" component={DetallesRutinaVisualizar} />
      <StackRutinas.Screen name="EditarRutinaView" component={EditRoutineView} />
      <StackRutinas.Screen name="AnadirEjercicioView" component={AddEjercicioView} />
      <StackRutinas.Screen name="AddSetsView" component={AddSetsView} />
      <StackRutinas.Screen name="AsignarRutinas" component={AssignRoutineScreen} />
    </StackRutinas.Navigator>
  );
};

const StackDescubre = createNativeStackNavigator();

const DescubreStack = () => {
  return (
    <StackDescubre.Navigator
      initialRouteName="Descubre"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackDescubre.Screen name="Descubre" component={Descubre} />
      <StackDescubre.Screen name="DetallesEntre" component={DetallesEntrenador} />
    </StackDescubre.Navigator>
  );
};

const StackBiblioteca = createNativeStackNavigator();

const BibliotecaStack = () => {
  return (
    <StackBiblioteca.Navigator
      initialRouteName="Biblioteca"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackBiblioteca.Screen
        name="Biblioteca"
        component={Biblioteca}
      />
      <StackBiblioteca.Screen
        name="DetallesEjercicio"
        component={DetallesEjercicio}
      />
    </StackBiblioteca.Navigator>
  );
};

const StackValidation = createNativeStackNavigator();
const ValidationStack = () => {
  return (
    <StackValidation.Navigator
      initialRouteName="WelcomeScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackValidation.Screen name="WelcomeScreen" component={Welcome} />
      <StackValidation.Screen name="FirstPageForm" component={UserData} />
      <StackValidation.Screen name="BasicInfoForm" component={BasicInfo} />
      {/* <StackValidation.Screen
          name='TimeAndDaysForm'
          component={TimaDays} />
        <StackValidation.Screen
          name='ObjectivesMuscleAndInjuriesForm'
          component={ObjectivesMuscleAndInjuries} />
        <StackValidation.Screen
          name='MusclesAndSpace'
          component={MusclesSpace} />
        <StackValidation.Screen
          name='PhysicForm'
          component={PhysicForm} /> */}
    </StackValidation.Navigator>
  );
};

const StackQuestionnaire = createNativeStackNavigator();
const QuestionnaireStack = () => {
  return (
    <StackQuestionnaire.Navigator
      initialRouteName="FirstPageForm"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackValidation.Screen name="FirstPageForm" component={ConfirmScreen} />
      <StackValidation.Screen
        name="TimeAndDaysForm"
        component={TrainingSchedule}
      />
      <StackValidation.Screen name="Muscles" component={Muscles} />
      <StackValidation.Screen
        name="TrainingGoalsScreen"
        component={TrainingGoalsScreen}
      />
      <StackValidation.Screen
        name="PhysicAndSpace"
        component={PhysicAndSpace}
      />
      <StackValidation.Screen name="PhysicalTest" component={TestsStack} />
      <StackValidation.Screen name="Materials" component={Materials} />
      <StackValidation.Screen
        name="Generating"
        component={Generating}
        options={{ animationEnabled: true }}
      />
    </StackQuestionnaire.Navigator>
  );
};
const StackTests = createNativeStackNavigator();
const TestsStack = () => {
  return (
    <StackQuestionnaire.Navigator
      initialRouteName="PushUpsTest"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackValidation.Screen name="PushUpsTest" component={PushUpsTest} />
      <StackValidation.Screen name="PushUpsTestRes" component={PushUpResultInputScreen}/>
      <StackValidation.Screen name="SitUpTest" component={SitUpTest} />
      <StackValidation.Screen name="SitUpTestRes" component={SitUpResultInputScreen}/>
      <StackValidation.Screen name="Select" component={Select} />
      <StackValidation.Screen name="Rockport" component={Rockport} />
      <StackValidation.Screen name="Cooper" component={Cooper} />
      <StackValidation.Screen name="RockportIn" component={RockportInput} />
      <StackValidation.Screen name="CooperIn" component={CooperInput} />
      <StackValidation.Screen name="Cardiac" component={Cardiac} />
      <StackValidation.Screen name="UserInfo" component={UserInfo} />
      <StackValidation.Screen name="Congratulations" component={CongratulationsScreen} />
    </StackQuestionnaire.Navigator>
  );
};




//Provitional Menu
//Determine which kind of navigation are we going to use for the main menu

const StackMainMenu = createNativeStackNavigator();
const MainMenuStack = () => {
  return (
    <StackQuestionnaire.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
      }}
    >
      <StackValidation.Screen name="Main" component={Tabs} />
      <StackValidation.Screen name="MainMenu" component={FooterTabs} />
    </StackQuestionnaire.Navigator>
  );
};

const Stack = createNativeStackNavigator();

//Main Rootkt
const MainRoot = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={MainStack} />
        <Stack.Screen name="Validation" component={ValidationStack} />
        <Stack.Screen name="Questionnaire" component={QuestionnaireStack} />
        <Stack.Screen name="Main" component={FooterTabs} />
        <Stack.Screen name="TrainingStack" component={TrainingStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainRoot;
