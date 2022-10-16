import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {subscribeAuth, getUserInfo} from '../utils/auth';
import SplashScreen from 'react-native-splash-screen';
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
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';

const Stack = createNativeStackNavigator();

function AppStackRoot() {
  const [authInfo, setAuthInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    // 컴포넌트 첫 로딩 시 로그인 상태를 확인하고 UserContext에 적용
    const unsubscribe = subscribeAuth(async (currentUser: authInfoProps) => {
      // 여기에 등록한 함수는 사용자 정보가 바뀔 때마다 호출되는데
      // 처음 호출될 때 바로 unsubscribe해 한 번 호출된 후에는 더 이상 호출되지 않게 설정
      unsubscribe();
      if (!currentUser) {
        SplashScreen.hide();
        return;
      }
      const profile = await getUserInfo(currentUser.u_id);
      if (!profile) {
        return;
      }
      setAuthInfo(profile);
    });
  }, [setAuthInfo]);

  return (
    <Stack.Navigator>
      {authInfo.u_id ? (
        <>
          <Stack.Screen name="BottomTab" component={BottomTab} options={{headerShown: false}} />
          <Stack.Screen name="ChattingListScreen" component={ChattingListScreen} options={{title: 'ChattingListScreen'}} />
          <Stack.Screen name="ChattingRoomScreen" component={ChattingRoomScreen} options={{title: 'ChattingRoomScreen'}} />
          <Stack.Screen name="MyBuyScreen" component={MyBuyScreen} options={{title: 'MyBuyScreen'}} />
          <Stack.Screen name="MyHomeScreen" component={MyHomeScreen} options={{title: 'MyHomeScreen'}} />
          <Stack.Screen name="MyKeywordScreen" component={MyKeywordScreen} options={{title: 'MyKeywordScreen'}} />
          <Stack.Screen name="MyProfileModifyScreen" component={MyProfileModifyScreen} options={{headerShown: false}} />
          <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} options={{title: 'MyProfileScreen'}} />
          <Stack.Screen name="MySellScreen" component={MySellScreen} options={{title: 'MySellScreen'}} />
          <Stack.Screen name="NotificationListScreen" component={NotificationListScreen} options={{title: 'NotificationListScreen'}} />
          <Stack.Screen name="ProductAddScreen" component={ProductAddScreen} options={{title: '상품 등록'}} />
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
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="JoinScreen" component={JoinScreen} options={{headerShown: false}} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppStackRoot;
