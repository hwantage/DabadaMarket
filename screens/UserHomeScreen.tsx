import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import DabadaButton from '../components/common/DabadaButton';
import {getUserInfo} from '../utils/auth';
import Profile from '../components/profile/Profile';
import {authInfoDefault, authInfoProps} from '../recoil/authInfoAtom';
import {RootStackParamList} from './AppStack';

type UserHomeScreenProps = StackScreenProps<RootStackParamList, 'UserHomeScreen'>;

function UserHomeScreen({navigation, route}: UserHomeScreenProps) {
  const [user, setUser] = useState<authInfoProps>(authInfoDefault);
  const {u_id} = route.params;

  useEffect(() => {
    console.log(u_id);
    getUserInfo(u_id).then(_user => {
      setUser(_user);
    });
  }, [u_id]);

  const onPressSell = () => {
    navigation.push('UserSellScreen', {u_id});
  };

  return (
    <>
      <Profile profileUser={user} />
      <View style={styles.buttons}>
        <DabadaButton hasMarginBottom={true} title="판매내역" onPress={onPressSell} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  buttons: {
    margin: 24,
  },
});

export default UserHomeScreen;
