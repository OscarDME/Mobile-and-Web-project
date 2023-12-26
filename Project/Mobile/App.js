import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from './src/screens/Inicio/login';


export default function App() {
return (
  <NavigationContainer>
    <Login/>
  </NavigationContainer>
);
}