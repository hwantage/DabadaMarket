import React, {useEffect, useState} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import {ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {RootStackParamList} from './AppStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TopRightButton from '../components/common/TopRightButton';

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
      headerRight: () => <TopRightButton name="search" onPress={() => navigation.pop()} />,
    });
  }, [navigation]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode={null} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  return (
    <View style={styles.fullscreen}>
      {!loading && products !== undefined && products?.length === 0 ? (
        <>
          <View style={styles.row}>
            <Icon name="search-off" size={60} color="#898989" />
            <Text style={styles.bold}>검색 결과가 존재하지 않습니다.</Text>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  row: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  bold: {
    color: '#757575',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SearchResultScreen;
