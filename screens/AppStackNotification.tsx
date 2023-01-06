import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NotificationListScreen from './NotificationListScreen';

const Stack = createNativeStackNavigator();

function AppStackNotification() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NotificationListScreen"
        component={NotificationListScreen}
        options={{
          title: '키워드 알림',
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackNotification;
