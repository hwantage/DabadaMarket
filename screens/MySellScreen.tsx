import React, {useEffect, useState, Fragment} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ScrollView, TouchableOpacity, Image, ActivityIndicator, FlatList, useWindowDimensions, ListRenderItem, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import ProductAddButton from '../components/common/ProductAddButton';
import Icon from 'react-native-vector-icons/MaterialIcons';

function MySellScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [index, setIndex] = React.useState(0);
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh, productCnt} = useProducts({u_id: authInfo.u_id, querymode: 'sell'});
  const {products: products_complete, noMoreProduct: noMoreProduct_complete, refreshing: refreshing_complete, onLoadMore: onLoadMore_complete, onRefresh: onRefresh_complete, productCnt: productCnt_complete} = useProducts({u_id: authInfo.u_id, querymode: 'sell_complete'});
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = React.useState([
    {key: 'first', title: '판매중(0)'},
    {key: 'second', title: '거래완료(0)'},
  ]);

  const productsReady = products !== undefined && products_complete !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
      setRoutes([
        {key: 'first', title: '판매중(' + productCnt + ')'},
        {key: 'second', title: '거래완료(' + productCnt_complete + ')'},
      ]);
    }
  }, [productCnt, productCnt_complete, productsReady]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  const renderItem_complete: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} />;
  const listFooterComponent_complete: any = !noMoreProduct_complete && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl_complete: any = <RefreshControl onRefresh={onRefresh_complete} refreshing={refreshing_complete} colors={['#347deb']} />;

  const layout = useWindowDimensions();

  const FirstRoute = () => (
    <View style={styles.flex1}>
      <FlatList<productProps> data={products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
    </View>
  );

  const SecondRoute = () => (
    <View style={styles.flex1}>
      <FlatList<productProps> data={products_complete} renderItem={renderItem_complete} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={onLoadMore_complete} onEndReachedThreshold={0.75} refreshControl={listRefreshControl_complete} ListFooterComponent={listFooterComponent_complete} />
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props: any) => <TabBar {...props} labelStyle={styles.tabLabelStyle} indicatorStyle={styles.tabIndicatorStyle} style={styles.tabStyle} />;

  return (
    <>
      {!loading && products !== undefined && products?.length === 0 ? (
        <>
          <Text>판매하신 상품이 존재하지 않습니다. 하단의 상품 등록 버튼을 눌러 바로 상품을 등록해 보세요.</Text>
          <ProductAddButton />
        </>
      ) : (
        <></>
      )}
      {loading ? (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#347deb" />
        </View>
      ) : (
        // <FlatList<productProps> data={products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
        <ScrollView>
          {/* <Fragment> */}
          <View style={{flex: 1}}>
            <TabView style={styles.tab} renderTabBar={renderTabBar} navigationState={{index, routes}} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{width: layout.width}} />
            <TouchableOpacity style={styles.touchFlex}>
              <Image style={styles.imageBox} />
              <View style={styles.flex3}>
                <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
                <Text style={styles.bold2}>50,000원</Text>
                <View style={styles.review}>
                  <Text style={styles.tag_soldout}>거래완료</Text>
                  <Icon name="chevron-right" size={30} color="#898989" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchFlex}>
              <Image style={styles.imageBox} />
              <View style={styles.flex3}>
                <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
                <Text style={styles.bold2}>50,000원</Text>
                <View style={styles.review}>
                  <Text style={styles.tag_soldout}>거래완료</Text>
                  <Icon name="chevron-right" size={30} color="#898989" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchFlex}>
              <Image style={styles.imageBox} />
              <View style={styles.flex3}>
                <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
                <Text style={styles.bold2}>50,000원</Text>
                <View style={styles.review}>
                  <Text style={styles.tag_soldout}>거래완료</Text>
                  <Icon name="chevron-right" size={30} color="#898989" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchFlex}>
              <Image style={styles.imageBox} />
              <View style={styles.flex3}>
                <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
                <Text style={styles.bold2}>50,000원</Text>
                <View style={styles.review}>
                  <Text style={styles.tag_soldout}>거래완료</Text>
                  <Icon name="chevron-right" size={30} color="#898989" />
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touchFlex}>
              <Image style={styles.imageBox} />
              <View style={styles.flex3}>
                <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
                <Text style={styles.bold2}>50,000원</Text>
                <View style={styles.review}>
                  <Text style={styles.tag_soldout}>거래완료</Text>
                  <Icon name="chevron-right" size={30} color="#898989" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {/* </Fragment> */}
        </ScrollView>
      )}
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
  buttons: {
    margin: 24,
  },
  tab: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
  },
  fullscreen: {
    flex: 1,
    //paddingHorizontal: 22,
  },
  touchFlex: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  tabStyle: {backgroundColor: '#ffffff'},
  tabLabelStyle: {color: '#898989', fontWeight: 'bold'},
  tabIndicatorStyle: {backgroundColor: '#039DF4', height: 4},
  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold1: {marginTop: 4, fontSize: 16, fontWeight: 'bold', color: '#898989'},
  bold2: {fontSize: 18, fontWeight: 'bold', marginTop: 4},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 16,
    color: '#039DF4',
    marginTop: 6,
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
});

export default MySellScreen;
