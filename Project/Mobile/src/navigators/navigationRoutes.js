import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login } from '../screens/Inicio/login.js';
import { Welcome } from '../screens/Registro/WelcomeScreen';
import { UserData } from '../screens/Registro/UserData';
import { BasicInfo } from '../screens/Registro/BasicInfo';

const StackMain = createNativeStackNavigator();

const MainStack = () => {
  return(
    <StackValidation.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerShown: false
        }}>
        <StackValidation.Screen
          name='WelcomeScreen'
          component={Welcome} />
    </StackValidation.Navigator>
  );
}

const StackValidation = createNativeStackNavigator();
const ValidationStack = () => {
    return (
      <StackValidation.Navigator
        initialRouteName='WelcomeScreen'
        screenOptions={{
          headerShown: false
        }}>
        <StackValidation.Screen
          name='WelcomeScreen'
          component={Welcome} />
        <StackValidation.Screen
          name='FirstPageForm'
          component={UserData} />
        <StackValidation.Screen
          name='BasicInfoForm'
          component={BasicInfo} />
        <StackValidation.Screen
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
          component={PhysicForm} />
      </StackValidation.Navigator>
    );
  }

 //Main Root
const MainRoot = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Home" component={MainStack} />
        <Drawer.Screen name="Validation" component={ValidationStack} />
        {/* Otros Screen dentro del Drawer */}
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MainRoot;
  



