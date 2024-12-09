// PracticeMode.js
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
  
  const CameraType = ['front', 'back']; // Ejemplo de array
  const [facing, setFacing] = useState(CameraType[0]);
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraRef, setCameraRef] = useState(null);
  const socketRef = useRef(null);

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  

  // Render condicional
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
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.flipText}>Cambiar Cámara</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
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
