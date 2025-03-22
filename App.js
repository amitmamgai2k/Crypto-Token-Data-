
import React from 'react'
import HomeScreen from './Components/HomeScreen.jsx'
import CoinDetails from './Components/CoinDetails.jsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <stack.Navigator screenOptions={{ headerShown: false }}>
        <stack.Screen name="Home" component={HomeScreen}   options={{ headerLeft: () => null, gestureEnabled: false }}  />
        <stack.Screen
          name="CoinDetails"
          component={CoinDetails}

        />
      </stack.Navigator>
    </NavigationContainer>
  );
};


export default App