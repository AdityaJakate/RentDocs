import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Button, StyleSheet, FlatList, Alert, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const Profile = () => {
  const [tenants, setTenants] = useState([]); 
  const [selectedImage, setSelectedImage] = useState(null); // To store selected image URL
  const [modalVisible, setModalVisible] = useState(false); // To control modal visibility

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.log("Error while reading AsyncStorage", e);
    }
  };

  const fetchTenants = async () => {
    try {
      let numberToSend = await getData();
      const response = await axios.post('http://10.31.97.91:9005/get', { "number": numberToSend });
      setTenants(response.data.data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch tenants.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTenants();
    }, [])
  );

  // Function to delete a tenant
  const handleDeleteTenant = async (id) => {
    try {
      await axios.delete(`http://10.31.97.91:9005/delete/${id}`);
      setTenants((prevTenants) => prevTenants.filter((tenant) => tenant.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete tenant.');
    }
  };

  // Confirm and delete tenant
  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Tenant",
      "Are you sure you want to delete this tenant?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => handleDeleteTenant(id), style: "destructive" },
      ]
    );
  };

  // Open the full image in modal
  const openFullImage = (imageUrl) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View style={styles.container}>
      {/* Tenant List */}
      {tenants.length === 0 ? (
        <Text style={styles.noTenantsText}>No tenants available.</Text>
      ) : (
        <FlatList
          data={tenants}
          keyExtractor={(item) => item.name.toString()}
          renderItem={({ item }) => (
            <View style={styles.tenantCard}>
              {/* Image preview */}
              <TouchableOpacity onPress={() => openFullImage(item.image)}>
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
              </TouchableOpacity>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text>Mobile: {item.mobile}</Text>
                <Text>Address: {item.address}</Text>
              </View>
              <Button
                title="Delete"
                color="red"
                onPress={() => confirmDelete(item.name)}
              />
            </View>
          )}
        />
      )}

      {/* Modal for full image */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedImage }} style={styles.fullImage} />
            <Button title="Close" onPress={closeModal} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  tenantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  noTenantsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: 300,
    marginBottom: 20,
  },
});

export default Profile;
