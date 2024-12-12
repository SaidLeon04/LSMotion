import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // Importar los íconos
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Hook de navegación

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation(); // Hook para manejar navegación

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");

        if (!token) {
          console.log("Token no encontrado");
          setError("Token no encontrado");
          setLoading(false);
          return;
        }

        const response = await axios.get("https://new-folder-7x97.onrender.com/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;

        // Normalizar datos:
        const avatarUrl = user.avatar.startsWith("http")
          ? user.avatar
          : `https://new-folder-7x97.onrender.com/uploads/${user.avatar}`;

        setUserData({
          ...user,
          avatar: avatarUrl,
          progreso: {
            ...user.progreso,
            curva_aprendizaje: user.progreso.curva_aprendizaje.length
              ? user.progreso.curva_aprendizaje
              : [0, 0, 0, 0], // Valores por defecto
          },
          logros: user.logros || [], // Asegurar que sea un arreglo
        });

        setLoading(false);
      } catch (err) {
        setError("Error al cargar los datos del perfil");
        setLoading(false);
        console.log(
          "Error en la solicitud:",
          err.response ? err.response.data : err
        );
      }
    };

    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("authToken"); // Elimina el token
      navigation.replace("Login"); // Redirige a la pantalla de inicio de sesión
    } catch (err) {
      console.log("Error al cerrar sesión:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get("window").width;

  const sections = [
    { id: "avatar", type: "avatar", data: userData.avatar },
    { id: "stats", type: "stats", data: userData.progreso },
    { id: "achievements", type: "achievements", data: userData.logros },
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case "avatar":
        return (
          <View style={styles.section}>
            {item.data ? (
              <Image source={{ uri: item.data }} style={styles.avatar} />
            ) : (
              <MaterialCommunityIcons
                name="account-circle" // Ícono por defecto si no hay avatar
                size={120}
                color="#3f51b5" // Puedes elegir otro color para el ícono
              />
            )}
            <Text style={styles.username}>{userData.nombre_usuario}</Text>
          </View>
        );
      case "stats":
        const aprendizajeData = (item.data.curva_aprendizaje || []).map((valor) =>
          typeof valor === "number" ? valor : 0
        );

        const hasData = aprendizajeData.some((valor) => valor > 0);

        return (
          <View style={[styles.section, styles.statsSection]}>
            <Text style={styles.sectionTitle}>Estadísticas</Text>
            <Text style={styles.statText}>
              <Text style={styles.bold}>Niveles completados:</Text>{" "}
              {item.data.niveles_completados}
            </Text>
            <Text style={styles.statText}>
              <Text style={styles.bold}>Horas dedicadas:</Text>{" "}
              {item.data.horas_dedicadas} horas
            </Text>

            {hasData ? (
              <>
                <Text style={styles.bold}>Curva de aprendizaje semanal:</Text>
                <LineChart
                  data={{
                    labels: ["Semana 1", "Semana 2", "Semana 3", "Semana 4"],
                    datasets: [
                      {
                        data: aprendizajeData.map((progreso) =>
                          (progreso * 100).toFixed(1)
                        ),
                      },
                    ],
                  }}
                  width={screenWidth - 40}
                  height={220}
                  yAxisSuffix="%"
                  chartConfig={{
                    backgroundColor: "#fff",
                    backgroundGradientFrom: "#fff",
                    backgroundGradientTo: "#fff",
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
                    labelColor: (opacity = 1) =>
                      `rgba(63, 81, 181, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726",
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                />
              </>
            ) : (
              <Text style={styles.noDataText}>
                No hay datos disponibles para la curva de aprendizaje.
              </Text>
            )}
          </View>
        );
      case "achievements":
        return (
          <View style={[styles.section, styles.achievementsSection]}>
            <Text style={styles.sectionTitle}>Logros</Text>
            {item.data && item.data.length > 0 ? (
              item.data.map((logro, index) => (
                <View style={styles.achievementItem} key={index}>
                  <Text style={styles.achievementIcon}>{logro.icono}</Text>
                  <Text style={styles.achievementText}>{logro.nombre}</Text>
                </View>
              ))
            ) : (
              <Text>No hay logros disponibles</Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={sections.filter((section) => !!section.data)}
        keyExtractor={(item) => item.id}
        renderItem={renderSection}
        contentContainerStyle={styles.container}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeButtonText}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.homeButtonlog} onPress={handleLogout}>
          <Text style={styles.homeButtonTextlog}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  section: {
    marginBottom: 30,
    alignItems: "center",
    width: "100%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  statsSection: {
    alignItems: "flex-start",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3f51b5",
    alignSelf: "flex-start",
  },
  statText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
  },
  achievementsSection: {
    alignItems: "flex-start",
    width: "100%",
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  achievementText: {
    fontSize: 16,
    color: "#333",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#2b5e62',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '30%',
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
  homeButtonlog: {
    backgroundColor: '#2b5e62',
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '30%',
    alignSelf: 'center',
    borderRadius: 25,
    elevation: 5, 
  },
  homeButtonTextlog: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Profile;
