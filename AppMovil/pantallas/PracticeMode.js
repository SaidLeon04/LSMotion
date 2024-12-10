import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PracticeMode = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const socketRef = useRef(null);
  const [serverResponse, setServerResponse] = useState("");
  const [isSending, setIsSending] = useState(true);

  useEffect(() => {
    // Acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Conexión al WebSocket
        socketRef.current = new WebSocket("ws://localhost:5000/video-stream");

        socketRef.current.onmessage = (event) => {
          setServerResponse(event.data); // Actualiza la respuesta del servidor
          console.log("Respuesta del servidor:", event.data);
        };

        // Enviar frames al WebSocket
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const sendFrame = setInterval(() => {
          if (videoRef.current && ctx) {
            // Dibujar el video en el canvas
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            // Convertir el canvas a un Blob y enviarlo al WebSocket
            canvas.toBlob((blob) => {
              if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(blob);
              }
            }, "image/jpeg");
          }
        }, 100); // Capturar frames cada 100ms

        return () => clearInterval(sendFrame);
      })
      .catch((err) => console.error("Error al acceder a la cámara:", err));

    // Limpiar recursos al desmontar
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const toggleSending = () => {
    setIsSending((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.serverResponse}>Letra: {serverResponse}</Text>
      <video ref={videoRef} autoPlay muted style={styles.video}></video>
      <canvas ref={canvasRef} style={styles.canvas}></canvas>
      <TouchableOpacity style={styles.button} onPress={toggleSending}>
        <Text style={styles.buttonText}>{isSending ? 'Pausar' : 'Reanudar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  video: {
    width: '100%',
    height: 'auto',
    border: '2px solid black',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  canvas: {
    width: '100%',
    height: 'auto',
    display: 'none', // Ocultar el canvas, solo se usa para tomar los frames
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
  },
  serverResponse: {
    fontSize: 18,
    color: '#000',
  },
});

export default PracticeMode;