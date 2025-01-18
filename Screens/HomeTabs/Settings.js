
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Settings = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState(null);

  // Function to get user details
  const getUserDetails = async () => {
    try {
      const userId = await AsyncStorage.getItem('email'); // Retrieve user ID from AsyncStorage
      if (userId) {
        const response = await axios.post('http://10.31.97.91:9005/getUserDetails', { id: userId });
        console.log("response-->",response.data.data.data)
        setUserDetails(response.data.data.data[0]);
      } else {
        Alert.alert('Error', 'User ID not found.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch user details.');
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); // Clear all AsyncStorage data
      navigation.replace('Login'); // Navigate to Login screen
    } catch (error) {
      Alert.alert('Error', 'Failed to logout.');
    }
  };

  // Fetch user details when the screen is loaded
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      {userDetails ? (
        <>
          <Text style={styles.label}>Name: {userDetails.name}</Text>
          <Text style={styles.label}>Mobile: {userDetails.mobile_number}</Text>
          <Text style={styles.label}>Address: {userDetails.goan}</Text>
          <Text style={styles.label}>Total Tenants: {userDetails.totaltenants}</Text>
        </>
      ) : (
        <Text style={styles.loadingText}>Loading user details...</Text>
      )}

      <View style={styles.logoutButton}>
        <Button title="Logout" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  logoutButton: {
    marginTop: 30,
  },
});
