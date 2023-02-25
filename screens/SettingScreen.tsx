import React from 'react';
import {View, StyleSheet} from 'react-native';
import DabadaButton from '../components/common/DabadaButton';
import {useSetRecoilState} from 'recoil';
import {authInfoProps, authInfoState, authInfoDefault} from '../recoil/authInfoAtom';
import {default as Text} from '../components/common/DabadaText';

function SettingScreen() {
  const setAuthInfo = useSetRecoilState<authInfoProps>(authInfoState);
  const onLogout = () => {
    setAuthInfo(authInfoDefault);
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.buttons}>
        <DabadaButton hasMarginBottom={true} title="로그아웃" onPress={onLogout} />
        <Text style={styles.text1}>만든 사람들</Text>
        <Text style={styles.text2}>김정환 : Product Management, Development</Text>
        <Text style={styles.text2}>최형근 : Development</Text>
        <Text style={styles.text2}>신희성 : Research, Document works</Text>
        <Text style={styles.text2}>김바다 : Planning design, Markup</Text>
        <Text style={styles.text2}>김시윤 : Login screen 케리커처</Text>
        <Text style={styles.text2}>openAI(DALL·E 2) : Character Design</Text>
        <Text style={styles.text3}>help : ux@somansa.com</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  buttons: {
    padding: 24,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text1: {textAlign: 'center', fontSize: 17, fontWeight: 'bold'},
  text2: {paddingTop: 40, textAlign: 'center', fontSize: 15, fontWeight: 'bold'},
  text3: {paddingTop: 40, textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: '#039DF4'},
});
export default SettingScreen;
