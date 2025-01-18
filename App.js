import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './Screens/SplashScreen';
import LoginScreen from './Screens/LogInScreen';
import SignUpScreen from './Screens/SignUp';
 import Home from './Screens/HomeTabs/HomeTabs';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
         <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        { <Stack.Screen name="Home" component={Home} options={{ title: 'Home', headerShown: false }} /> }
      </Stack.Navigator>
    </NavigationContainer>
  );
}
