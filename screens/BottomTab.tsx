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
        <Tab.Navigator screenOptions={{tabBarStyle: {height: 66}, headerShown: false, tabBarShowLabel: false, tabBarActiveTintColor: '#039DF4'}}>
          <Tab.Screen
            name="AppStackProduct"
            component={AppStackProduct}
            options={{
              tabBarIcon: ({color}) => <Icon name="home" size={40} color={color} style={styles.mgL_sm} />,
            }}
          />
          <Tab.Screen
            name="AppStackNotification"
            component={AppStackNotification}
            options={{
              tabBarIcon: ({color}) => (
                <>
                  <Icon name="notifications" size={36} color={color} style={styles.mgL} />
                  <Icon name="circle" size={9} color={'#FF0000'} style={{position: 'absolute', left: 32, top: 18}} />
                </>
              ),
            }}
          />
          <Tab.Screen
            name="AppStackChatting"
            component={AppStackChatting}
            options={{
              tabBarIcon: ({color}) => (
                <>
                  <Icon name="chat" size={34} color={color} style={styles.mgR} />
                  <Icon name="circle" size={9} color={'#FF0000'} style={{position: 'absolute', right: 6, top: 15}} />
                </>
              ),
            }}
          />
          <Tab.Screen
            name="AppStackMy"
            component={AppStackMy}
            options={{
              tabBarIcon: ({color}) => <Icon name="person" size={42} color={color} style={styles.mgR_sm} />,
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
  mgL_sm: {
    marginLeft: -10,
  },
  mgL: {
    marginLeft: -46,
  },
  mgR: {
    marginRight: -54,
  },
  mgR_sm: {
    marginRight: -10,
  },
});

export default BottomTab;
