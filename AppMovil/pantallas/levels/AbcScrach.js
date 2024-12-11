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

const AbcScratch = ({ navigation }) => {

  // Respuestas interactivas
  const respuestas = ["Casi lo logras", "Bien", "Ajusta tu posición", "Sigue asi", "Un poco mas preciso"];

  const movementsList = ["a", "b", "c"];

  const [score, setScore] = useState(0);
  const [backgroundColorA, setBackgroundColorA] = useState('white');
  const [backgroundColorB, setBackgroundColorB] = useState('white');
  const [backgroundColorC, setBackgroundColorC] = useState('white');


  
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
      socketRef.current = new WebSocket("ws://localhost:5000/abc");
      
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
            if (event.data === 'a') {
              setScore((prevScore) => prevScore + 50);
              setBackgroundColorA('#A3C9FF');
            } else if (event.data === 'b') {
              setScore((prevScore) => prevScore + 25);
              setBackgroundColorB('#FFEB99');
            } else if (event.data === 'c') {
              setScore((prevScore) => prevScore + 10);
              setBackgroundColorC('#FFB3B3');
            }
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
            <View>
                <View style={[styles.movementCard, { backgroundColor:backgroundColorA }]}>
                  <Text style={styles.movementItem}>{movementsList[0]}</Text>
                </View>
                <View style={[styles.movementCard, { backgroundColor:backgroundColorB }]}>
                  <Text style={styles.movementItem}>{movementsList[1]}</Text>
                </View>
                <View style={[styles.movementCard, { backgroundColor:backgroundColorC }]}>
                  <Text style={styles.movementItem}>{movementsList[2]}</Text>
                </View>
              </View>

          </View>

          <View style={styles.cameraWrapper}>
            <CameraView
              style={styles.camera}
              facing={facing}
              ref={(ref) => setCameraRef(ref)}
            />
             <Text style={styles.response}>{serverResponse}</Text>  
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>Puntuación</Text>
              <Text style={styles.score}>{score}</Text>
            </View>
        
            <Button title="Glosario" onPress={() => navigation.navigate('Glossary')}/>

            <Button title="Volver" onPress={() => navigation.navigate('Home')} />
          </View>

        </View>
       
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', // Coloca los elementos de manera vertical
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  cameraContainer: {
    flexDirection: 'row', // Alinea los elementos en una fila
    width: '100%', // Ocupa todo el ancho de la pantalla
    height: '80%', // Ajusta el alto de la cámara
    justifyContent: 'space-between', // Coloca los elementos a los extremos
    alignItems: 'center', // Centra los elementos verticalmente
  },
  movementsContainer: {
    width: '30%', // Toma el 30% del ancho de la pantalla
    padding: 10,
    backgroundColor: '#ddd', // Puedes cambiar el color de fondo
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-between',
  },
  cameraWrapper: {
    width: '40%', // Toma el 40% del ancho de la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1, // Relación de aspecto 1:1 para un cuadrado
    overflow: 'hidden',
    borderRadius: 20, // Opcional: bordes redondeados
    margin:20,
  },
  camera: {
    width: '100%',
    height: 200, // Ajusta la altura de la cámara según lo que necesites
    backgroundColor: 'lightgray',
  },
  buttonContainer: {
    width: '30%', // Toma el 30% del ancho de la pantalla
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'space-between',
    alignItems: 'space-between',
  },
  response: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  movementsTitle:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  },
  movementCard: {
    backgroundColor: '#f9f9f9', // Fondo de la tarjeta
    padding: 15,
    marginBottom: 10, // Espacio entre tarjetas
    borderRadius: 8, // Bordes redondeados
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Para Android
    width: '100%', // Para que cada tarjeta ocupe todo el ancho disponible
  },
  score:{
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#000',
  }
});

export default AbcScratch;