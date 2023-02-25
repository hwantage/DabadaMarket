import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyHomeScreen from './MyHomeScreen';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();

function AppStackMy() {
  const {t} = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyHomeScreen"
        component={MyHomeScreen}
        options={{
          title: t('title.myInfo', '내 정보'),
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackMy;
