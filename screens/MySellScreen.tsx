import React, {useEffect, useState, Fragment} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ActivityIndicator, FlatList, useWindowDimensions, Image, ListRenderItem, RefreshControl, StyleSheet, View, TouchableOpacity, ScrollView, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../components/common/DabadaText';
import TopRightButton from '../components/common/TopRightButton';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import ProductAddButton from '../components/common/ProductAddButton';

function MySellScreen() {
  const FirstRoute = () => (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <Text>111</Text>
    </View>
  );

  const SecondRoute = () => <View style={{flex: 1, backgroundColor: '#673ab7'}} />;

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts({u_id: authInfo.u_id, querymode: 'sell'});
  const [loading, setLoading] = useState(true);

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
    }
  }, [productsReady]);

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="more-vert" onPress={() => {}} />,
    });
  }, [navigation]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: '판매중'},
    {key: 'second', title: '거래완료 4'},
  ]);

  const renderTabBar = props => <TabBar {...props} labelStyle={{color: '#898989', fontWeight: 'bold'}} indicatorStyle={{backgroundColor: '#039DF4', height: 4}} style={{backgroundColor: '#ffffff'}} />;

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
            <TabView renderTabBar={renderTabBar} navigationState={{index, routes}} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{width: layout.width}} />
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
  fullscreen: {
    flex: 1,
    //paddingHorizontal: 22,
  },
  touchFlex: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#b9b9b9',
    paddingHorizontal: 16,
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
