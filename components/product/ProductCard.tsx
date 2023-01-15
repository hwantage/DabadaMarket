import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {productProps} from '../../utils/products';
import moment from 'moment';
import 'moment/locale/ko';

interface ProductCardProps {
  product: productProps;
}

function ProductCard({product}: ProductCardProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const onPress = (productInfo: productProps) => {
    navigation.navigate('ProductDetailScreen', productInfo);
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

  let p_status_str = ''; // 1:판매중, 2:예약중, 3:판매완료, 4:판매중지
  let p_status_css = {};

  switch (product.p_status) {
    case 1:
      p_status_str = '판매중';
      p_status_css = styles.tag_reserve;
      break;
    case 2:
      p_status_str = '예약중';
      p_status_css = styles.tag_reserve;
      break;
    case 3:
      p_status_str = '판매완료';
      p_status_css = styles.tag_reserve;
      break;
    case 4:
      p_status_str = '판매중지';
      p_status_css = styles.tag_reserve;

      break;
  }

  return (
    <>
      <View style={styles.block}>
        <TouchableOpacity style={styles.touchFlex} onPress={() => onPress(product)}>
          <View style={styles.review}>
            <Image source={product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../../assets/user.png')} style={styles.imageBox} resizeMethod="resize" resizeMode="cover" />
            <View style={styles.flex3}>
              <View style={styles.review}>
                <Text style={styles.bold1}>{product.p_title}제목입니다</Text>
                <Text style={styles.p_regdate}>{moment(product.p_regdate).fromNow()}</Text>
              </View>
              <View style={styles.review}>
                <Text style={styles.p_badatype}>{p_badatype_str}</Text>
                <Text style={styles.bold1}>{product.p_price}50,000원</Text>
              </View>
              <View style={styles.review}>
                <Text style={styles.tag_soldout}>{p_status_str}</Text>
                {/* <Text style={styles.tag_reserve}>예약중</Text>
                <Text style={styles.tag_sell}>판매중</Text> */}
                <View style={styles.iconBox}>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_price}>{product.p_chat}</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_price}>{product.p_view}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    // paddingTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    backgroundColor: '#ffffff',
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  row: {
    paddingTop: 10,
    // textAlign: 20,
    flexDirection: 'column',
    alignItems: 'center',
    // paddingBottom: 2,
    justifyContent: 'space-between',
    // paddingVertical: 10,
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
    color: '#898989',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: 100,
    aspectRatio: 1,
    marginBottom: 6,
    borderRadius: 10,
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  mgHor: {
    marginHorizontal: 3,
  },

  touchFlex: {
    // paddingVertical: 8,
    flexDirection: 'column',
    justifyContent: 'space-between',
    // paddingHorizontal: 8,
  },
  flex3: {
    flex: 1,
  },
  bold1: {marginTop: 4, fontSize: 16, fontWeight: 'bold', color: '#898989'},
  bold2: {fontSize: 18, fontWeight: 'bold', marginTop: 4},
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 100,
    height: 100,
    borderRadius: 6,
    //backgroundColor: 'transparent',
    color: '#898989',
    marginRight: 12,
  },
  review: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default ProductCard;
