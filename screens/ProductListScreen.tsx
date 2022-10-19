import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet} from 'react-native';
import TopRightButton from '../components/common/TopRightButton';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import SplashScreen from 'react-native-splash-screen';
import useProducts from '../hooks/useProducts';

function ProductListScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts();

  const productsReady = products !== null;

  useEffect(() => {
    if (productsReady) {
      SplashScreen.hide();
    }
  }, [productsReady]);

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="search" onPress={() => navigation.push('SearchScreen')} />,
    });
  }, [navigation]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  return <FlatList<productProps> data={products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />;
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
});

export default ProductListScreen;
