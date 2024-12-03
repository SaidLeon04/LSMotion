import React, { useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; 

const FormularioCrearCuenta = ({ navigation }) => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [edad, setEdad] = useState('');

  const handleNext = () => {
    if (!nombreUsuario || !edad) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (isNaN(edad) || parseInt(edad) <= 0) {
      alert('Por favor, introduce una edad válida.');
      return;
    }

    // Navegar al siguiente formulario, pasando los datos
    navigation.navigate('FormularioRegistro', { nombreUsuario, edad });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
        <TextInput
          label="Nombre de usuario"
          mode="outlined"
          style={styles.input}
          value={nombreUsuario}
          onChangeText={setNombreUsuario}
        />
        <TextInput
          label="Edad"
          mode="outlined"
          style={styles.input}
          keyboardType="numeric"
          value={edad}
          onChangeText={setEdad}
        />
        <Button mode="outlined" style={styles.button} onPress={handleNext}>
          Continuar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollView: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  logo: { width: 50, height: 50, marginBottom: 30 },
  input: { width: '80%', marginBottom: 15 },
  button: { marginTop: 20, width: '80%' },
});

export default FormularioCrearCuenta;
