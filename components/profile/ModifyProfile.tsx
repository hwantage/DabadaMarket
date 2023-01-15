import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {Pressable, StyleSheet, View, Platform, Image, ActivityIndicator, ActionSheetIOS, TouchableOpacity} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {default as Text} from '../common/DabadaText';
import storage from '@react-native-firebase/storage';
import {createUser} from '../../utils/auth';
import DabadaInput from '../common/DabadaInput';
import DabadaButton from '../common/DabadaButton';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';
import ActionSheetModal from '../ActionSheetModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DabadaInputLine from '../common/DabadaInputLine';
import TopRightButton from '../common/TopRightButton';

interface type_imagePickerOption {
  mediaType: 'photo' | 'video' | 'mixed';
  maxWidth: number;
  maxHeight: number;
  includeBase64: boolean;
}

const imagePickerOption: type_imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};

function ModifyProfile() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo, setAuthInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [nickname, setNickname] = useState(authInfo.u_nickname);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  /* 우측 상단 이미지 (저장) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (!loading ? <TopRightButton name="check" onPress={onSubmit} /> : <ActivityIndicator size={20} color="#347deb" />),
    });
  }, [loading, navigation, onSubmit]);

  const onPickImage = (res: any) => {
    if (res.didCancel || !res) {
      console.log(' 취소 ');
      return;
    }
    console.log(res);
    setResponse(res);
  };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPress = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: '사진 업로드',
        options: ['카메라로 촬영하기', '사진 선택하기', '취소'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          onLaunchCamera();
        } else if (buttonIndex === 1) {
          onLaunchImageLibrary();
        }
      },
    );
  };

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;
    if (response) {
      const asset = response.assets[0];
      const extension = asset.fileName.split('.').pop(); // 확장자 추출
      const reference = storage().ref(`/profile/${authInfo.u_id}.${extension}`);

      if (Platform.OS === 'android') {
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }

      photoURL = response ? await reference.getDownloadURL() : null;
    } else {
      photoURL = authInfo.u_photoUrl || {};
    }

    const userInfo = {
      u_id: authInfo.u_id,
      u_nickname: nickname,
      u_photoUrl: photoURL,
      u_group: 'somansa',
      u_lang: 'ko',
    };

    createUser(userInfo); // Firebase 프로필 정보 갱신
    setAuthInfo(userInfo); // 프로필 정보 recoil 저장
    navigation.navigate('BottomTab');
  };

  const onCancel = async () => {
    navigation.goBack();
  };

  return (
    <>
      <View style={styles.fullscreen}>
        <View style={styles.row}>
          <Pressable onPress={onPress}>
            <Image style={styles.circle} source={response ? {uri: response?.assets[0]?.uri} : authInfo?.u_photoUrl ? {uri: authInfo.u_photoUrl} : require('../../assets/user.png')} />
            <Icon name="enhance-photo-translate" size={26} style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.fullscreen}>
          <Text style={styles.bold2}>닉네임</Text>
          <DabadaInput placeholder={t('common.nickname', '닉네임')} value={nickname} onChangeText={setNickname} onSubmitEditing={onSubmit} returnKeyType="next" hasMarginBottom={true} />
          {loading && <ActivityIndicator size={32} color="#347deb" style={styles.spinner} />}
          {/* {!loading && (
          // <View style={styles.buttons}>
          //   <DabadaButton title={t('button.save', '저장')} onPress={onSubmit} hasMarginBottom={true} />
          //   <DabadaButton title={t('button.cancel', '취소')} onPress={onCancel} theme="secondary" hasMarginBottom={false} />
          // </View>
          //상단 tab으로 close와 submit 추가하기.
        )} */}
          <ActionSheetModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            actions={[
              {
                icon: 'camera-alt',
                text: '카메라로 촬영하기',
                onPress: onLaunchCamera,
              },
              {
                icon: 'photo',
                text: '사진 선택하기',
                onPress: onLaunchImageLibrary,
              },
            ]}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  row: {
    // paddingVertical: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    // marginTop: 60,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // lineHeight: 20,
  },
  bold2: {fontSize: 18, fontWeight: 'bold', marginBottom: 8},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  block: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  circle: {
    backgroundColor: '#cdcdcd',
    borderRadius: 64,
    width: 128,
    height: 128,
    marginVertical: 36,
  },
  form: {
    // flex: 1,
    flexDirection: 'row',
    // marginTop: 16,
    // width: '100%',
  },
  input: {
    // flex: 1,
  },
  buttons: {
    marginTop: 48,
  },
  spinner: {
    marginTop: 48,
    height: 104,
  },
  icon: {
    backgroundColor: '#ffffff',
    padding: 4,
    borderRadius: 16,
    position: 'absolute',
    top: 140,
    right: 6,
  },
});

export default ModifyProfile;
