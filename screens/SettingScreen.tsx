import React from 'react';
import {View, StyleSheet} from 'react-native';
import DabadaButton from '../components/common/DabadaButton';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState, authInfoDefault} from '../recoil/authInfoAtom';
import {default as Text} from '../components/common/DabadaText';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import {createUser} from '../utils/auth';

function SettingScreen() {
  const {t, i18n} = useTranslation();
  const [authInfo, setAuthInfo] = useRecoilState<authInfoProps>(authInfoState);
  const onLogout = () => {
    setAuthInfo(authInfoDefault);
  };

  const setLanguage = (lang: string) => {
    const updatedInfo = {...authInfo, u_lang: lang};
    createUser(updatedInfo);
    setAuthInfo(updatedInfo);
    i18n.changeLanguage(lang);
    AsyncStorage.setItem('@language', lang);
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.buttons}>
        <View style={styles.radioGroup}>
          <View style={styles.fullScreen}>
            <Text style={styles.textLan}>Language</Text>
          </View>
          <View style={styles.fullScreen}>
            <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="Korean" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={authInfo.u_lang === 'ko' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setLanguage('ko')} />
          </View>
          <View style={styles.fullScreen}>
            <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="English" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={authInfo.u_lang === 'en' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setLanguage('en')} />
          </View>
        </View>
        <DabadaButton hasMarginBottom={true} title={t('button.logout', '로그아웃')} onPress={onLogout} />
        <Text style={styles.text1}>{t('common.creator', '만든 사람들')}</Text>
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
  textLan: {fontSize: 14, fontWeight: 'bold'},
  text1: {textAlign: 'center', fontSize: 17, fontWeight: 'bold'},
  text2: {paddingTop: 40, textAlign: 'center', fontSize: 15, fontWeight: 'bold'},
  text3: {paddingTop: 40, textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: '#039DF4'},
  radioGroup: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 12,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chkIcon: {
    borderRadius: 12,
    width: 11,
    height: 11.5,
  },
  chkIconInner: {
    borderRadius: 12,
  },
  chkTxt: {
    textDecorationLine: 'none',
    marginLeft: -8,
    fontSize: 14,
  },
});
export default SettingScreen;
