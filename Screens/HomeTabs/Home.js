import React, { useState } from 'react';
import { View, ScrollView, Button, StyleSheet, Text } from 'react-native';
import TenantForm from './ReUse/TenantInfo'; // Import the TenantForm component
import AsyncStorage from '@react-native-async-storage/async-storage';


const Home = () => {
  const [tenantForms, setTenantForms] = useState([{ id: 1 }]); // Start with one form

  // Add a new tenant form dynamically
  const addTenantForm = () => {
    setTenantForms([...tenantForms, { id: tenantForms.length + 1 }]);
  };

  // Remove a specific tenant form by index
  const removeTenantForm = (index) => {
    const updatedForms = tenantForms.filter((_, i) => i !== index);
    setTenantForms(updatedForms);
  };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      console.log("value----------->",value)
      if (value !== null) {
        // value previously stored
        return value;
      }
    } catch (e) {
      // error reading value
      console.log("eeeeeeror while reading AsyncStorage",e)
    }
  };

  const addTenant = async (tenant) => {
    
    let  email = await getData();
    
    try {
      const formData = new FormData();
      formData.append('name', tenant.name);
      formData.append('mobile', tenant.mobile);
      formData.append('address', tenant.address);
      formData.append('email', email);

      console.log("formData before-->",formData)
  
      // Add the image file
      formData.append('image', {
        uri: tenant.image.uri,
        name: tenant.image.fileName || 'tenant_image.jpg',
        type: tenant.image.type || 'image/jpeg',
      });
      console.log("formData after-->",formData)

   

      const response = await fetch('http://10.31.97.91:9005/insert',{
        
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      }
      ).catch(err=>{
        console.log("error",err,err.message)
      });
      console.log("response",response);
  
      if (response.ok) {
        const result = await response.json();
        console.log('Tenant added successfully:', result);
        alert('Tenant added successfully!');
      } else {
        console.error('Failed to add tenant:', response.statusText);
        alert('Failed to add tenant.');
      }
    } catch (error) {
      console.error('Error adding tenant:', error);
      alert('An error occurred while adding the tenant.');
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        {tenantForms.map((form, index) => (
          <View key={form.id} style={styles.formContainer}>
            <TenantForm onAddTenant={addTenant} />
            {tenantForms.length > 1 && (
              <Button
                title="Remove Tenant"
                color="red"
                onPress={() => removeTenantForm(index)}
              />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default Home;
