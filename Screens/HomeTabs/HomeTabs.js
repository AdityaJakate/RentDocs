import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeTenant from './Home'; // Your Home component or screen
import Profiles from './Profile'; // Add other screen imports as needed
import News from './News'; 
import Settings from './Settings'; 
import Notifications from './Notifications'; 
import Icon from 'react-native-vector-icons/MaterialIcons'; // Optional for icons

const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'HomeTenant':
              iconName = 'home';
              break;
            case 'Profiles':
              iconName = 'person';
              break;
            case 'News':
              iconName = 'add';
              break;
            case 'Settings':
              iconName = 'settings';
              break;
            case 'Notifications':
              iconName = 'notifications';
              break;
            default:
              iconName = 'home';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Addtenant" component={HomeTenant} />
      <Tab.Screen name="Profiles" component={Profiles} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="Notifications" component={Notifications} />
    </Tab.Navigator>
  );
}

export default HomeTabs;
