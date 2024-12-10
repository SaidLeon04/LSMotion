import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const Glossary = () => {
  const [glossaryData, setGlossaryData] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos del glosario desde la API
  const fetchGlossaryData = async () => {
    try {
      const response = await fetch('https://new-folder-7x97.onrender.com/get_glosary');
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setGlossaryData(data.glosary);
    } catch (error) {
      console.error('Error fetching glossary data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlossaryData();
  }, []);

  const openModal = (letter) => {
    setSelectedLetter(letter);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLetter(null);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image source={imageMapping[item.letra]} style={styles.image} />
      <Text style={styles.letter}>{item.letra}</Text>
    </TouchableOpacity>
  );

  const imageMapping = {
    A: require('../assets/glossary/a.png'),
    B: require('../assets/glossary/b.png'),
    C: require('../assets/glossary/c.png'),
    D: require('../assets/glossary/d.png'),
    E: require('../assets/glossary/e.png'),
    F: require('../assets/glossary/f.png'),
    G: require('../assets/glossary/g.png'),
    H: require('../assets/glossary/h.png'),
    I: require('../assets/glossary/i.png'),
    J: require('../assets/glossary/j.png'),
    K: require('../assets/glossary/k.png'),
    L: require('../assets/glossary/l.png'),
    M: require('../assets/glossary/m.png'),
    N: require('../assets/glossary/n.png'),
    Ñ: require('../assets/glossary/ñ.png'),
    O: require('../assets/glossary/o.png'),
    P: require('../assets/glossary/p.png'),
    Q: require('../assets/glossary/q.png'),
    R: require('../assets/glossary/r.png'),
    S: require('../assets/glossary/s.png'),
    T: require('../assets/glossary/t.png'),
    U: require('../assets/glossary/u.png'),
    V: require('../assets/glossary/v.png'),
    W: require('../assets/glossary/w.png'),
    X: require('../assets/glossary/x.png'),
    Y: require('../assets/glossary/y.png'),
    Z: require('../assets/glossary/z.png'),
  };
  

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text>Cargando datos...</Text>
        </View>
      ) : (
        <FlatList
          data={glossaryData}
          renderItem={renderCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          numColumns={3}
        />
      )}

      {selectedLetter && (
        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedLetter.imagen ? (
                <Image source={imageMapping[selectedLetter.letra]} style={styles.modalImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.letter}>{selectedLetter.letra}</Text>
                </View>
              )}
              <Text style={styles.modalTitle}>{selectedLetter.letra}</Text>
              <Text style={styles.modalDescription}>{selectedLetter.descripcion}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    paddingHorizontal: 14,
  },
  card: {
    width: 100,
    height: 120,
    margin: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  letter: {
    marginTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Glossary;
