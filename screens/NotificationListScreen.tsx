import React, {useCallback, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {Image, StyleSheet, View, TouchableOpacity, ScrollView} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {getNotificationKeyword} from '../utils/notifications';

function NotificationListScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [ncount, setNcount] = useState<number>(0);
  const isFocused = useIsFocused();

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
      <ScrollView style={styles.fullscreen}>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <View style={styles.review}>
              <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
              <Icon name="close" size={24} />
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>소만사</Text>
              <Icon name="circle" size={6} style={styles.mgHor} />
              <Text style={styles.text}>5분 전</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      {/* {!loading && products !== undefined && products?.length === 0 ? (
        <>
          <Text>구매하신 상품이 존재하지 않습니다.</Text>
          <View style={styles.buttons}>
            <DabadaButton hasMarginBottom={true} title="상품 구경 가기" onPress={() => navigation.push('BottomTab')} />
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
      )} */}
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
  buttons: {
    margin: 24,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    //paddingHorizontal: 22,
  },
  touchFlex: {
    // overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    //borderBottomWidth: 1,
    //borderStyle: 'solid',
    //borderBottomColor: '#dfdfdf',

    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    //position: 'absolute',
    // overflow: 'hidden',

    // shadowBottomColor: '#000',
    // shadowOffset: {width: 1, height: 1},
    // shadowOpacity: 0.4,
    // shadowRadius: 3,
    // elevation: 5,
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
    marginHorizontal: 3,
  },
  reviewBtnFlex: {
    paddingVertical: 14,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // borderStyle: 'solid',
    // borderBottomColor: '#dfdfdf',
    // paddingHorizontal: 16,
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 2,
    // borderRadius: 5,
    backgroundColor: 'white',
    shadowColor: '#191919',
    //shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 0,
    elevation: 10,
    //shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 30,
    },
    //shadowOpacity: 0.25,
    //shadowRadius: 3,
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
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  row2: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mgT: {
    paddingVertical: 20,
  },
  mgR: {
    marginRight: 6,
  },
  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold_bl: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#039DF4',
  },
  bold1: {fontSize: 16, fontWeight: 'bold', color: '#606060'},
  bold2: {fontSize: 18, fontWeight: 'bold', marginTop: 4, color: '#606060'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {fontSize: 14, color: '#606060'},
  text_bl: {
    fontSize: 14,
    color: '#039DF4',
    //color: '#898989',
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
    // alignItems: 'center',
    width: 50,
    height: 50,
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
    //backgroundColor: '#FFF',
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
});

export default NotificationListScreen;
