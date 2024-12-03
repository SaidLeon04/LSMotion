import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    // Bloquear la orientación en modo landscape (horizontal)
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    // Limpiar la orientación cuando el componente se desmonte (opcional)
    return () => {
      ScreenOrientation.unlockAsync(); // Permitir rotación cuando se desmonta
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Ocultar la barra de estado */}
      <StatusBar style="light" hidden={true} />
      <AppNavigator /> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
