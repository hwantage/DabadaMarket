import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProductListScreen from './ProductListScreen';

const Stack = createNativeStackNavigator();

function AppStackProduct() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProductListScreen"
        component={ProductListScreen}
        options={{
          title: 'Product List',
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackProduct;
