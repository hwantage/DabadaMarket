import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './screens/AppStack';
import './lang/i18n';
import {RecoilRoot} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
