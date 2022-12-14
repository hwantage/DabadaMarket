import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {subscribeAuth, getUserInfo} from '../utils/auth';
import {useTranslation} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import BottomTab from './BottomTab';
import ChattingListScreen from './ChattingListScreen';
import ChattingRoomScreen from './ChattingRoomScreen';
import JoinScreen from './JoinScreen';
import LoginScreen from './LoginScreen';
import MyBuyScreen from './MyBuyScreen';
import MyHomeScreen from './MyHomeScreen';
import MyKeywordScreen from './MyKeywordScreen';
import MyKeywordSettingScreen from './MyKeywordSettingScreen';
import MyProfileModifyScreen from './MyProfileModifyScreen';
import MySellScreen from './MySellScreen';
import NotificationListScreen from './NotificationListScreen';
import ProductAddScreen from './ProductAddScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductListScreen from './ProductListScreen';
import ProductModifyScreen from './ProductModifyScreen';
import ReviewScreen from './ReviewScreen';
import SearchScreen from './SearchScreen';
import StartScreen from './StartScreen';
import SettingScreen from './SettingScreen';
import UserHomeScreen from './UserHomeScreen';
import UserSellScreen from './UserSellScreen';

import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {productProps} from '../utils/products';
import SearchResultScreen from './SearchResultScreen';
import TopRightButton from '../components/common/TopRightButton';
import TopLeftButton from '../components/common/TopLeftButton';

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
  MyKeywordSettingScreen: undefined;
  MyProfileModifyScreen: undefined;
  MySellScreen: undefined;
  NotificationListScreen: undefined;
  ProductAddScreen: undefined;
  ProductDetailScreen: productProps;
  ProductListScreen: undefined;
  ProductModifyScreen: undefined;
  ReviewScreen: undefined;
  SearchScreen: undefined;
  SearchResultScreen: {keyword: string};
  StartScreen: undefined;
  SettingScreen: undefined;
  UserHomeScreen: {u_id: string};
  UserSellScreen: {u_id: string};
  LoginScreen: undefined;
  JoinScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStackRoot() {
  const [authInfo, setAuthInfo] = useRecoilState<authInfoProps>(authInfoState);
  const {t} = useTranslation();

  useEffect(() => {
    // ???????????? ??? ?????? ??? ????????? ????????? ???????????? UserContext??? ??????
    const unsubscribe = subscribeAuth(async (currentUser: authInfoProps) => {
      // ????????? ????????? ????????? ????????? ????????? ?????? ????????? ???????????????
      // ?????? ????????? ??? ?????? unsubscribe??? ??? ??? ????????? ????????? ??? ?????? ???????????? ?????? ??????
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
          <Stack.Screen name="ChattingListScreen" component={ChattingListScreen} options={{title: '??????'}} />
          <Stack.Screen name="ChattingRoomScreen" component={ChattingRoomScreen} options={{title: 'badasea(?????????ID)'}} />
          <Stack.Screen name="MyBuyScreen" component={MyBuyScreen} options={{title: '??? ?????? ??????'}} />
          <Stack.Screen name="MyHomeScreen" component={MyHomeScreen} options={{title: '??? ??????'}} />
          <Stack.Screen name="MyKeywordScreen" component={MyKeywordScreen} options={{title: 'MyKeywordScreen'}} />
          <Stack.Screen name="MyKeywordSettingScreen" component={MyKeywordSettingScreen} options={{title: '????????? ?????? ??????'}} />
          <Stack.Screen name="MyProfileModifyScreen" component={MyProfileModifyScreen} options={{title: '????????? ??????'}} />
          <Stack.Screen name="MySellScreen" component={MySellScreen} options={{title: '??? ?????? ??????'}} />
          <Stack.Screen name="NotificationListScreen" component={NotificationListScreen} options={{title: '????????? ??????'}} />
          <Stack.Screen name="ProductAddScreen" component={ProductAddScreen} options={{title: '?????? ?????????'}} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{title: '?????? ??????'}} />
          <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{title: t('title', '????????? ??????')}} />
          <Stack.Screen name="ProductModifyScreen" component={ProductModifyScreen} options={{title: '??? ????????????'}} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} options={{title: '?????? ?????? ?????????'}} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{title: '?????? ??????'}} />
          <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} options={{title: '?????? ??????'}} />
          <Stack.Screen name="StartScreen" component={StartScreen} options={{headerShown: false}} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} options={{title: '??????'}} />
          <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} options={{title: '????????? ??????'}} />
          <Stack.Screen name="UserSellScreen" component={UserSellScreen} options={{title: '????????? ?????? ??????'}} />
          <Stack.Screen name="JoinScreen" component={JoinScreen} options={{title: '????????????'}} />
        </>
      ) : (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{title: '?????????'}} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default AppStackRoot;
