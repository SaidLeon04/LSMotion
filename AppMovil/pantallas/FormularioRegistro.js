import React, { useState } from 'react';
import { StyleSheet, Image, SafeAreaView, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';

const FormularioRegistro = ({ route, navigation }) => {
  const { nombreUsuario, edad } = route.params; // Recibe nombreUsuario y edad desde el formulario anterior
  const [email, setEmail] = useState(''); // Correo ahora se llama email
  const [password, setPassword] = useState(''); // Contraseña ahora se llama password
  const [verifyPassword, setVerifyPassword] = useState(''); // Verificación de contraseña
  const [secureText, setSecureText] = useState(true);

  const toggleSecureText = () => setSecureText(!secureText);

  const handleRegister = async () => {
    if (!email || !password || !verifyPassword) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    if (password !== verifyPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }

    // Imprimir los datos antes de registrar
    console.log('Datos a registrar:', {
      nombre_usuario: nombreUsuario, // Nombre de usuario
      email, // Correo electrónico
      password, // Contraseña
      edad, // Edad
    });

    try {
      const response = await axios.post('https://new-folder-7x97.onrender.com/register', {
        nombre_usuario: nombreUsuario, // Enviar nombre de usuario
        email, // Enviar correo
        password, // Enviar contraseña
        edad, // Enviar edad
      });

      if (response.status === 201) {
        alert('¡Registro exitoso!');
        navigation.navigate('Login'); // Redirige a la pantalla principal o inicio de sesión
      }
    } catch (error) {
      console.error('Error al registrar:', error.response?.data || error);
      alert('Ocurrió un error al registrar el usuario.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image source={require('../assets/Logo.png')} style={styles.logo} />
        <TextInput
          label="Correo electrónico"
          mode="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="Contraseña"
          mode="outlined"
          secureTextEntry={secureText}
          style={styles.input}
          right={
            <TextInput.Icon name={secureText ? "eye-off" : "eye"} onPress={toggleSecureText} />
          }
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          label="Verifique contraseña"
          mode="outlined"
          secureTextEntry={secureText}
          style={styles.input}
          right={
            <TextInput.Icon name={secureText ? "eye-off" : "eye"} onPress={toggleSecureText} />
          }
          value={verifyPassword}
          onChangeText={setVerifyPassword}
        />
        <Button mode="outlined" style={styles.button} labelStyle={styles.buttonText} onPress={handleRegister}>
          Registrar
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
  buttonText: {
    color: '#2b5e62', // Aquí el color del texto que proporcionaste
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FormularioRegistro;
