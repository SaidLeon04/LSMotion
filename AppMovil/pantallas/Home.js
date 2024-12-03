import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import bgMusic from '../assets/bgmusic.mp3';


const Home = ({ navigation }) => {
  
  const bgMusic = require('../assets/bgmusic.mp3');
  const [sound, setSound] = useState(null);

  const [userName, setUserName] = useState("Usuario");
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          setToken(storedToken);
          const storedName = await AsyncStorage.getItem("userName");
          if (storedName) setUserName(storedName);
        } else {
          // Si no hay token, redirige a Login
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error al obtener el token:", error);
        navigation.replace("Login");
      }
    };

    checkToken();
  }, [navigation]);

  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../assets/bgmusic.mp3") // Agrega el archivo de música en la carpeta assets
      );
      setSound(sound);
      await sound.playAsync(); // Reproducir la música
    };

    loadSound();

    return () => {
      if (sound) {
        sound.unloadAsync(); // Limpiar cuando el componente se desmonta
      }
    };
  }, []);

  const handleNavigation = (destination) => {
    if (!token) {
      // Si no hay token, redirige a Login
      navigation.replace("Login");
    } else {
      navigation.navigate(destination);
    }
  };

  return (
    <View style={styles.container}>
      {/* Perfil en la esquina superior derecha */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => handleNavigation("Profile")}>
          <MaterialCommunityIcons name="account-circle" size={50} color="#3f51b5" />
        </TouchableOpacity>
        {/* Mostrar el nombre solo si hay token */}
        {token && <Text style={styles.userName}>{userName}</Text>}
      </View>

      {/* Botones principales en el lado izquierdo */}
      <View style={styles.leftButtonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleNavigation("GameLevels")}
        >
          <Text style={styles.buttonText}>Jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonPractice}
          onPress={() => handleNavigation("PracticeMode")}
        >
          <Text style={styles.buttonText}>Modo Práctica</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de glosario en la esquina inferior derecha */}
      <TouchableOpacity
        style={styles.glossaryButton}
        onPress={() => handleNavigation("Glossary")}
      >
        <Text style={styles.glossaryButtonText}>Glosario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    alignItems: "center",
  },
  userName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#3f51b5",
  },
  leftButtonsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#3f51b5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: "70%",
  },
  buttonPractice: {
    backgroundColor: "#3f51b5",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    width: "50%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  glossaryButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#3f51b5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  glossaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;
