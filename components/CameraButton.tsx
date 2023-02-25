import React, {useState} from 'react';
import {View, Pressable, StyleSheet, Platform, ActionSheetIOS} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

import type {StackNavigationProp} from '@react-navigation/stack';
import ActionSheetModal from './ActionSheetModal';
import {useTranslation} from 'react-i18next';

interface type_imagePickerOption {
  mediaType: 'photo' | 'video' | 'mixed';
  maxWidth: number;
  maxHeight: number;
  includeBase64: boolean;
}

const TABBAR_HEIGHT = 49;
const imagePickerOption: type_imagePickerOption = {
  mediaType: 'photo',
  maxWidth: 768,
  maxHeight: 768,
  includeBase64: Platform.OS === 'android',
};

function CameraButton() {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const bottom = Platform.select({
    android: TABBAR_HEIGHT / 2,
    ios: TABBAR_HEIGHT / 2 + insets.bottom - 4,
  });

  const onPickImage = (res: any) => {
    if (res.didCancel || !res) {
      return;
    }
    navigation.push('UploadScreen', {res});
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

  return (
    <>
      <View style={[styles.wrapper, {bottom}]}>
        <Pressable
          android_ripple={{
            color: '#ffffff',
          }}
          style={styles.circle}
          onPress={onPress}>
          <Icon name="post-add" color="white" size={24} />
        </Pressable>
      </View>
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
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 5,
    borderRadius: 27,
    height: 54,
    width: 54,
    position: 'absolute',
    left: '50%',
    transform: [
      {
        translateX: -27,
      },
    ],
    ...Platform.select({
      ios: {
        shadowColor: '#4d4d4d',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
        overflow: 'hidden',
      },
    }),
  },
  circle: {
    backgroundColor: '#6200ee',
    borderRadius: 27,
    height: 54,
    width: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraButton;
