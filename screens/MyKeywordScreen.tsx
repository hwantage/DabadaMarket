import React, {useEffect, useState} from 'react';
import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import uuid from 'react-native-uuid';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaButton from '../components/common/DabadaButton';
import DabadaInput from '../components/common/DabadaInput';
import {getNotificationKeyword, createNotificationKeyword, notificationKeywordProps, resetNotificationKeyword} from '../utils/notifications';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

function MyKeywordScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [keyword, setKeyword] = useState<string>('');
  const [notifications, setNotifications] = useState<notificationKeywordProps>();

  useEffect(() => {
    getNotificationKeyword(authInfo.u_id).then(_response => {
      setNotifications(_response);
    });
  }, [authInfo]);

  const onPressRemove = (n_id: string) => {
    let newNotification = notifications;
    if (newNotification !== undefined) {
      const index = newNotification.notifications.findIndex(item => item.n_id === n_id);
      newNotification.notifications.splice(index, 1);
      setNotifications({...newNotification});
      createNotificationKeyword(authInfo.u_id, newNotification);
    }
  };

  const onPressAddNotification = () => {
    let newNotification = notifications;
    if (keyword === '') {
      Alert.alert(t('common.fail', '실패'), t('common.pleaseInputKeyword', '키워드를 입력해주세요. (예: 자전거)'));
      return;
    }
    if (newNotification !== undefined) {
      const index = newNotification.notifications.findIndex(item => item.n_word === keyword);

      if (index < 0) {
        newNotification.notifications.unshift({n_id: uuid.v4().toString(), n_word: keyword});
        createNotificationKeyword(authInfo.u_id, newNotification);
        setNotifications({...newNotification});
        setKeyword('');
      } else {
        Alert.alert(t('common.alert', '알림'), t('msg.alreadyRegistered', '이미 등록되어 있습니다.'));
      }
    } else {
      newNotification = {
        notifications: [{n_id: uuid.v4().toString(), n_word: keyword}],
      };
      createNotificationKeyword(authInfo.u_id, newNotification);
      setNotifications({...newNotification});
      setKeyword('');
    }
  };

  const goSearchResultScreen = (searchword: string) => {
    setKeyword(searchword);
    navigation.push('SearchResultScreen', {keyword: searchword});
  };

  const onPressReset = () => {
    resetNotificationKeyword(authInfo.u_id);
    setNotifications(undefined);
  };

  return (
    <View style={styles.fullscreen}>
      <View style={styles.flex}>
        <View style={styles.row2}>
          <DabadaInput placeholder={t('common.pleaseInputKeyword', '키워드를 입력해주세요. (예: 자전거)')} value={keyword} onChangeText={(text: string) => setKeyword(text)} onSubmitEditing={onPressAddNotification} hasMarginBottom={false} />
          <DabadaButton theme={'secondary'} hasMarginBottom={false} title={t('common.registKeywordNoti', '키워드 알림으로 등록하기')} onPress={onPressAddNotification} />
        </View>
      </View>
      {notifications !== undefined && (
        <View style={styles.listTitle}>
          <Text style={styles.bold}>{t('common.registeredKeyword', '등록 키워드')}</Text>
          <DabadaButton theme={'secondary'} hasMarginBottom={false} title={t('common.deleteAll', '모두 지우기')} onPress={onPressReset} />
        </View>
      )}
      <>
        {notifications !== undefined ? (
          <View style={styles.keywordArea}>
            {notifications.notifications.map(item => (
              <View key={item.n_id} style={styles.round}>
                <Pressable
                  hitSlop={2}
                  onPress={() => {
                    goSearchResultScreen(item.n_word);
                  }}>
                  <Text style={styles.text}>{item.n_word}</Text>
                </Pressable>
                <Pressable
                  hitSlop={2}
                  onPress={() => {
                    onPressRemove(item.n_id);
                  }}>
                  <Icon name="close" size={20} />
                </Pressable>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.textEmpty}>{t('msg.enterKeyword', '알림을 등록할 키워드를 입력하십시오.')}</Text>
        )}
      </>
    </View>
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
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  bold: {
    color: '#757575',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttons: {
    margin: 24,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#dfdfdf',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  touchFlex: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
  },
  touchFlex_line: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    paddingHorizontal: 16,
  },
  mgHor: {
    marginHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
  },
  reviewBtnFlex: {
    paddingVertical: 14,
    flexDirection: 'row',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#191919',
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 10,
    shadowOffset: {
      width: 0,
      height: 30,
    },
  },
  flex: {
    paddingBottom: 12,
    flexDirection: 'row',
  },
  round: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    borderColor: '#039DF4',
    borderWidth: 1,
    borderRadius: 30,
    margin: 4,
  },
  flex2: {
    paddingVertical: 10,
    flexDirection: 'row',
  },
  flex3: {
    flex: 1,
  },
  flex4: {
    width: '100%',
    flexDirection: 'row',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  listTitle: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  row2: {
    padding: 14,
    justifyContent: 'space-between',
    flex: 1,
  },
  keywordArea: {
    paddingHorizontal: 14,
    paddingBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  mgT: {
    paddingVertical: 20,
  },
  mgR: {
    marginRight: 6,
  },
  bold_bl: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#039DF4',
  },
  bold1: {fontSize: 16, fontWeight: 'bold', color: '#606060'},
  bold2: {fontSize: 16, fontWeight: 'bold', marginTop: 4, color: '#606060'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {fontSize: 14, color: '#606060', marginRight: 8},
  text_bl: {
    fontSize: 14,
    color: '#039DF4',
    marginRight: 16,
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
    width: 20,
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    width: 50,
    height: 50,
    borderRadius: 6,
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
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: '#ff0ff0',
    fontSize: 12,
    height: 26,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default MyKeywordScreen;
