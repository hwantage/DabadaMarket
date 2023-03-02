import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AppStack from './screens/AppStack';
import './lang/i18n';
import {RecoilRoot} from 'recoil';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import {useTranslation} from 'react-i18next';

// 타임존 전역설정
moment.tz.setDefault('Asia/Seoul');

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[Background Remote Message]', remoteMessage);
});

function App() {
  // FCM 토큰 정보 확인
  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    console.log('[FCM Token] ', fcmToken);
  };

  // 언어 설정 정보 확인
  const {i18n} = useTranslation();

  // 스토리지에 저장된 언어 설정 적용(설정 화면에서 변경한 언어 반영)
  const getLanguage = useCallback(async () => {
    let lang = await AsyncStorage.getItem('@language');
    if (lang) {
      i18n.changeLanguage(lang);
      moment.locale(lang);
    } else {
      moment.locale('ko');
    }
  }, [i18n]);

  useEffect(() => {
    getFcmToken();
    getLanguage();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('[Remote Message] ', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, [getLanguage]);

  return (
    <RecoilRoot>
      <NavigationContainer>
        <AppStack />
      </NavigationContainer>
    </RecoilRoot>
  );
}

export default App;
