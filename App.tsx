import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStackRoot from './screens/AppStack';
//import SplashScreen from 'react-native-splash-screen';
import './lang/i18n';

function App() {
  return (
    <NavigationContainer>
      <AppStackRoot />
    </NavigationContainer>
  );
}

export default App;
