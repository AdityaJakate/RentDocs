import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const TenantForm = ({ onAddTenant }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null); // Store the selected image
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  // Function to select an image
  const selectImage = async () => {
    // Request media library permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    // If permission is not granted, show an alert and return
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to allow access to the photo library.');
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3], // Adjust the aspect ratio as needed
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]); // Store the selected image
    }
  };

  // Function to handle tenant addition
  const handleAddTenant = () => {
    if (name && mobile && address && image) {
      // Call the onAddTenant prop to pass the tenant data
      onAddTenant({ name, mobile, address, image });

      // Show success message for 2 seconds
      setSuccessMessage('Tenant added successfully!');

      // Clear the form after 2 seconds
      setTimeout(() => {
        setName('');
        setMobile('');
        setAddress('');
        setImage(null);
        setSuccessMessage(''); // Clear the success message
      }, 1000);
    } else {
      Alert.alert('Missing Fields', 'Please fill in all fields and select an image.');
    }
  };

  return (
    <View style={styles.form}>
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : null}

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      {image && (
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
        />
      )}
      <Button title="Select Image" onPress={selectImage} />
      <Button title="Add Tenant" onPress={handleAddTenant} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  successMessage: {
    color: 'green',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TenantForm;
