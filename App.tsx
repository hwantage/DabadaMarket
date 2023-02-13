import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './screens/AppStack';
import './lang/i18n';
import {RecoilRoot} from 'recoil';
import messaging from '@react-native-firebase/messaging';
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background Remote Message]', remoteMessage);
});
// const getFcmToken = async () => {
//   const fcmToken = await messaging().getToken();
//   console.log('[FCM Token] ', fcmToken);
// };
function App() {
  useEffect(() => {
    //getFcmToken();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);
  return (
    <RecoilRoot>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
