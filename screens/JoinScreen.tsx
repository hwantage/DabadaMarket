import React, {useState, useRef} from 'react';
import {ActivityIndicator, Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, TextInput, Button, TouchableOpacity} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import DabadaInput from '../components/common/DabadaInput';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useSetRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {login, join, getUserInfo} from '../utils/auth';
import {useTranslation} from 'react-i18next';

type ParamList = {
  params: {
    isJoin: boolean;
  };
};

function StartScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {t} = useTranslation();
  const route = useRoute<RouteProp<ParamList, 'params'>>();
  const ref_password = useRef<TextInput>(null);
  const ref_confirmPassword = useRef<TextInput>(null);
  const isJoin = route.params?.isJoin;
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: 'hwantagexsw2@gmail.com',
    password: 'q9q9q9',
    confirmPassword: '',
  });

  const setAuthInfo = useSetRecoilState<authInfoProps>(authInfoState);

  const createChangeTextHandler = (name: string, value: string) => {
    setForm({...form, [name]: value});
  };

  const onSubmit = async () => {
    Keyboard.dismiss();

    if (form.email.trim() === '') {
      Alert.alert(t('common.fail', '실패'), t('msg.enterEmail', '이메일을 입력하십시오.'));
      return;
    }

    if (form.password.trim() === '') {
      Alert.alert(t('common.fail', '실패'), t('msg.enterPassword', '비밀번호를 입력하십시오.'));
      return;
    }

    if (isJoin && form.password !== form.confirmPassword) {
      Alert.alert(t('common.fail', '실패'), t('msg.notMatchPassword', '비밀번호가 일치하지 않습니다.'));
      return;
    }

    setLoading(true);

    try {
      const {user} = isJoin ? await join(form.email, form.password) : await login(form.email, form.password);

      console.log('user :: ', user);

      const userInfo = await getUserInfo(user.uid);
      console.log('PROFILE :', userInfo);

      if (!userInfo) {
        // 프로필 설정한 적 없으면 프로필 수정 화면으로 이동.
        setAuthInfo({u_id: user.uid, u_nickname: '', u_group: '소만사', u_photoUrl: '', u_lang: 'ko'});
        navigation.navigate('MyProfileModifyScreen');
      } else {
        setAuthInfo(userInfo);
      }
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert(t('common.fail', '실패'), t('msg.emailAlreadyInUse', '이미 가입된 이메일입니다.'));
      } else if (e.code === 'auth/wrong-password') {
        Alert.alert(t('common.fail', '실패'), t('msg.wrongPassword', '잘못된 비밀번호입니다.'));
      } else if (e.code === 'auth/user-not-found') {
        Alert.alert(t('common.fail', '실패'), t('msg.userNotFound', '존재하지 않는 계정입니다.'));
      } else if (e.code === 'auth/invalid-email') {
        Alert.alert(t('common.fail', '실패'), t('msg.invalidEmail', '유효하지 않은 이메일 주소입니다.'));
      } else if (e.code === 'auth/weak-password') {
        Alert.alert(t('common.fail', '실패'), t('msg.weakPassword', '비밀번호는 6자리 이상입니다.'));
      } else {
        Alert.alert(t('common.fail', '실패'), t('msg.fail', '실패했습니다.'));
      }
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.form}>
          {loading && (
            <View style={styles.spinnerWrapper}>
              <ActivityIndicator size={32} color="#347deb" />
            </View>
          )}
          {!loading && (
            <View>
              {!isJoin && (
                <>
                  <Text style={styles.hello}>안녕하세요!{'\n'}이메일로 로그인해주세요.</Text>
                  <DabadaInput hasMarginBottom={true} placeholder={t('common.email', '이메일')} autoCapitalize="none" autoCorrect={false} autoCompleteType="email" keyboardType="email-address" returnKeyType="next" blurOnSubmit={false} onChangeText={(text: string) => createChangeTextHandler('email', text)} onSubmitEditing={() => ref_password.current?.focus()} />
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.text}>인증메일 받기</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  hello: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#353535',
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#898989',
    borderWidth: 1.5,
    borderRadius: 5,
    borderStyle: 'solid',
    height: 38,
    alignItems: 'center',
    borderBottomColor: '#898989',
    borderRightColor: '#898989',
    borderTopColor: '#898989',
    borderLeftColor: '#898989',
  },
  text: {
    fontSize: 16,
    color: '#898989',
    marginTop: 6,
  },
  form: {
    marginTop: 50,
    width: '100%',
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default StartScreen;
