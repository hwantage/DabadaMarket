import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {subscribeAuth, getUserInfo} from '../utils/auth';
import {useTranslation} from 'react-i18next';
import SplashScreen from 'react-native-splash-screen';
import BottomTab from './BottomTab';
import ChattingListScreen from './ChattingListScreen';
import ChattingRoomScreen from './ChattingRoomScreen';
import InformationAddScreen from './InformationAddScreen';
import InformationDetailScreen from './InformationDetailScreen';
import InformationModifyScreen from './InformationModifyScreen';
import LoginScreen from './LoginScreen';
import MyBuyScreen from './MyBuyScreen';
import MyHomeScreen from './MyHomeScreen';
import MyKeywordScreen from './MyKeywordScreen';
import MyProfileModifyScreen from './MyProfileModifyScreen';
import MySellScreen from './MySellScreen';
import NotificationListScreen from './NotificationListScreen';
import ProductAddScreen from './ProductAddScreen';
import ProductDetailScreen from './ProductDetailScreen';
import ProductListScreen from './ProductListScreen';
import ProductModifyScreen from './ProductModifyScreen';
import ReviewWriteScreen from './ReviewWriteScreen';
import ReviewViewScreen from './ReviewViewScreen';
import SearchScreen from './SearchScreen';
import SettingScreen from './SettingScreen';
import UserHomeScreen from './UserHomeScreen';
import UserSellScreen from './UserSellScreen';
import UserSellCompleteScreen from './UserSellCompleteScreen';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {productProps} from '../utils/products';
import SearchResultScreen from './SearchResultScreen';
import {informationProps} from '../utils/informations';
import moment from 'moment-timezone';

export interface u_idProp {
  u_id: string;
}

export type RootStackParamList = {
  BottomTab: undefined;
  ChattingListScreen: undefined;
  ChattingRoomScreen: {p_id: string; c_id: string; product: productProps};
  InformationAddScreen: undefined;
  InformationDetailScreen: {information: informationProps};
  InformationModifyScreen: {i_id: string};
  MyBuyScreen: undefined;
  MyHomeScreen: undefined;
  MyKeywordScreen: undefined;
  MyProfileModifyScreen: undefined;
  MySellScreen: undefined;
  NotificationListScreen: undefined;
  ProductAddScreen: undefined;
  ProductDetailScreen: {product: productProps; querymode: string | null};
  ProductListScreen: undefined;
  ProductModifyScreen: {p_id: string};
  ReviewWriteScreen: {product: productProps};
  ReviewViewScreen: {product: productProps};
  SearchScreen: undefined;
  SearchResultScreen: {keyword: string};
  SettingScreen: undefined;
  UserHomeScreen: {u_id: string};
  UserSellScreen: {u_id: string};
  UserSellCompleteScreen: {u_id: string};
  LoginScreen: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

function AppStackRoot() {
  const [authInfo, setAuthInfo] = useRecoilState<authInfoProps>(authInfoState);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    SplashScreen.hide();
    // 컴포넌트 첫 로딩 시 로그인 상태를 확인하고 UserContext에 적용
    const unsubscribe = subscribeAuth(async (currentUser: authInfoProps) => {
      // 여기에 등록한 함수는 사용자 정보가 바뀔 때마다 호출되는데
      // 처음 호출될 때 바로 unsubscribe해 한 번 호출된 후에는 더 이상 호출되지 않게 설정
      unsubscribe();

      if (!currentUser) {
        return;
      }

      const profile = await getUserInfo(currentUser.u_id);
      if (!profile) {
        return;
      }
      setAuthInfo(profile);
      i18n.changeLanguage(profile.u_lang);
      moment.locale(profile.u_lang);
    });
  }, [i18n, setAuthInfo]);

  return (
    <Stack.Navigator>
      {authInfo.u_id ? (
        <>
          <Stack.Screen name="BottomTab" component={BottomTab} options={{headerShown: false}} />
          <Stack.Screen name="ChattingListScreen" component={ChattingListScreen} options={{title: t('title.chatting', '채팅')}} />
          <Stack.Screen name="ChattingRoomScreen" component={ChattingRoomScreen} options={{title: 'badasea(상대방ID)'}} />
          <Stack.Screen name="MyBuyScreen" component={MyBuyScreen} options={{title: t('title.myBuyProduct', '내 구매 상품')}} />
          <Stack.Screen name="MyHomeScreen" component={MyHomeScreen} options={{title: t('title.myInfo', '내 정보')}} />
          <Stack.Screen name="MyKeywordScreen" component={MyKeywordScreen} options={{title: t('title.myKeywordNoti', '나의 키워드 알림')}} />
          <Stack.Screen name="MyProfileModifyScreen" component={MyProfileModifyScreen} options={{title: t('title.modifyProfile', '프로필 수정')}} />
          <Stack.Screen name="MySellScreen" component={MySellScreen} options={{title: t('title.mySellProduct', '내 판매 상품')}} />
          <Stack.Screen name="NotificationListScreen" component={NotificationListScreen} options={{title: t('title.keywordNoti', '키워드 알림')}} />
          <Stack.Screen name="InformationAddScreen" component={InformationAddScreen} options={{title: t('title.writeInformation', '정보의 바다 글 작성')}} />
          <Stack.Screen name="InformationDetailScreen" component={InformationDetailScreen} options={{title: t('title.viewInformation', '정보의 바다 글 보기')}} />
          <Stack.Screen name="InformationModifyScreen" component={InformationModifyScreen} options={{title: t('title.modifyInformation', '정보의 바다 글 수정')}} />
          <Stack.Screen name="ProductAddScreen" component={ProductAddScreen} options={{title: t('title.writeProduct', '상품 등록')}} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{title: t('title.productDetail', '상품 상세')}} />
          <Stack.Screen name="ProductListScreen" component={ProductListScreen} options={{title: t('title.dabadamarket', '다바다 마켓')}} />
          <Stack.Screen name="ProductModifyScreen" component={ProductModifyScreen} options={{title: t('title.modifyProduct', '상품 수정하기')}} />
          <Stack.Screen name="ReviewWriteScreen" component={ReviewWriteScreen} options={{title: t('title.writeReview', '거래 후기 보내기')}} />
          <Stack.Screen name="ReviewViewScreen" component={ReviewViewScreen} options={{title: t('title.viewReview', '거래 후기 보기')}} />
          <Stack.Screen name="SearchScreen" component={SearchScreen} options={{title: t('title.searchProduct', '상품 검색')}} />
          <Stack.Screen name="SearchResultScreen" component={SearchResultScreen} options={{title: t('title.searchResult', '검색 결과')}} />
          <Stack.Screen name="SettingScreen" component={SettingScreen} options={{title: t('title.setting', '설정')}} />
          <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} options={{title: t('title.sellerHome', '판매자 정보')}} />
          <Stack.Screen name="UserSellScreen" component={UserSellScreen} options={{title: t('title.userSellProduct', '판매자의 판매 중인 상품')}} />
          <Stack.Screen name="UserSellCompleteScreen" component={UserSellCompleteScreen} options={{title: t('title.userSellcompleteProduct', '판매자의 판매 완료 상품')}} />
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
