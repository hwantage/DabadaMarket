import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {default as Text} from '../common/DabadaText';
import Avatar from './Avatar';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';

export interface avatarProps {
  profileUser: authInfoProps;
}

function Profile({profileUser}: avatarProps) {
  const {t} = useTranslation();
  const [user, setUser] = useState<authInfoProps>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    setUser(profileUser);
  }, [profileUser]);

  const onPress = () => {
    navigation.navigate('MyProfileModifyScreen');
  };

  return (
    <>
      <View style={styles.userInfo}>
        <Avatar source={user?.u_photoUrl !== '' && {uri: user?.u_photoUrl}} size={140} />
        {/* <Text style={styles.groupName}>{user?.u_group}</Text> */}
      </View>
      <View style={styles.userInfo2}>
        <Text style={styles.nickName}>{user?.u_nickname}</Text>
      </View>
      <View style={styles.block}>
        {authInfo.u_id === user?.u_id && (
          <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.text}>{t('button.editProfile', '프로필 수정')}</Text>
          </Pressable>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  userInfo: {
    paddingTop: 24,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userInfo2: {
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  nickName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#039DF4',
  },
  groupName: {
    marginTop: 8,
    fontSize: 16,
    color: 'gray',
  },
  modifyProfile: {
    fontSize: 12,
    color: 'gray',
  },
  text: {
    fontSize: 16,
    color: '#039DF4',
    marginTop: 6,
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

export default Profile;
