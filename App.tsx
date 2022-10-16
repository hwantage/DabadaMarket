import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStackRoot from './screens/AppStack';
import './lang/i18n';
import {RecoilRoot} from 'recoil';

function App() {
  return (
    <RecoilRoot>
      <NavigationContainer>
        <AppStackRoot />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
