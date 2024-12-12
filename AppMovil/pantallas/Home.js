import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import bgMusic from '../assets/bgmusic.mp3';


const Home = ({ navigation }) => {
  
  const bgMusic = require('../assets/bgmusic.mp3');
  const [sound, setSound] = useState(null);

  const [userName, setUserName] = useState("Usuario");
  const [token, setToken] = useState(null);


  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el payload
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime; // Verifica si ha expirado
    } catch (error) {
      console.error("Error al procesar el token:", error);
      return true; // Si hay un error, asumir que el token está expirado
    }
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("authToken");
        if (storedToken) {
          if (isTokenExpired(storedToken)) {
            // Si el token ha expirado, redirige a Login
            await AsyncStorage.removeItem("authToken"); // Limpia el token expirado
            navigation.replace("Login");
          } else {
            setToken(storedToken);
            const storedName = await AsyncStorage.getItem("userName");
            if (storedName) setUserName(storedName);
          }
        } else {
          // Si no hay token, redirige a Login
          navigation.replace("Login");
        }
      } catch (error) {
        console.error("Error al verificar el token:", error);
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
  const handleButtonPress = () => {
    handleNavigation("GameLevels");
  };

  return (
    <View style={styles.container}>
      {/* Logo en la esquina superior izquierda */}
      <View style={styles.logoContainer}>
        <Image source={require("../assets/Logo.png")} style={styles.logo} />
      </View>

      {/* Perfil en la esquina superior derecha */}
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => handleNavigation("Profile")}>
          <MaterialCommunityIcons name="account-circle" size={50} color="#2b5e62" />
        </TouchableOpacity>
        {token && <Text style={styles.userName}>{userName}</Text>}
      </View>

      {/* Contenido central con botones principales */}
      <View style={styles.centerContainer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => handleNavigation("GameLevels")}
        >
          <Text style={styles.mainButtonText}>Jugar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => handleNavigation("PracticeMode")}
        >
          <Text style={styles.secondaryButtonText}>Modo Práctica</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de glosario */}
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
    backgroundColor: "#F4F7F6", // Fondo suave y claro
    justifyContent: "center",
    padding: 20,
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  profileContainer: {
    position: "absolute",
    top: 40,
    right: 20,
    alignItems: "center",
  },
  userName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    color: "#2b5e62", // Texto en verde suave para contraste
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButton: {
    backgroundColor: "#FF5C5C", // Color vibrante para el botón principal
    paddingVertical: 20,
    paddingHorizontal: 50,
    borderRadius: 25, // Bordes más redondeados
    marginBottom: 30,
    width: "80%",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  secondaryButton: {
    backgroundColor: "#FF9F5C", // Complementario pero suave
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: "70%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  mainButtonText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
  },
  secondaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  glossaryButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "#2b5e62", // Consistente con el perfil
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  glossaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Home;