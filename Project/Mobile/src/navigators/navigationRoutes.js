import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import  Login  from '../screens/Inicio/login.js';
import  Welcome  from '../screens/Registro/WelcomeScreen';
import  UserData  from '../screens/Registro/UserData';
import  BasicInfo  from '../screens/Registro/BasicInfo';

{/* Shit to solve:
1. The username must be unique (solve if the username is added on B2C AD or in the app itself)
2. The user must be able to go backwards within screens in the nested stack and not only in the main stack
3. Validate if the user is already registered in the app to show the register menu
4. Finish the questionnaire for personalized routines
*/}



const StackMain = createNativeStackNavigator();

const MainStack = () => {
  return(
    <StackMain.Navigator
        initialRouteName='Login'
        screenOptions={{
          headerShown: false
        }}>
        <StackMain.Screen
          name='Login'
          component={Login} />
    </StackMain.Navigator>
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
  }

  const Stack = createNativeStackNavigator();

 //Main Rootkt
 const MainRoot = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen
          name='Home'
          component={MainStack}
        />
        <Stack.Screen
          name='Validation'
          component={ValidationStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


export default MainRoot;
  



