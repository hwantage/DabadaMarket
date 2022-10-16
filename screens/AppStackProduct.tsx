import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductListScreen from './ProductListScreen';
import {useTranslation} from 'react-i18next';

const Stack = createNativeStackNavigator();

function AppStackProduct() {
  const {t} = useTranslation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductListScreen"
        component={ProductListScreen}
        options={{
          title: t('title', '다바다 마켓'),
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackProduct;
