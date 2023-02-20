import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {productProps, productPropsDefault, comma} from '../../utils/products';
import moment from 'moment';
import 'moment/locale/ko';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useRecoilState} from 'recoil';

interface ProductCardProps {
  product: productProps;
  querymode: string | null;
}

function ProductCard({product: props, querymode}: ProductCardProps) {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [product, setProduct] = useState<productProps>(productPropsDefault);

  useEffect(() => {
    console.log('useeffect of ProductCardProps');
    setProduct(props);
  }, [props]);

  const onPress = () => {
    const p_viewCnt = product.p_view + 1;
    setProduct({...product, p_view: p_viewCnt}); // p_view 조회수 카운터 증가
    navigation.navigate('ProductDetailScreen', {product: {...product, p_view: p_viewCnt}, querymode});
  };

  const onPressReviewWrite = () => {
    navigation.push('ReviewWriteScreen', {product});
  };
  const onPressReviewView = () => {
    navigation.push('ReviewViewScreen', {product});
  };

  let p_badatype_str = ''; // 'free' | 'money' | 'drink' | 'secret';
  let p_badatype_css = {};
  switch (product.p_badatype) {
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

  switch (product.p_status) {
    case 1:
      p_status_str = '판매중';
      p_status_css = styles.tag_sell;
      break;
    case 2:
      p_status_str = '예약중';
      p_status_css = styles.tag_reserve;
      break;
    case 3:
      p_status_str = '거래완료';
      p_status_css = styles.tag_soldout;
      break;
    case 4:
      p_status_str = '판매중지';
      p_status_css = styles.tag_soldout;

      break;
  }

  return (
    <>
      <View style={styles.block}>
        <TouchableOpacity style={styles.touchFlex} onPress={() => onPress()}>
          <View style={styles.review}>
            <Image source={product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../../assets/user.png')} style={styles.imageBox} resizeMethod="resize" resizeMode="cover" />
            <View style={styles.flex3}>
              <View style={styles.review}>
                <Text style={styles.bold1}>{product.p_title}</Text>
                <Text style={styles.p_regdate}>{product.p_regdate !== null ? moment(product.p_regdate).fromNow() : ''}</Text>
              </View>
              <View style={styles.review}>
                <Text style={p_badatype_css}>{p_badatype_str}</Text>
                <Text style={styles.p_price}>{product.p_price !== '' && product.p_price !== '0' ? comma(product.p_price) : '무료'}</Text>
              </View>
              <View style={styles.review}>
                <Text style={p_status_css}>{p_status_str}</Text>
                <View style={styles.iconBox}>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_num}>{product.p_chat}</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_num}>{product.p_view}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {querymode === 'sell_complete' && product.p_status === 3 && authInfo.u_id === product.u_id && (
          <>
            {product.p_seller_review.p_seller_star === '' ? (
              <TouchableOpacity onPress={onPressReviewWrite}>
                <View style={styles.reviewBtnFlex}>
                  <Text style={styles.textReview1}>거래 후기 남기기</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onPressReviewView}>
                <View style={styles.reviewBtnFlex}>
                  <Text style={styles.textReview2}>거래 후기 보기</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        {querymode === 'sell_complete' && product.p_status === 3 && product.p_buyer_id && product.p_buyer_review.p_buyer_star !== '' && (
          <View style={styles.review2}>
            <View style={styles.flex2}>
              <View style={styles.mgR10}>
                <Icon2 name="emoticon" color="#039DF4" size={48} />
              </View>
              <View style={styles.row}>
                <Text style={styles.bold2}>{product.p_buyer_review.p_buyer_nickname}</Text>
                <Icon style={styles.dot} name="circle" size={4} color="#898989" />
                <Text style={styles.text}>{moment(product.p_buyer_review.p_buyer_regdate).fromNow()}</Text>
              </View>
            </View>
          </View>
        )}
        {querymode === 'buy' && product.p_status === 3 && authInfo.u_id === product.p_buyer_id && (
          <>
            {product.p_buyer_review.p_buyer_star === '' ? (
              <TouchableOpacity onPress={onPressReviewWrite}>
                <View style={styles.reviewBtnFlex}>
                  <Text style={styles.textReview1}>거래 후기 남기기</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={onPressReviewView}>
                <View style={styles.reviewBtnFlex}>
                  <Text style={styles.textReview2}>거래 후기 보기</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
        {querymode === 'buy' && product.p_status === 3 && authInfo.u_id === product.p_buyer_id && product.p_seller_review.p_seller_star !== '' && (
          <View style={styles.review2}>
            <View style={styles.flex2}>
              <View style={styles.mgR10}>
                <Icon2 name="emoticon" color="#039DF4" size={48} />
              </View>
              <View style={styles.row}>
                <Text style={styles.bold2}>{product.p_seller_review.p_seller_nickname}</Text>
                <Icon style={styles.dot} name="circle" size={4} color="#898989" />
                <Text style={styles.text}>{moment(product.p_seller_review.p_seller_regdate).fromNow()}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flex2: {
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  block: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    backgroundColor: '#ffffff',
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
  },
  p_title: {
    lineHeight: 26,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    color: 'black',
  },
  p_num: {
    lineHeight: 17,
    fontSize: 16,
    marginHorizontal: 3,
    color: '#898989',
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  touchFlex: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  flex3: {
    flex: 1,
  },
  text: {
    fontSize: 12,
    color: '#b0b0b0',
  },
  bold1: {marginTop: 4, fontSize: 16, fontWeight: 'bold', color: '#898989'},
  textReview1: {marginTop: 4, fontSize: 12, fontWeight: 'bold', color: '#166de0'},
  textReview2: {marginTop: 4, fontSize: 12, fontWeight: 'bold', color: 'black'},
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 100,
    height: 100,
    borderRadius: 6,
    color: '#898989',
    marginRight: 12,
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  review2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 6,
    marginTop: 5,
  },
  tag_soldout: {
    color: '#ffffff',
    backgroundColor: '#808080',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#808080',
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
  tag_reserve: {
    color: '#ffffff',
    backgroundColor: '#e95945',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e95945',
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
  reviewBtnFlex: {
    paddingVertical: 14,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#191919',
    shadowOpacity: 0.1,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 30,
    },
  },
  bold2: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  dot: {paddingHorizontal: 4, marginTop: 8},
  row: {
    flexDirection: 'row',
  },
  mgR10: {marginRight: 10},
});

export default ProductCard;
