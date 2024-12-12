import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const PracticeMode = ({ navigation }) => {

  // Respuestas interactivas
  const respuestas = ["Casi lo logras", "Bien", "Ajusta tu posición", "Sigue asi", "Un poco mas preciso"];

  const [movementsList, setMovementsList] = useState([]);

  const pastelColors = [
    "#A3C9FF", // Azul claro pastel
    "#FFB3B3", // Rojo pastel
    "#FFEB99"  // Amarillo pastel
  ];

  
  // Establecer tipo de cámara
  const CameraType = ['front', 'back']; 
  const [facing, setFacing] = useState(CameraType[0]);



  const [permission, requestPermission] = useCameraPermissions();

  const [cameraRef, setCameraRef] = useState(null);
  const socketRef = useRef(null);
  const [serverResponse, setServerResponse] = useState('');

  useEffect(() => {
    setServerResponse("¡Mueve tus manos para comenzar!");
    if (socketRef.current === null || socketRef.current.readyState === WebSocket.CLOSED) {
     // socketRef.current = new WebSocket("wss://handdetection-api.onrender.com/video-stream");
      socketRef.current = new WebSocket("ws://localhost:5000/video-stream");
      
      // Depración de la conexión, no hace nada en el funcionamiento
     socketRef.current.onopen = () => {
      console.log("Conexión WebSocket abierta: ", socketRef.current.readyState);
      };
  
      // Manejar mensajes desde el servidor
      if (socketRef.current) {
        socketRef.current.onmessage = (event) => {
          setServerResponse(event.data);
          if (event.data === 'Sin letra detectada'){
            const randomPhrase = Math.floor(Math.random() * respuestas.length);
            setServerResponse(respuestas[randomPhrase]);
          }else{
            setServerResponse(event.data);
            const newMovement = event.data;
            setMovementsList((prevList) => [...prevList, newMovement]);
          }
        };
      }

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, []);
  

  useEffect(() => {
    if (cameraRef && socketRef.current) {
      
      const intervalId = setInterval(() => {
        if (cameraRef) {
          cameraRef.takePictureAsync({ base64: true }).then((photo) => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
              fetch(photo.uri)
                .then(res => res.blob())
                .then(blob => {
                  socketRef.current.send(blob);
                })
                .catch(err => console.error('Error al enviar imagen:', err));
            }
          });
        }
      }, 2000); // Captura cada 100ms
  
      // Limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    } else {
      console.log("Esperando a la cámara o WebSocket...", socketRef.current.readyState);
    }
  }, [cameraRef, socketRef.current?.readyState]);
  

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }  

  return (
    <View style={styles.container}>
  <View style={styles.cameraContainer}>

    <View style={styles.movementsContainer}>
      <Text style={styles.movementsTitle}>Lista de movimientos</Text>
      <ScrollView>
        {movementsList.map((movement, index) => (
          <View key={index} style={styles.movementCard}>
            <Text style={styles.movementItem}>{movement}</Text>
          </View>
        ))}
      </ScrollView>
    </View>

    <View style={styles.cameraWrapper}>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={(ref) => setCameraRef(ref)}
      />
      <Text style={styles.response}>{serverResponse}</Text>  
    </View>

    {/* Usamos TouchableOpacity para el botón */}
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.backButton} // Estilo del botón
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.backButtonText}>Volver</Text>
      </TouchableOpacity>
    </View>

  </View>
</View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cameraContainer: {
    flexDirection: 'row',
    width: '100%',
    height: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movementsContainer: {
    width: '30%',
    padding: 10,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
  },
  cameraWrapper: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 20,
    margin: 20,
  },
  camera: {
    width: '100%',
    height: 200,
    backgroundColor: 'lightgray',
  },
  buttonContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'left',
    marginTop: 5,
     width: '15a%'
  },
  backButton: {
    backgroundColor: '#2b5e62', // Color de fondo del botón
    paddingVertical: 12,
    borderRadius: 15,
    width: '100%', // Asegura que ocupe todo el ancho disponible
    alignItems: 'center',
    justifyContent: 'left',
  },
  backButtonText: {
    color: '#fff', // Color del texto
    fontSize: 18, // Tamaño del texto
    fontWeight: 'bold', // Estilo del texto
  },
  response: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  movementsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  movementCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '100%',
  },
});

export default PracticeMode;