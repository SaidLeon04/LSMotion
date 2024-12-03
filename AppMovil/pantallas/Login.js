import React from "react";
import { ScrollView, View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform } from "react-native";
import { Button, TextInput } from "react-native-paper"; // Usamos React Native Paper para los componentes estilizados

const Login= ({ navigation }) => {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Logo */}
        <Image
          source={require("../assets/Logo.png")} 
          style={styles.logo}
        />

        {/* Título */}
        <Text style={styles.title}>LSMotion</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

        {/* Botones */}
        <View style={styles.buttonsContainer}
        >
          <Button
            mode="outlined"
            style={[styles.button, styles.buttonMarginRight]}
            onPress={() => navigation.navigate('FormularioLogin')} 
             
          >
            Iniciar sesión
          </Button>
          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.navigate('FormularioCrearCuenta')} 
          >
            Crear una cuenta
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1, // Permite el scroll cuando el contenido es más grande que la pantalla
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row", // Alineación horizontal de los botones
    justifyContent: "space-between",
    width: "80%",
  },
  button: {
    width: "48%", // Ajustamos el ancho de cada botón
  },
  buttonMarginRight: {
    marginRight: 10, // Añadimos un pequeño espacio entre los botones
  },
});

export default Login;
