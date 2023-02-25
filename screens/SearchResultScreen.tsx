import React, {useEffect, useState, useCallback} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import {ActivityIndicator, FlatList, ListRenderItem, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import {RootStackParamList} from './AppStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TopRightButton from '../components/common/TopRightButton';
import {createNotificationKeyword, getNotificationKeyword, notificationKeywordProps} from '../utils/notifications';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {useRecoilState} from 'recoil';
import uuid from 'react-native-uuid';
import {useTranslation} from 'react-i18next';

type SearchResultScreenProps = StackScreenProps<RootStackParamList, 'SearchResultScreen'>;

function SearchResultScreen({navigation, route}: SearchResultScreenProps) {
  const {t} = useTranslation();
  const {keyword} = route.params;
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [notifications, setNotifications] = useState<notificationKeywordProps>();
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts({keyword: keyword});
  const [loading, setLoading] = useState(true);
  const [icon, setIcon] = useState('notifications-none');

  const productsReady = products !== undefined;

  const initNotification = useCallback(async () => {
    await getNotificationKeyword(authInfo.u_id).then(_response => {
      setNotifications(_response);
      // 이미 저장된 알림 여부 확인
      if (_response !== undefined) {
        const index = _response.notifications.findIndex(item => item.n_word === keyword);
        if (index >= 0) {
          setIcon('notifications-on');
        }
      }
    });
  }, [authInfo.u_id, keyword]);

  useEffect(() => {
    initNotification();
    if (productsReady) {
      setLoading(false);
    }
  }, [authInfo.u_id, initNotification, keyword, productsReady]);

  const onPressNotification = useCallback(() => {
    let newNotification = notifications;
    if (newNotification !== undefined) {
      const index = newNotification.notifications.findIndex(item => item.n_word === keyword);

      if (index < 0) {
        newNotification.notifications.unshift({n_id: uuid.v4().toString(), n_word: keyword});
        setIcon('notifications-on');
      } else {
        newNotification.notifications.splice(index, 1);
        setIcon('notifications-none');
      }
      createNotificationKeyword(authInfo.u_id, newNotification);
      setNotifications({...newNotification});
    } else {
      newNotification = {
        notifications: [{n_id: uuid.v4().toString(), n_word: keyword}],
      };
      createNotificationKeyword(authInfo.u_id, newNotification);
      setNotifications({...newNotification});
      setIcon('notifications-on');
    }
  }, [authInfo.u_id, keyword, notifications]);

  /* 우측 상단 이미지 (알림, 검색) */
  useEffect(() => {
    navigation.setOptions({
      title: '"' + keyword + '" ' + t('common.searchResult', '검색 결과'),
      headerRight: () => (
        <>
          <TopRightButton name={icon} onPress={onPressNotification} />
          <TopRightButton name="search" onPress={() => navigation.pop()} />
        </>
      ),
    });
  }, [icon, keyword, navigation, onPressNotification, t]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode={null} />;
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  return (
    <View style={styles.fullscreen}>
      {!loading && products !== undefined && products?.length === 0 ? (
        <>
          <View style={styles.row}>
            <Icon name="search-off" size={60} color="#898989" />
            <Text style={styles.bold}>{t('msg.notExistSearchResult', '검색 결과가 존재하지 않습니다.')}</Text>
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
