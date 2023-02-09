import React, {useEffect, useState, Fragment} from 'react';
import {ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import ProductAddButton from '../components/common/ProductAddButton';

function MyBuyScreen() {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const products = useProducts({u_id: authInfo.u_id, querymode: 'buy'});
  const [loading, setLoading] = useState(true);

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
    }
  }, [productsReady]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode="sell" />;
  const listFooterComponent: any = !products.noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={products.onRefresh} refreshing={products.refreshing} colors={['#347deb']} />;

  return (
    <>
      <View style={styles.flex1}>
        {!loading && products !== undefined && products.products?.length === 0 ? (
          <>
            <Text style={styles.text}>구입한 상품이 존재하지 않습니다.</Text>
            <ProductAddButton />
          </>
        ) : (
          <FlatList<productProps> data={products.products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={products.onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
        )}
      </View>
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
  flex1: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: {paddingTop: 40, textAlign: 'center', fontSize: 15},
});

export default MyBuyScreen;
