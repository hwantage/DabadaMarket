import React, {useEffect, useState} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import {ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import TopRightButton from '../components/common/TopRightButton';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {RootStackParamList} from './AppStack';

type SearchResultScreenProps = StackScreenProps<RootStackParamList, 'SearchResultScreen'>;

function SearchResultScreen({navigation, route}: SearchResultScreenProps) {
  const {keyword} = route.params;
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts({keyword: keyword});
  const [loading, setLoading] = useState(true);

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
    }
  }, [keyword, productsReady]);

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="more-vert" onPress={() => {}} />,
    });
  }, [navigation]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  return (
    <>
      {!loading && products !== undefined && products?.length === 0 ? (
        <>
          <Text>검색 결과가 존재하지 않습니다.</Text>
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
});

export default SearchResultScreen;
