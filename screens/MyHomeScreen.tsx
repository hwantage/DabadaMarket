import React, {useEffect} from 'react';
import TopRightButton from '../components/common/TopRightButton';
import Profile from '../components/profile/Profile';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';

function MyHomeScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    navigation.setOptions({
      title: 'My Home',
      headerRight: () => <TopRightButton name="settings" onPress={() => navigation.push('SettingScreen')} />,
    });
  }, [navigation, authInfo]);

  return <Profile profileUser={authInfo} />;
}
export default MyHomeScreen;
