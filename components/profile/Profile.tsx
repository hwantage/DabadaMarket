import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {default as Text} from '../common/DabadaText';
import Avatar from './Avatar';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';

export interface avatarProps {
  profileUser: authInfoProps;
}

function Profile({profileUser}: avatarProps) {
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
    <View style={styles.userInfo}>
      <Avatar source={user?.u_photoUrl && {uri: user?.u_photoUrl}} size={128} />
      <Text style={styles.nickName}>{user?.u_nickname}</Text>
      <Text style={styles.groupName}>{user?.u_group}</Text>
      <View>
        {authInfo.u_id === user?.u_id && (
          <Pressable onPress={onPress}>
            <Text style={styles.modifyProfile}>프로필 수정</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
  },
  userInfo: {
    paddingTop: 40,
    paddingBottom: 64,
    alignItems: 'center',
  },
  nickName: {
    marginTop: 8,
    fontSize: 24,
    color: '#424242',
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
});

export default Profile;
