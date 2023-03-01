import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, View, Text} from 'react-native';
import AppStackProduct from './AppStackProduct';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductAddButton from '../components/common/ProductAddButton';
import AppStackNotification from './AppStackNotification';
import AppStackChatting from './AppStackChatting';
import AppStackMy from './AppStackMy';
import {chattingNotificationCntState} from '../recoil/chattingAtom';
import {useRecoilValue} from 'recoil';

const Tab = createBottomTabNavigator();

function BottomTab() {
  const chattingNotificationCnt = useRecoilValue(chattingNotificationCntState);

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
                  <Icon name="circle" size={9} color={'#FF0000'} style={styles.circle} />
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
                  {chattingNotificationCnt > 0 && (
                    <View style={styles.notifyView}>
                      <Text style={styles.colorW}>{chattingNotificationCnt}</Text>
                    </View>
                  )}
                  {/* <Icon name="circle" size={9} color={'#FF0000'} style={{position: 'absolute', right: 6, top: 15}} /> */}
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
  circle: {position: 'absolute', left: 32, top: 18},
  notifyView: {
    width: 20,
    height: 20,
    borderRadius: 50,
    position: 'absolute',
    right: 2,
    top: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  colorW: {color: 'white'},
});

export default BottomTab;
