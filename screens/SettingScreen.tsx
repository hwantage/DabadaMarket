import React from 'react';
import {View, StyleSheet, Pressable, Alert, ScrollView} from 'react-native';
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

  const onPressChangeGroup = () => {
    Alert.alert(t('common.alert', '알림'), '바다 어장을 선택할 수 있는 기능을 준비 중입니다. 회사, 건물, 지역 등 어장 확대 및 어장 변경 기능 출시를 기대해 주십시오.');
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.buttons}>
        <View style={styles.group}>
          <View style={styles.fullScreen}>
            <Text style={styles.textLbl}>{t('common.group', '어장')}</Text>
            <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="Somansa" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={authInfo.u_group === 'somansa' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} />
            <Pressable onPress={onPressChangeGroup}>
              <Text style={styles.btnText}>{t('button.groupChange', '어장 변경')}</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.radioGroup}>
          <View style={styles.fullScreen}>
            <Text style={styles.textLbl}>{t('common.language', '언어')}</Text>
            <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="Korean" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={authInfo.u_lang === 'ko' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setLanguage('ko')} />
            <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="English" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={authInfo.u_lang === 'en' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setLanguage('en')} />
          </View>
        </View>
        <DabadaButton hasMarginBottom={false} title={t('button.logout', '로그아웃')} onPress={onLogout} />
        <ScrollView>
          <Text style={styles.text1}>{t('common.creator', '만든 사람들')}</Text>
          <Text style={styles.text2}>김정환 : Product Management, Development</Text>
          <Text style={styles.text2}>최형근 : Development</Text>
          <Text style={styles.text2}>신희성 : Research, Document works</Text>
          <Text style={styles.text2}>김바다 : Planning design, Markup</Text>
          <Text style={styles.text2}>김시윤 : Login screen & Default profile 케리커처</Text>
          <Text style={styles.text2}>openAI(DALL·E 2) : Character Design</Text>
          <Text style={styles.text3}>help : ux@somansa.com</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    flexDirection: 'row',
  },
  buttons: {
    padding: 24,
    flex: 1,
    backgroundColor: '#ffffff',
  },
  textLbl: {fontSize: 14, fontWeight: 'bold', width: 70},
  text1: {textAlign: 'center', fontSize: 17, fontWeight: 'bold', marginTop: 30, fontStyle: 'italic'},
  text2: {paddingTop: 30, textAlign: 'center', fontSize: 15, fontWeight: 'bold'},
  text3: {paddingTop: 30, textAlign: 'center', fontSize: 12, fontWeight: 'bold', color: '#039DF4'},
  btnText: {paddingTop: 5, textAlign: 'center', fontSize: 10, fontWeight: 'bold', color: '#039DF4'},
  group: {
    flexDirection: 'row',
    display: 'flex',
    marginLeft: 12,
    paddingVertical: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    display: 'flex',
    marginLeft: 12,
    paddingVertical: 12,
    marginBottom: 20,
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
    width: 100,
  },
});
export default SettingScreen;
