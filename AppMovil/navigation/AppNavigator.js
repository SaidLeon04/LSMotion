import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../pantallas/Home';
import Login from '../pantallas/Login.js';
import Profile from '../pantallas/Profile.js';
import FormularioLogin from '../pantallas/FormularioLogin';
import FormularioCrearCuenta from '../pantallas/FormularioCrearCuenta';
import FormularioRegistro from '../pantallas/FormularioRegistro';
import GameLevels from '../pantallas/GameLevels';
import PracticeMode from '../pantallas/PracticeMode';
import Glossary from '../pantallas/glosario.js';

// Niveles
import AbcScrach from '../pantallas/levels/AbcScrach';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="FormularioLogin" component={FormularioLogin}  />
        <Stack.Screen name="FormularioCrearCuenta" component={FormularioCrearCuenta}/> 
        <Stack.Screen name="FormularioRegistro" component={FormularioRegistro}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="GameLevels" component={GameLevels}/>
        <Stack.Screen name="PracticeMode" component={PracticeMode}  options={{ headerShown: false }}/>
        <Stack.Screen name="Glossary" component={Glossary}/>
        <Stack.Screen name="AbcScrach" component={AbcScrach}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
