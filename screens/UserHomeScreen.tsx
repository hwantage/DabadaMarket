import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Text, SafeAreaView, ActivityIndicator} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import DabadaButton from '../components/common/DabadaButton';
import {getUserInfo} from '../utils/auth';
import Avatar from '../components/profile/Avatar';
import Profile from '../components/profile/Profile';
import {authInfoDefault, authInfoProps} from '../recoil/authInfoAtom';
import {RootStackParamList} from './AppStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TopLeftButton from '../components/common/TopLeftButton';
import TopRightButton from '../components/common/TopRightButton';
// import Icon from 'react-native-vector-icons/Entypo';

type UserHomeScreenProps = StackScreenProps<RootStackParamList, 'UserHomeScreen'>;

function UserHomeScreen({navigation, route}: UserHomeScreenProps) {
  const [user, setUser] = useState<authInfoProps>(authInfoDefault);
  //const {u_id} = route.params;
  const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   getUserInfo(u_id).then(_user => {
  //     setUser(_user);
  //   });
  // }, [u_id]);

  /* 우측 상단 이미지 (저장) */
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (!loading ? <TopLeftButton name="arrow-back-ios" /> : <ActivityIndicator size={20} color="#347deb" />),
      headerRight: () => (!loading ? <TopRightButton name="more-vert" /> : <ActivityIndicator size={20} color="#347deb" />),
    });
  }, [loading, navigation]);

  const onPressSell = () => {
    navigation.push('UserSellScreen', {u_id});
  };

  /* 상품 저장 */
  const onSubmit = useCallback(async () => {
    setLoading(true);
  });

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.flex}>
          <Avatar source={user?.u_photoUrl && {uri: user?.u_photoUrl}} size={60} />
          <Text style={styles.bold1}>hwan77</Text>
        </View>
        <View style={styles.sellProduct}>
          <View style={styles.flex}>
            <Text style={styles.bold2}>판매상품</Text>
            <Text style={styles.bold3}>22개</Text>
          </View>
          <Icon name="chevron-right" size={30} color="#898989" />
        </View>
        <View style={styles.review}>
          <View style={styles.flex}>
            <Text style={styles.bold2}>받은 거래 후기</Text>
            <Text style={styles.bold3}>(2)</Text>
          </View>
          <Icon name="chevron-right" size={30} color="#898989" />
        </View>
        <View style={styles.flex}>
          <Text>받은 후기가 없습니다.</Text>
        </View>
        <View style={styles.review}>
          <View style={styles.flex2}>
            <Avatar source={user?.u_photoUrl && {uri: user?.u_photoUrl}} size={48} />
            <View>
              <Text style={styles.bold3}>heecastle</Text>
              <View style={styles.row}>
                <Text>구매자</Text>
                <Icon style={styles.dot} name="circle" size={4} color="#898989" />
                <Text>3개월 전</Text>
              </View>
              <View style={styles.row}>
                <Text>감사합니다 잘 쓸게요~</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.review}>
          <View style={styles.flex2}>
            <Avatar source={user?.u_photoUrl && {uri: user?.u_photoUrl}} size={48} />
            <View>
              <Text style={styles.bold3}>hkchoi</Text>
              <View style={styles.row}>
                <Text>판매자</Text>
                <Icon style={styles.dot} name="circle" size={4} color="#898989" />
                <Text>3개월 전</Text>
              </View>
              <View style={styles.row}>
                <Text>좋은 거래였습니다 감사합니다^^</Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flex2: {
    // flex: 1,
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold1: {marginTop: 16, marginLeft: 16, fontSize: 18, fontWeight: 'bold'},
  bold2: {fontSize: 18, fontWeight: 'bold'},
  bold3: {marginLeft: 16, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  sellProduct: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  review: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    margin: 24,
  },
});

export default UserHomeScreen;
