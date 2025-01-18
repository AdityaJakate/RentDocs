import React, { useEffect } from 'react';
import { View, Image, ActivityIndicator, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    // Simulate a loading process and then navigate to the Login screen
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Navigate to Login screen after delay
    }, 2000); // 2 seconds delay

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* Add your splash image or logo here */}
      <Image
        source={require('../assets/appartment.png')} // Make sure you have a splash image in your assets folder
        style={styles.logo}
      />
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 150,  // Adjust size as needed
    height: 150, // Adjust size as needed
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});
