import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; // Usamos React Native Paper para los componentes estilizados
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

WebBrowser.maybeCompleteAuthSession();

const FormularioLogin = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Estado para el correo
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const [secureText, setSecureText] = useState(true); // Estado para la visibilidad de la contraseña

  // Alternar visibilidad de contraseña
  const toggleSecureText = () => {
    setSecureText(!secureText);
  };


  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingresa tanto el correo como la contraseña.');
      return;
    }
  
    const loginData = { email, password };
  
    try {
      const response = await fetch('https://new-folder-7x97.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        Alert.alert('Éxito', 'Inicio de sesión exitoso!');
  
        // Guardar token y nombre en AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userName', data.name); // Guardar el nombre del usuario
  
        // Navegar a la pantalla Home
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', `Error: ${data.message}`);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Hubo un problema con la solicitud.');
    }
  };
  

  // Verificar si ya hay un token guardado (esto debe ejecutarse al iniciar la aplicación)
  useEffect(() => {
    const checkAuthToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        navigation.navigate('Home'); // Si hay un token, redirige al Home
      }
    };

    checkAuthToken();
  }, []); // Solo se ejecuta una vez al montar el componente

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={require('../assets/Logo.png')} // Asegúrate de que la imagen esté en la carpeta "assets"
          style={styles.logo}
        />

        <TextInput
          label="Correo electrónico"
          mode="outlined"
          style={styles.input}
          value={email}
          onChangeText={setEmail} // Actualiza el valor del correo
        />

        <TextInput
          label="Contraseña"
          mode="outlined"
          secureTextEntry={secureText} // Cambia la visibilidad según el estado
          style={styles.input}
          value={password}
          onChangeText={setPassword} // Actualiza el valor de la contraseña
          right={
            <TextInput.Icon
              name={secureText ? "eye-off" : "eye"} // Cambia el icono según el estado
              onPress={toggleSecureText} // Cambia la visibilidad al presionar el icono
            />
          }
        />

        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            style={styles.button }
            labelStyle={styles.buttonText}
            onPress={handleLogin} // Llamar a la función de inicio de sesión
          >
            Ingresar
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    position: 'absolute',
    top: 30,
    left: 20,
    width: 50,
    height: 50,
  },
  input: {
    width: '80%',
    marginBottom: 15,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center', // Centrar el botón
    alignSelf: 'center',
    width: '80%',
  },
  button: {
    width: '100%', // Hacer el botón más ancho
    paddingVertical: 12,
    borderRadius: 15,
  },
  buttonText: {
    color: '#2b5e62', // Aquí el color del texto que proporcionaste
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default FormularioLogin;
