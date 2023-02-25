import React, {useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import TopRightButton from '../components/common/TopRightButton';
import Profile from '../components/profile/Profile';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  const onPressKeyword = () => {
    navigation.push('MyKeywordScreen');
  };

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <View>
          <Profile profileUser={authInfo} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.bold2}>나의 거래</Text>
          <TouchableOpacity onPress={onPressSell} style={styles.row}>
            <Icon name="list-alt" size={30} color="#898989" />
            <Text style={styles.bold3}>판매내역</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressBuy} style={styles.row}>
            <Icon name="shopping-cart" size={30} color="#898989" />
            <Text style={styles.bold3}>구매내역</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPressKeyword} style={styles.row}>
            <Icon name="notifications" size={30} color="#898989" />
            <Text style={styles.bold3}>키워드 알림</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: '#ffffff',
  },
  flex: {
    flex: 1,
    marginTop: 60,
  },
  row: {
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bold2: {fontSize: 18, fontWeight: 'bold', marginBottom: 4},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  text: {
    fontSize: 16,
    color: '#039DF4',
    marginTop: 6,
  },
});

export default MyHomeScreen;
