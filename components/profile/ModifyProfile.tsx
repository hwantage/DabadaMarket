import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect, useCallback} from 'react';
import {Pressable, StyleSheet, View, Platform, Image, ActivityIndicator, ActionSheetIOS, ScrollView} from 'react-native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import DabadaText, {default as Text} from '../common/DabadaText';
import storage from '@react-native-firebase/storage';
import {createUser} from '../../utils/auth';
import DabadaInput from '../common/DabadaInput';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';
import ActionSheetModal from '../ActionSheetModal';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
  const [defaultImageIndex, setDefaultImageIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [arrDefaultImages, setArrDefaultImages] = useState<string[]>([]);

  navigation.setOptions({
    headerRight: () => (!loading ? <TopRightButton name="check" onPress={onSubmit} /> : <ActivityIndicator size={20} color="#347deb" />),
  });

  /* firebase store 의 defaultProfile 폴더의 이미지 조회 */
  useEffect(() => {
    const storageRef = storage().ref('/defaultProfile/');
    storageRef
      .listAll()
      .then(result => {
        const promises = result.items.map(item => item.getDownloadURL());
        Promise.all(promises)
          .then(urls => {
            const files: string[] = result.items.map((item, index) => urls[index]);
            setArrDefaultImages(files);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  }, []);

  const onSubmit: any = useCallback(async () => {
    setLoading(true);

    let photoURL = null;
    if (response && defaultImageIndex < 0) {
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
      photoURL = authInfo.u_photoUrl || '';
    }

    if (defaultImageIndex >= 0) {
      photoURL = arrDefaultImages[defaultImageIndex];
    }

    const userInfo = {
      u_id: authInfo.u_id,
      u_nickname: nickname,
      u_photoUrl: photoURL,
      u_group: 'somansa',
      u_lang: 'ko',
      u_fcmToken: authInfo.u_fcmToken,
    };

    createUser(userInfo); // Firebase 프로필 정보 갱신
    setAuthInfo(userInfo); // 프로필 정보 recoil 저장
    navigation.navigate('BottomTab');
  }, [arrDefaultImages, authInfo.u_fcmToken, authInfo.u_id, authInfo.u_photoUrl, defaultImageIndex, navigation, nickname, response, setAuthInfo]);

  const onPickImage = (res: any) => {
    if (res.didCancel || !res) {
      return;
    }
    setResponse(res);
    setDefaultImageIndex(-1);
  };

  const onLaunchCamera = () => {
    launchCamera(imagePickerOption, onPickImage);
  };

  const onLaunchImageLibrary = () => {
    launchImageLibrary(imagePickerOption, onPickImage);
  };

  const onPressGalary = () => {
    if (Platform.OS === 'android') {
      setModalVisible(true);
      return;
    }

    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: t('common.uploadPhoto', '사진 업로드'),
        options: [t('common.takePicture', '카메라로 촬영하기'), t('common.chooseAlbum', '사진 선택하기'), t('common.cancel', '취소')],
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

  const onPressDefault = (i: number) => {
    setResponse(null);
    setDefaultImageIndex(i);
  };

  return (
    <>
      <View style={styles.fullscreen}>
        <DabadaText style={styles.dtext}>{t('common.chooseDefaultImg', '기본 이미지 선택 ')} </DabadaText>

        <View style={styles.toprow}>
          <ScrollView contentContainerStyle={styles.imageContainer} horizontal={true} showsHorizontalScrollIndicator={true}>
            {arrDefaultImages.map((item: string, index: number) => (
              <Pressable key={index} onPress={() => onPressDefault(index)}>
                <Image style={styles.smallcircle} source={{uri: arrDefaultImages[index]}} />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <DabadaText style={styles.dtext}>{t('common.chooseUserImg', '사용자 이미지 선택 ')} </DabadaText>
        <View style={styles.row}>
          <Pressable onPress={onPressGalary}>
            <Image style={styles.circle} source={response ? {uri: response?.assets[0]?.uri} : defaultImageIndex >= 0 ? {uri: arrDefaultImages[defaultImageIndex]} : authInfo?.u_photoUrl !== '' ? {uri: authInfo.u_photoUrl} : require('../../assets/user.png')} />
            <Icon name="enhance-photo-translate" size={26} style={styles.icon} />
          </Pressable>
        </View>
        <View style={styles.fullscreen}>
          <Text style={styles.bold2}>{t('common.nickname', '닉네임')}</Text>
          <DabadaInput placeholder={t('common.nickname', '닉네임')} value={nickname} onChangeText={setNickname} onSubmitEditing={onSubmit} returnKeyType="next" hasMarginBottom={true} />
          {loading && <ActivityIndicator size={32} color="#347deb" style={styles.spinner} />}
          <ActionSheetModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            actions={[
              {
                icon: 'camera-alt',
                text: t('common.takePicture', '카메라로 촬영하기'),
                onPress: onLaunchCamera,
              },
              {
                icon: 'photo',
                text: t('common.chooseAlbum', '사진 선택하기'),
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
  imageContainer: {
    height: 70,
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  toprow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  dtext: {fontSize: 14, fontWeight: 'bold', marginTop: 12},
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
    marginVertical: 20,
  },
  smallcircle: {
    backgroundColor: '#cdcdcd',
    borderRadius: 64,
    width: 50,
    height: 50,
    marginLeft: 10,
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
    top: 120,
    right: 6,
  },
});

export default ModifyProfile;
