import React, {useCallback, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {StyleSheet, View, TouchableOpacity, FlatList, ListRenderItem, ActivityIndicator, RefreshControl} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {getNotificationKeyword} from '../utils/notifications';
import {useTranslation} from 'react-i18next';
import useInformations from '../hooks/useInformation';
import {informationProps} from '../utils/informations';
import InformationCard from '../components/information/InformationCard';
import InformationAddButton from '../components/common/InformationAddButton';

function NotificationListScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const informations = useInformations({i_group: authInfo.u_group});
  const [ncount, setNcount] = useState<number>(0);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);

  const informationsReady = informations !== undefined;

  useEffect(() => {
    if (informationsReady) {
      setLoading(false);
    }
  }, [informationsReady]);

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

  const renderItem: ListRenderItem<informationProps> = ({item}) => <InformationCard information={item} />;
  const listFooterComponent: any = !informations.noMoreInformation && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={informations.refreshInformation} refreshing={informations.refreshing} colors={['#347deb']} />;

  return (
    <>
      <View style={styles.between2}>
        <View style={styles.row2}>
          <Icon name="notifications-on" size={24} style={styles.mgR} />
          <Text style={styles.text}>{t('common.notiKeywordCnt', '알림 받는 키워드 ' + {ncount} + '개', {cnt: ncount})}</Text>
        </View>
        <TouchableOpacity onPress={onPressSetting}>
          <Text style={styles.text_bl}>{t('common.setting', '설정')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.flex1}>
        <InformationAddButton />
        {!loading && informations !== undefined && informations.informations?.length === 0 ? (
          <>
            <Text style={styles.text2}>기능 구현중.{informations.informations?.length}</Text>
          </>
        ) : (
          <FlatList<informationProps> data={informations.informations} renderItem={renderItem} keyExtractor={item => item.i_id} contentContainerStyle={styles.container} onEndReached={informations.onLoadMoreInfo} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
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
