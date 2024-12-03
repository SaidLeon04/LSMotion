import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

const PracticeMode = () => {
  const cameraRef = useRef(null);
  const socketRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [serverResponse, setServerResponse] = useState("");

  useEffect(() => {
    // Solicitar permisos de cámara
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    // Establecer conexión WebSocket
    socketRef.current = new WebSocket("ws://localhost:5000/video-stream");

    // Escuchar mensajes del servidor
    socketRef.current.onmessage = (event) => {
      setServerResponse(event.data);
      console.log("Respuesta del servidor:", event.data);
    };

    // Limpieza al desmontar
    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (hasPermission && cameraRef.current) {
      // Capturar frames y enviarlos al WebSocket
      const intervalId = setInterval(async () => {
        if (cameraRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
          const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
          socketRef.current.send(photo.base64); // Enviar el frame como base64
        }
      }, 100); // Capturar frames cada 100ms

      return () => clearInterval(intervalId);
    }
  }, [hasPermission]);

  if (hasPermission === null) {
    return <Text>Solicitando permisos...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No se otorgaron permisos para usar la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Letra: {serverResponse}</Text>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.front} // Cámara frontal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  text: { color: "white", textAlign: "center", margin: 10 },
  camera: { flex: 1 },
});

export default PracticeMode;
