import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {subscribeAuth, getUserInfo} from '../utils/auth';
import {useTranslation} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import BottomTab from './BottomTab';
import ChattingListScreen from './ChattingListScreen';
import ChattingRoomScreen from './ChattingRoomScreen';
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
import {productProps} from '../utils/products';
import SearchResultScreen from './SearchResultScreen';

export interface u_idProp {
  u_id: string;
}

export type RootStackParamList = {
  BottomTab: undefined;
  ChattingListScreen: undefined;
  ChattingRoomScreen: undefined;
  MyBuyScreen: undefined;
  MyHomeScreen: undefined;
  MyKeywordScreen: undefined;
  MyProfileModifyScreen: undefined;
  MyProfileScreen: undefined;
  MySellScreen: undefined;
  NotificationListScreen: undefined;
  ProductAddScreen: undefined;
  ProductDetailScreen: productProps;
  ProductListScreen: undefined;
  ProductModifyScreen: undefined;
  ReviewScreen: undefined;
  SearchScreen: undefined;
  SearchResultScreen: {keyword: string};
  SettingScreen: undefined;
  UserHomeScreen: {u_id: string};
  UserProfileScreen: undefined;
  UserSellScreen: {u_id: string};
  LoginScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStackRoot() {
  const [authInfo, setAuthInfo] = useRecoilState<authInfoProps>(authInfoState);
  const {t} = useTranslation();

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
          <Stack.Screen name="ChattingListScreen" component={ChattingListScreen} options={{title: '채팅'}} />
          <Stack.Screen name="ChattingRoomScreen" component={ChattingRoomScreen} options={{title: 'ChattingRoomScreen'}} />
          <Stack.Screen name="MyBuyScreen" component={MyBuyScreen} options={{title: '내 구매 상품'}} />
          <Stack.Screen name="MyHomeScreen" component={MyHomeScreen} options={{title: '내 정보'}} />
          <Stack.Screen name="MyKeywordScreen" component={MyKeywordScreen} options={{title: 'MyKeywordScreen'}} />
          <Stack.Screen name="MyProfileModifyScreen" component={MyProfileModifyScreen} options={{headerShown: false}} />
          <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} options={{title: 'MyProfileScreen'}} />
          <Stack.Screen name="MySellScreen" component={MySellScreen} options={{title: '내 판매 상품'}} />
          <Stack.Screen name="NotificationListScreen" component={NotificationListScreen} options={{title: 'NotificationListScreen'}} />
          <Stack.Screen name="ProductAddScreen" component={ProductAddScreen} options={{title: '상품 등록'}} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{title: '상품 상세'}} />
          <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{title: t('title', '다바다 마켓')}} />
          <Stack.Screen name="ProductModifyScreen" component={ProductModifyScreen} options={{title: 'ProductModifyScreen'}} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{title: 'ReviewScreen'}} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{title: '상품 검색'}} />
          <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} options={{title: '검색 결과'}} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} options={{title: '설정'}} />
          <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} options={{title: '판매자 정보'}} />
          <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} options={{title: 'UserProfileScreen'}} />
          <Stack.Screen name="UserSellScreen" component={UserSellScreen} options={{title: '판매자 판매 상품'}} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppStackRoot;
