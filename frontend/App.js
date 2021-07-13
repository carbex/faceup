import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import HomeScreen from './screens/HomeScreen'
import GalleryScreen from './screens/GalleryScreen'
import SnapScreen from './screens/SnapScreen'

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons  } from '@expo/vector-icons';

import gallery from './reducers/gallery'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'
const store = createStore(combineReducers({ gallery }))

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return(   
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
    
            if (route.name === 'Gallery') {
              iconName = 'image-outline';
            } else if (route.name === 'Snap') {
              iconName = 'camera-outline';
            }
    
            return <Ionicons name={iconName} size={25} color={color} />;
          },
        })}
        tabBarOptions={{
          showLabel: false,
          style: {
            backgroundColor: '#111224',
          },
          activeTintColor: '#11946A',
          inactiveTintColor: '#FFFFFF',
        }}
      >
        <Tab.Screen name="Gallery" component={GalleryScreen} />
        <Tab.Screen name="Snap" component={SnapScreen} />
      </Tab.Navigator>
   
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer screeOptions={{headerShown: false}}>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
