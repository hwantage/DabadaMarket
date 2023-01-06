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
    <View style={styles.fullScreen}>
      <View style={styles.buttons}>
        <DabadaButton hasMarginBottom={true} title="로그아웃" onPress={onLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  buttons: {
    // margin: 24,
    padding: 24,
    flex: 1,
    backgroundColor: '#ffffff',
  },
});
export default SettingScreen;
