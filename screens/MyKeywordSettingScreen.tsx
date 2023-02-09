import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ActivityIndicator, Button, FlatList, Image, ListRenderItem, RefreshControl, StyleSheet, View, SafeAreaView, TouchableOpacity, Pressable, ScrollView, RecyclerViewBackedScrollViewComponent} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import TopLeftButton from '../components/common/TopLeftButton';
import ProductCard from '../components/product/ProductCard';
import {productProps, productPropsDefault} from '../utils/products';
import Avatar from '../components/profile/Avatar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useProducts from '../hooks/useProducts';
import {useRecoilState} from 'recoil';
import uuid from 'react-native-uuid';
import {useTranslation} from 'react-i18next';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaButton from '../components/common/DabadaButton';
import DabadaInputLine from '../components/common/DabadaInputLine';

function MyKeywordSettingScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts({u_id: authInfo.u_id, querymode: 'buy'});
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<productProps>({...productPropsDefault, p_id: uuid.v4().toString(), u_id: authInfo.u_id});

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
    }
  }, [products, productsReady]);

  /* 좌측 상단 이미지 (뒤로가기) */
  // useEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <TopLeftButton name="arrow-back-ios" />,
  //   });
  // }, [navigation]);

  const onPressSetting = () => {
    navigation.navigate('MyKeywordSettingScreen');
  };

  return (
    <View style={styles.fullscreen}>
      <View style={styles.flex}>
        <View style={styles.row2}>
          <DabadaInputLine placeholder={'키워드를 입력해주세요. (예: 자전거)'} value={product.p_title} onChangeText={(text: string) => setProduct({...product, p_title: text})} hasMarginBottom={false} />
          {/* <DabadaButton theme={'secondary'} hasMarginBottom={false} title="설정" onPress={() => navigation.push('BottomTab')} /> */}
        </View>
      </View>
      <View style={styles.mgHor}>
        <Text style={styles.bold1}>등록한 키워드</Text>
        <Text style={styles.bold_bl}>3</Text>
        <Text style={styles.text}> / 30</Text>
      </View>
      <View style={styles.keywordArea}>
        <View style={styles.round}>
          <Text style={styles.text}>스타벅스</Text>
          <Icon name="close" size={20} />
        </View>
        <View style={styles.round}>
          <Text style={styles.text}>교환권</Text>
          <Icon name="close" size={20} />
        </View>
        <View style={styles.round}>
          <Text style={styles.text}>무료나눔</Text>
          <Icon name="close" size={20} />
        </View>
        <View style={styles.round}>
          <Text style={styles.text}>소만사</Text>
          <Icon name="close" size={20} />
        </View>
      </View>
      <View style={styles.keywordArea}>
        <View style={styles.round}>
          <Text style={styles.text}>간식</Text>
          <Icon name="close" size={20} />
        </View>
        <View style={styles.round}>
          <Text style={styles.text}>자전거</Text>
          <Icon name="close" size={20} />
        </View>
        <View style={styles.round}>
          <Text style={styles.text}>크리스마스케익</Text>
          <Icon name="close" size={20} />
        </View>
        <View style={styles.round}>
          <Text style={styles.text}>귤</Text>
          <Icon name="close" size={20} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  buttons: {
    margin: 24,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#dfdfdf',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  touchFlex: {
    // overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    //borderBottomWidth: 1,
    //borderStyle: 'solid',
    //borderBottomColor: '#dfdfdf',

    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    //position: 'absolute',
    // overflow: 'hidden',

    // shadowBottomColor: '#000',
    // shadowOffset: {width: 1, height: 1},
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // elevation: 5,
  },
  touchFlex_line: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    paddingHorizontal: 16,
  },
  mgHor: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  reviewBtnFlex: {
    paddingVertical: 14,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderStyle: 'solid',
    // borderBottomColor: '#dfdfdf',
    // paddingHorizontal: 16,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#191919',
    //shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 10,
    //shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 30,
    },
    //shadowOpacity: 0.25,
    //shadowRadius: 3,
  },
  flex: {
    // paddingTop: 16,
    paddingBottom: 12,
    flexDirection: 'row',
  },
  round: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    borderColor: '#039DF4',
    borderWidth: 1,
    borderRadius: 30,
    marginRight: 6,
  },
  flex2: {
    // flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  flex3: {
    flex: 1,
    // paddingVertical: 10,
    // flexDirection: 'row',
  },
  flex4: {
    // flex: 1,
    width: '100%',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // marginBottom: -30,
    // paddingVertical: 10,
    flexDirection: 'row',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  row: {
    paddingTop: 10,
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  row2: {
    padding: 14,
    justifyContent: 'space-between',
    // flexDirection: 'row',
    flex: 1,
    // alignItems: 'center',
  },
  keywordArea: {
    // maxWidth: 152,
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    // flex: 1,
    // alignItems: 'center',
  },
  mgT: {
    paddingVertical: 20,
  },
  mgR: {
    marginRight: 6,
  },
  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold_bl: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#039DF4',
  },
  bold1: {fontSize: 16, fontWeight: 'bold', color: '#606060'},
  bold2: {fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#606060'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {fontSize: 14, color: '#606060', marginRight: 8},
  text_bl: {
    fontSize: 14,
    color: '#039DF4',
    //color: '#898989',
    marginRight: 16,
  },
  sellProduct: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#b9b9b9',
    borderBottomColor: '#b9b9b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    width: 20,
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    // alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 6,
    //backgroundColor: 'transparent',
    color: '#898989',
    marginRight: 12,
  },
  tag_soldout: {
    color: '#ffffff',
    backgroundColor: '#898989',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#808080',
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#808080',
    fontSize: 12,
    height: 24,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tag_reserve: {
    //backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: '#ff0ff0',
    fontSize: 12,
    height: 26,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});

export default MyKeywordSettingScreen;
