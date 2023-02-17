import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import DabadaButton from '../common/DabadaButton';
import Avatar from '../profile/Avatar';
import ImageSlider from '../ImageSlider';
import {productProps, comma} from '../../utils/products';
import {getUserInfo} from '../../utils/auth';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useRecoilValue} from 'recoil';
import moment from 'moment';
import 'moment/locale/ko';

interface ProductProps {
  product: productProps | undefined;
}

function Product({product}: ProductProps) {
  const [user, setUser] = useState<authInfoProps>(); // 상품 등록자 정보

  const navigation = useNavigation<StackNavigationProp<any>>();
  const myInfo = useRecoilValue(authInfoState);

  useEffect(() => {
    if (product?.u_id !== undefined) {
      getUserInfo(product?.u_id).then(_user => {
        setUser(_user);
      });
    }
  }, [product]);

  const goChattingScreen = () => {
    navigation.push('ChattingRoomScreen', {product});
  };

  let p_badatype_str = ''; // 'free' | 'money' | 'drink' | 'secret';
  let p_badatype_css = {};
  switch (product?.p_badatype) {
    case 'free':
      p_badatype_str = '그냥바다';
      p_badatype_css = styles.p_badatype;
      break;
    case 'money':
      p_badatype_str = '머니바다';
      p_badatype_css = styles.p_badatype;
      break;
    case 'drink':
      p_badatype_str = '한잔바다';
      p_badatype_css = styles.p_badatype;
      break;
    case 'secret':
      p_badatype_str = '몰래바다';
      p_badatype_css = styles.p_badatype;
      break;
  }

  let p_status_str = ''; // 1:판매중, 2:예약중, 3:거래완료, 4:판매중지
  let p_status_css = {};
  let p_buy_available = false; // 판매중, 예약중 일때만 구매 가능. 거래완료, 판매중지 일 경우 false 로 변경.

  switch (product?.p_status) {
    case 1:
      p_status_str = '판매중';
      p_status_css = styles.tag_sell;
      p_buy_available = true;
      break;
    case 2:
      p_status_str = '예약중';
      p_status_css = styles.tag_reserve;
      p_buy_available = true;
      break;
    case 3:
      p_status_str = '거래완료';
      p_status_css = styles.tag_soldout;
      p_buy_available = false;
      break;
    case 4:
      p_status_str = '판매중지';
      p_status_css = styles.tag_soldout;
      p_buy_available = false;
      break;
  }

  return (
    <ScrollView>
      <View style={styles.head}>
        <ImageSlider images={product?.p_images.map(item => item.p_url)} />
      </View>
      <View style={styles.profile2}>
        <Pressable
          style={styles.profile}
          onPress={() => {
            navigation.push('UserHomeScreen', {u_id: product?.u_id});
          }}>
          <Avatar source={user?.u_photoUrl ? {uri: user?.u_photoUrl} : require('../../assets/user.png')} />
          <Text style={styles.nickname}>{user?.u_nickname}</Text>
        </Pressable>
        <Text style={[styles.text, styles.hour]}>
          {moment(product?.p_regdate).format('YYYY-MM-DD hh:mm:ss')} ({moment(product?.p_regdate).fromNow()})
        </Text>
      </View>
      <View style={styles.paddingBlock}>
        <View style={styles.row}>
          <Text style={p_status_css}>{p_status_str}</Text>
          <Text style={styles.p_title}>{product?.p_title}</Text>
        </View>
      </View>
      <View style={styles.row2}>
        <Text style={styles.p_price}>{product?.p_contents}</Text>
      </View>
      <View style={styles.iconBox}>
        <Icon name="chat" color="#898989" size={16} />
        <Text style={styles.p_price}>{product?.p_chat}</Text>
        <Icon name="remove-red-eye" color="#898989" size={16} />
        <Text style={styles.p_price}>{product?.p_view}</Text>
      </View>
      <View style={styles.borderTop}>
        <View style={styles.head2}>
          <View style={styles.row}>
            <Text style={p_badatype_css}>{p_badatype_str} </Text>
            <Text style={styles.bold}> {product?.p_price !== '' && product?.p_price !== '0' ? comma(product?.p_price) : '무료'}</Text>
          </View>
          {myInfo.u_id !== product?.u_id && p_buy_available && (
            <View style={styles.buttons}>
              <DabadaButton theme={'primary'} hasMarginBottom={false} title="채팅하기" onPress={goChattingScreen} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  paddingBlock: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  p_title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#606060',
    marginLeft: 6,
  },
  p_badatype: {
    lineHeight: 16,
    fontSize: 10,
    fontWeight: 'bold',
  },
  p_price: {
    lineHeight: 17,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 3,
    color: '#898989',
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  buttons: {
    marginRight: -16,
    padding: 12,
    width: 100,
    fontSize: 10,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
  },
  head2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    height: 60,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#dfdfdf',
  },
  profile2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 14,
  },
  bold: {fontSize: 18, fontWeight: 'bold', color: '#606060'},
  hour: {
    paddingRight: 16,
  },
  nickname: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  text: {
    color: '#606060',
    fontSize: 12,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tag_reserve: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderBottomColor: '#000',
    borderTopColor: '#000',
    fontSize: 12,
    height: 26,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tag_sell: {
    color: '#ffffff',
    backgroundColor: '#00bbe6',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#00bbe6',
    fontSize: 12,
    fontWeight: 'bold',
    height: 24,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});

export default Product;
