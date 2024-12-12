import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

const GameLevels = ({navigation}) => {
  const [levels, setLevels] = useState([]);
  const API_URL = "https://new-folder-7x97.onrender.com"; // Cambia a tu URL del backend

  // Función para obtener los niveles desde la API
  const fetchLevels = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_levels`);
      setLevels(response.data.levels);
    } catch (error) {
      console.error("Error al obtener los niveles:", error.response?.data || error.message);
    }
  };
  

  useEffect(() => {
    fetchLevels();
  }, []);

  // Estilo dinámico basado en el estado del nivel
  const getCardStyle = (estado) => {
    switch (estado) {
      case "activo":
        return { ...styles.card, backgroundColor: "#4CAF50" }; // Verde
      case "completado":
        return { ...styles.card, backgroundColor: "#2196F3", opacity: 0.7 }; // Azul
      case "inactivo":
        return { ...styles.card, backgroundColor: "#9E9E9E" }; // Gris
      default:
        return styles.card;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de Niveles</Text>
      <ScrollView contentContainerStyle={styles.levelsContainer}>
        {levels.map((level) => (
          <TouchableOpacity
            key={level._id}
            style={getCardStyle(level.estado)}
            disabled={level.estado !== "activo"}
            onPress={() => {
              Alert.alert(`Iniciando nivel: ${level.nombre_nivel}`);
            }}
          >
            <Text style={styles.cardTitle}>{level.nombre_nivel}</Text>
            <Text style={styles.cardText}>Dificultad: {level.dificultad}</Text>
            <Text style={styles.cardText}>Estado: {level.estado}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.homeButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  levelsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  card: {
    width: 150,
    height: 120,
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  cardText: {
    fontSize: 14,
    color: "#fff",
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#2b5e62',
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '50%',
    alignSelf: 'center',
    borderRadius: 25,
    elevation: 5, 
  },
  homeButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GameLevels;
