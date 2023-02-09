import React, {useEffect, useState, Fragment, useCallback} from 'react';
import {ActivityIndicator, FlatList, useWindowDimensions, ListRenderItem, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import ProductAddButton from '../components/common/ProductAddButton';

function MySellScreen() {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [index, setIndex] = React.useState(0);
  const products = useProducts({u_id: authInfo.u_id, querymode: 'sell'});
  const products_complete = useProducts({u_id: authInfo.u_id, querymode: 'sell_complete'});
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = React.useState([
    {key: 'first', title: '판매중(0)'},
    {key: 'second', title: '거래완료(0)'},
  ]);

  const productsReady = products !== undefined && products_complete !== undefined;

  const updateRoutes = useCallback(() => {
    setRoutes([
      {key: 'first', title: '판매중(' + products.productCnt + ')'},
      {key: 'second', title: '거래완료(' + products_complete.productCnt_complete + ')'},
    ]);
  }, [products.productCnt, products_complete.productCnt_complete]);

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
      updateRoutes();
    }
  }, [productsReady, updateRoutes]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode="sell" />;
  const listFooterComponent: any = !products.noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={products.onRefresh} refreshing={products.refreshing} colors={['#347deb']} />;

  const renderItem_complete: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode="sell_complete" />;
  const listFooterComponent_complete: any = !products_complete.noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl_complete: any = <RefreshControl onRefresh={products_complete.onRefresh} refreshing={products_complete.refreshing} colors={['#347deb']} />;

  const layout = useWindowDimensions();

  const FirstRoute = () => (
    <View style={styles.flex1}>
      {!loading && products !== undefined && products.products?.length === 0 ? (
        <>
          <Text style={styles.text}>판매하신 상품이 존재하지 않습니다. 하단의 상품 등록 버튼을 눌러 바로 상품을 등록해 보세요.</Text>
          <ProductAddButton />
        </>
      ) : (
        <FlatList<productProps> data={products.products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={products.onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
      )}
    </View>
  );

  const SecondRoute = () => (
    <View style={styles.flex1}>
      {!loading && products_complete !== undefined && products_complete.products?.length === 0 ? (
        <>
          <Text style={styles.text}>거래완료 상품이 존재하지 않습니다.</Text>
        </>
      ) : (
        <FlatList<productProps> data={products_complete.products} renderItem={renderItem_complete} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={products_complete.onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl_complete} ListFooterComponent={listFooterComponent_complete} />
      )}
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props: any) => <TabBar {...props} labelStyle={styles.tabLabelStyle} indicatorStyle={styles.tabIndicatorStyle} style={styles.tabStyle} />;

  return (
    <>
      {loading ? (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#347deb" />
        </View>
      ) : (
        <TabView style={styles.tab} renderTabBar={renderTabBar} navigationState={{index, routes}} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{width: layout.width}} />
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
  tab: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
  },
  flex1: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  tabStyle: {backgroundColor: '#ffffff'},
  tabLabelStyle: {color: '#898989', fontWeight: 'bold'},
  tabIndicatorStyle: {backgroundColor: '#039DF4', height: 4},
  text: {paddingTop: 40, textAlign: 'center', fontSize: 15},
});

export default MySellScreen;
