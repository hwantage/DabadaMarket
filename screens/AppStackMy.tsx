import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MyHomeScreen from './MyHomeScreen';

const Stack = createNativeStackNavigator();

function AppStackMy() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyHomeScreen"
        component={MyHomeScreen}
        options={{
          title: 'MyHomeScreen List',
        }}
      />
    </Stack.Navigator>
  );
}

export default AppStackMy;
