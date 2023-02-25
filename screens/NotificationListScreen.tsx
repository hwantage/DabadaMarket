import React, {useCallback, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';

import type {StackNavigationProp} from '@react-navigation/stack';
import {StyleSheet, View, TouchableOpacity, FlatList, ListRenderItem, ActivityIndicator, RefreshControl} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {getNotificationKeyword} from '../utils/notifications';
import useProducts from '../hooks/useProducts';
import {productProps} from '../utils/products';
import ProductCard from '../components/product/ProductCard';

function NotificationListScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const products = useProducts({u_id: authInfo.u_id, keyword: '구현중'}); // keyword 에 배열 입력시 무한루프 => 추후 확인 및 보완 필요.
  const [ncount, setNcount] = useState<number>(0);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      setLoading(false);
    }
  }, [productsReady]);

  const getNotificationCount = useCallback(() => {
    getNotificationKeyword(authInfo.u_id).then(_response => {
      if (_response !== undefined) {
        setNcount(_response.notifications.length);
      }
    });
  }, [authInfo.u_id]);

  useEffect(() => {
    isFocused && getNotificationCount();
  }, [getNotificationCount, isFocused]);

  const onPressSetting = () => {
    navigation.navigate('MyKeywordScreen');
  };

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode="sell" />;
  const listFooterComponent: any = !products.noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={products.onRefresh} refreshing={products.refreshing} colors={['#347deb']} />;

  return (
    <>
      <View style={styles.between2}>
        <View style={styles.row2}>
          <Icon name="notifications-on" size={24} style={styles.mgR} />
          <Text style={styles.text}>알림 받는 키워드 {ncount}개</Text>
        </View>
        <TouchableOpacity onPress={onPressSetting}>
          <Text style={styles.text_bl}>설정</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flex1}>
        {!loading && products !== undefined && products.products?.length === 0 ? (
          <>
            <Text style={styles.text2}>알림기능 구현중.</Text>
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
  flex2: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  between2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
    borderStyle: 'solid',
    backgroundColor: '#ffffff',
  },
  row: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row2: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mgR: {
    marginRight: 6,
  },
  text: {fontSize: 14, color: '#606060'},
  text2: {fontSize: 14, color: '#606060', textAlign: 'center', marginTop: 20},
  text_bl: {
    fontSize: 14,
    color: '#039DF4',
    marginRight: 16,
  },
  flex1: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default NotificationListScreen;
