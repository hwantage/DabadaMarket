import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NotificationListScreen from './NotificationListScreen';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();

function AppStackNotification() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotificationListScreen"
        component={NotificationListScreen}
        options={{
          title: t('title.keywordNoti', '키워드 알림'),
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackNotification;
