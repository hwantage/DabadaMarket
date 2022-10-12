import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './BottomTab';
import ChattingListScreen from './ChattingListScreen';
import ChattingRoomScreen from './ChattingRoomScreen';
import JoinScreen from './JoinScreen';
import LoginScreen from './LoginScreen';
import MyBuyScreen from './MyBuyScreen';
import MyHomeScreen from './MyHomeScreen';
import MyKeywordScreen from './MyKeywordScreen';
import MyProfileModifyScreen from './MyProfileModifyScreen';
import MyProfileScreen from './MyProfileScreen';
import MySellScreen from './MySellScreen';
import NotificationListScreen from './NotificationListScreen';
import ProductAddScreen from './ProductAddScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductListScreen from './ProductListScreen';
import ProductModifyScreen from './ProductModifyScreen';
import ReviewScreen from './ReviewScreen';
import SearchScreen from './SearchScreen';
import SettingScreen from './SettingScreen';
import UserHomeScreen from './UserHomeScreen';
import UserProfileScreen from './UserProfileScreen';
import UserSellScreen from './UserSellScreen';

import {useRecoilState} from 'recoil';
import {authInfoState} from '../recoil/authInfoAtom';

const Stack = createNativeStackNavigator();

function AppStackRoot() {
  const [authInfo] = useRecoilState(authInfoState);

  return (
    <Stack.Navigator>
      {authInfo ? (
        <>
          <Stack.Screen name="BottomTab" component={BottomTab} options={{headerShown: false}} />
          <Stack.Screen name="ChattingListScreen" component={ChattingListScreen} options={{title: 'ChattingListScreen'}} />
          <Stack.Screen name="ChattingRoomScreen" component={ChattingRoomScreen} options={{title: 'ChattingRoomScreen'}} />
          <Stack.Screen name="MyBuyScreen" component={MyBuyScreen} options={{title: 'MyBuyScreen'}} />
          <Stack.Screen name="MyHomeScreen" component={MyHomeScreen} options={{title: 'MyHomeScreen'}} />
          <Stack.Screen name="MyKeywordScreen" component={MyKeywordScreen} options={{title: 'MyKeywordScreen'}} />
          <Stack.Screen name="MyProfileModifyScreen" component={MyProfileModifyScreen} options={{title: 'MyProfileModifyScreen'}} />
          <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} options={{title: 'MyProfileScreen'}} />
          <Stack.Screen name="MySellScreen" component={MySellScreen} options={{title: 'MySellScreen'}} />
          <Stack.Screen name="NotificationListScreen" component={NotificationListScreen} options={{title: 'NotificationListScreen'}} />
          <Stack.Screen name="ProductAddScreen" component={ProductAddScreen} options={{title: 'ProductAddScreen'}} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{title: 'ProductDetailScreen'}} />
          <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{title: 'ProductListScreen'}} />
          <Stack.Screen name="ProductModifyScreen" component={ProductModifyScreen} options={{title: 'ProductModifyScreen'}} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{title: 'ReviewScreen'}} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{title: 'SearchScreen'}} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} options={{title: 'SettingScreen'}} />
          <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} options={{title: 'UserHomeScreen'}} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{title: 'UserProfileScreen'}} />
          <Stack.Screen name="UserSellScreen" component={UserSellScreen} options={{title: 'UserSellScreen'}} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{title: 'LoginScreen'}} />
          <Stack.Screen name="JoinScreen" component={JoinScreen} options={{title: 'JoinScreen'}} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppStackRoot;
