import React from 'react';
import {View, StyleSheet} from 'react-native';
import DabadaButton from '../components/common/DabadaButton';
import {useSetRecoilState} from 'recoil';
import {authInfoProps, authInfoState, authInfoDefault} from '../recoil/authInfoAtom';

function SettingScreen() {
  const setAuthInfo = useSetRecoilState<authInfoProps>(authInfoState);
  const onLogout = () => {
    setAuthInfo(authInfoDefault);
  };

  return (
    <View style={styles.buttons}>
      <DabadaButton hasMarginBottom={true} title="로그아웃" onPress={onLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    margin: 24,
  },
});
export default SettingScreen;
