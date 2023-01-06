import React, {useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Text, TouchableOpacity} from 'react-native';
import TopRightButton from '../components/common/TopRightButton';
import Avatar from '../components/profile/Avatar';
import Profile from '../components/profile/Profile';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DabadaButton from '../components/common/DabadaButton';

function MyHomeScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="settings" onPress={() => navigation.push('SettingScreen')} />,
    });
  }, [navigation, authInfo]);

  const onPressSell = () => {
    navigation.push('MySellScreen');
  };

  const onPressBuy = () => {
    navigation.push('MyBuyScreen');
  };

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <View>
          <Profile profileUser={authInfo} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.bold2}>나의 거래</Text>
          <TouchableOpacity title="판매내역" onPress={onPressSell} style={styles.row}>
            <Icon name="list-alt" size={30} color="#898989" />
            <Text style={styles.bold3}>판매내역</Text>
          </TouchableOpacity>
          <TouchableOpacity title="구매내역" onPress={onPressBuy} style={styles.row}>
            <Icon name="shopping-cart" size={30} color="#898989" />
            <Text style={styles.bold3}>구매내역</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {/* <Profile profileUser={authInfo} />
      <View style={styles.buttons}>
        <DabadaButton hasMarginBottom={true} title="판매내역" onPress={onPressSell} />
        <DabadaButton hasMarginBottom={true} title="구매내역" onPress={onPressBuy} />
      </View> */}
    </>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    paddingHorizontal: 22,
  },
  flex: {
    // paddingVertical: 24,
    flex: 1,
    marginTop: 60,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // lineHeight: 20,
  },
  flex3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingVertical: 10,
    // flexDirection: 'row',
  },
  avatar: {
    width: 20,
    height: 20,
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
  row: {
    paddingTop: 10,
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  mgT: {
    paddingVertical: 20,
  },

  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold1: {marginTop: 16, marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#039DF4'},
  bold2: {fontSize: 18, fontWeight: 'bold'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 16,
    color: '#039DF4',
    marginTop: 6,
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
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#b9b9b9',
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
});

export default MyHomeScreen;
