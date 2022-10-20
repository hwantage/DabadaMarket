import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import TopRightButton from '../components/common/TopRightButton';
import Profile from '../components/profile/Profile';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
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
      <Profile profileUser={authInfo} />
      <View style={styles.buttons}>
        <DabadaButton hasMarginBottom={true} title="판매내역" onPress={onPressSell} />
        <DabadaButton hasMarginBottom={true} title="구매내역" onPress={onPressBuy} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttons: {
    margin: 24,
  },
});

export default MyHomeScreen;
