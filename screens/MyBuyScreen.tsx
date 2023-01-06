import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ActivityIndicator, FlatList, Image, ListRenderItem, RefreshControl, StyleSheet, View, SafeAreaView, TouchableOpacity, Pressable, ScrollView} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import TopLeftButton from '../components/common/TopLeftButton';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import Avatar from '../components/profile/Avatar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useProducts from '../hooks/useProducts';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaButton from '../components/common/DabadaButton';

function MyBuyScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts({u_id: authInfo.u_id, querymode: 'buy'});
  const [loading, setLoading] = useState(true);

  const onPressSendReview = () => {
    navigation.push('ReviewScreen');
  };

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
    }
  }, [products, productsReady]);

  /* 좌측 상단 이미지 (뒤로가기) */
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <TopLeftButton name="arrow-back-ios" onPress={() => navigation.pop()} />,
    });
  }, [navigation]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <ScrollView>
          <TouchableOpacity style={styles.touchFlex}>
            <Image style={styles.imageBox} />
            <View style={styles.flex3}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Text style={styles.bold2}>50,000원</Text>
              <View style={styles.review}>
                <Text style={styles.tag_soldout}>거래완료</Text>
                <View style={styles.row}>
                  <Icon name="thumb-up" color="#898989" size={16} />
                  <Text style={styles.p_price}>1</Text>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_price}>2</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_price}>10</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressSendReview}>
            <View style={styles.reviewBtnFlex}>
              <Text style={styles.bold_bl}>후기 보내기</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchFlex}>
            <Image style={styles.imageBox} />
            <View style={styles.flex3}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Text style={styles.bold2}>50,000원</Text>
              <View style={styles.review}>
                <Text style={styles.tag_soldout}>거래완료</Text>
                <View style={styles.row}>
                  <Icon name="thumb-up" color="#898989" size={16} />
                  <Text style={styles.p_price}>1</Text>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_price}>2</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_price}>10</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.reviewBtnFlex}>
              <Text style={styles.bold1}>보낸 후기 보기</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchFlex_line}>
            <Image style={styles.imageBox} />
            <View style={styles.flex3}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Text style={styles.bold2}>50,000원</Text>
              <View style={styles.review}>
                <Text style={styles.tag_soldout}>거래완료</Text>
                <View style={styles.row}>
                  <Icon name="thumb-up" color="#898989" size={16} />
                  <Text style={styles.p_price}>1</Text>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_price}>2</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_price}>10</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchFlex_line}>
            <Image style={styles.imageBox} />
            <View style={styles.flex3}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Text style={styles.bold2}>50,000원</Text>
              <View style={styles.review}>
                <Text style={styles.tag_soldout}>거래완료</Text>
                <View style={styles.row}>
                  <Icon name="thumb-up" color="#898989" size={16} />
                  <Text style={styles.p_price}>1</Text>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_price}>2</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_price}>10</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.touchFlex_line}>
            <Image style={styles.imageBox} />
            <View style={styles.flex3}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Text style={styles.bold2}>50,000원</Text>
              <View style={styles.review}>
                <Text style={styles.tag_soldout}>거래완료</Text>
                <View style={styles.row}>
                  <Icon name="thumb-up" color="#898989" size={16} />
                  <Text style={styles.p_price}>1</Text>
                  <Icon name="chat" color="#898989" size={16} />
                  <Text style={styles.p_price}>2</Text>
                  <Icon name="remove-red-eye" color="#898989" size={16} />
                  <Text style={styles.p_price}>10</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
      {/* {!loading && products !== undefined && products?.length === 0 ? (
        <>
          <Text>구매하신 상품이 존재하지 않습니다.</Text>
          <View style={styles.buttons}>
            <DabadaButton hasMarginBottom={true} title="상품 구경 가기" onPress={() => navigation.push('BottomTab')} />
          </View>
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#347deb" />
        </View>
      ) : (
        <FlatList<productProps> data={products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
      )} */}
    </>
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
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 14,
    // marginRight: 16,
    // marginBottom: 8,
    justifyContent: 'flex-end',
  },
  buttons: {
    margin: 24,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    //paddingHorizontal: 22,
  },
  touchFlex: {
    // overflow: 'hidden',
    paddingVertical: 16,
    flexDirection: 'row',
    //borderBottomWidth: 1,
    //borderStyle: 'solid',
    //borderBottomColor: '#dfdfdf',
    paddingHorizontal: 16,
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
    paddingVertical: 24,
    flexDirection: 'row',
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
  p_price: {
    lineHeight: 17,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 3,
    color: '#898989',
  },
  row: {
    paddingTop: 10,
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  mgT: {
    paddingVertical: 20,
  },

  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold_bl: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#039DF4',
  },
  bold1: {fontSize: 16, fontWeight: 'bold', color: '#606060'},
  bold2: {fontSize: 18, fontWeight: 'bold', marginTop: 4, color: '#606060'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text_lg: {
    fontSize: 14,
    //color: '#039DF4',
    color: '#898989',
    marginHorizontal: 5,
  },
  text_bl: {
    fontSize: 14,
    color: '#039DF4',
    //color: '#898989',
    marginHorizontal: 5,
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
    backgroundColor: 'transparent',
    color: '#039DF4',
    borderWidth: 1.5,
    borderRadius: 5,
    borderStyle: 'solid',
    height: 38,
    alignItems: 'center',
    borderBottomColor: '#039DF4',
    borderRightColor: '#039DF4',
    borderTopColor: '#039DF4',
    borderLeftColor: '#039DF4',
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 90,
    height: 90,
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

export default MyBuyScreen;
