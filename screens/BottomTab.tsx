import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View} from 'react-native';
import AppStackProduct from './AppStackProduct';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductAddButton from '../components/common/ProductAddButton';
import AppStackNotification from './AppStackNotification';
import AppStackChatting from './AppStackChatting';
import AppStackMy from './AppStackMy';

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <>
      <View style={styles.block}>
        <Tab.Navigator screenOptions={{headerShown: false, tabBarShowLabel: false, tabBarActiveTintColor: '#6200ee'}}>
          <Tab.Screen
            name="AppStackProduct"
            component={AppStackProduct}
            options={{
              tabBarIcon: ({color}) => <Icon name="home" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="AppStackNotification"
            component={AppStackNotification}
            options={{
              tabBarIcon: ({color}) => <Icon name="notifications" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="AppStackChatting"
            component={AppStackChatting}
            options={{
              tabBarIcon: ({color}) => <Icon name="chat" size={24} color={color} />,
            }}
          />
          <Tab.Screen
            name="AppStackMy"
            component={AppStackMy}
            options={{
              tabBarIcon: ({color}) => <Icon name="person" size={24} color={color} />,
            }}
          />
        </Tab.Navigator>
      </View>
      <ProductAddButton />
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    zIndex: 0,
  },
});

export default BottomTab;
