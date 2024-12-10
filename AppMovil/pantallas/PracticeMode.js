import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const PracticeMode = ({ navigation }) => {
  
  // Establecer tipo de cámara
  const CameraType = ['front', 'back']; 
  const [facing, setFacing] = useState(CameraType[0]);


  const [permission, requestPermission] = useCameraPermissions();

  const [cameraRef, setCameraRef] = useState(null);
  const socketRef = useRef(null);
  const [serverResponse, setServerResponse] = useState('');

  useEffect(() => {
    
    if (socketRef.current === null || socketRef.current.readyState === WebSocket.CLOSED) {
      socketRef.current = new WebSocket("ws://localhost:5000/video-stream");
      console.log("socketRef.current:", socketRef.current);
      console.log("socketRef.current.readyState:", socketRef.current.readyState);
  

      socketRef.current.onopen = () => {
        console.log("Conexión WebSocket abierta: ", socketRef.current.readyState);
      };
  
      // Manejar mensajes desde el servidor
      if (socketRef.current) {
        socketRef.current.onmessage = (event) => {
          const newResponse = event.data;
          if (newResponse !== serverResponse) {
            setServerResponse(newResponse); // Solo actualiza si cambia
          }
        };
      }
  
      // Limpiar la conexión al desmontar
      return () => {
        if (socketRef.current) {
          socketRef.current.close();
        }
      };
    }
  }, []);
  

  useEffect(() => {
    console.log(cameraRef);
    console.log(socketRef.current);
    console.log(socketRef.current.readyState);
    if (cameraRef && socketRef.current) {
      console.log("waos")
      
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
      }, 100); // Captura cada 100ms
  
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
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={(ref) => setCameraRef(ref)}
        >
        </CameraView>
        </View>  
        <Text style={styles.response}>Server Response: {serverResponse}</Text>  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#fff',
    fontSize: 18,
  },
  cameraContainer: {
    height: '60%', // Ajusta el tamaño del cuadrado
    width: '60%', // Ajusta el tamaño del cuadrado
    aspectRatio: 1, // Relación de aspecto 1:1 para un cuadrado
    overflow: 'hidden',
    borderRadius: 20, // Opcional: bordes redondeados
    borderWidth: 2,
    borderColor: '#fff',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  flipButton: {
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  flipText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default PracticeMode;