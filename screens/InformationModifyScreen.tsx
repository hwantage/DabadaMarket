import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, Platform, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert, Dimensions} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import DabadaInput from '../components/common/DabadaInput';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';
import TopLeftButton from '../components/common/TopLeftButton';
import TopRightButton from '../components/common/TopRightButton';
import uuid from 'react-native-uuid';
import events from '../utils/events';
import {RootStackParamList} from './AppStack';
import {getInformationInfo, informationProps, informationPropsDefault, updateInformation} from '../utils/informations';

type InformationModifyScreenProps = StackScreenProps<RootStackParamList, 'InformationModifyScreen'>;

function InformationModifyScreen({route}: InformationModifyScreenProps) {
  const {t} = useTranslation();
  const {i_id} = route.params;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const ref_contents = useRef<TextInput>(null);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [information, setInformation] = useState<informationProps>({...informationPropsDefault, i_images: []});
  const [images, setImages] = useState<any>([]);
  const [dbImages, setDbImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getInformationInfo(i_id).then(_response => {
      if (authInfo.u_id === _response.u_id) {
        setInformation(_response);
        const i_images = _response.i_images;
        setDbImages(i_images);
      } else {
        Alert.alert(t('common.alert', '알림'), t('msg.isNotMyProduct', '본인이 작성한 상품만 수정할 수 있습니다.'));
        navigation.pop();
      }
    });
  }, [authInfo.u_id, navigation, i_id, t]);

  /* 상품 저장 */
  const onSubmit = useCallback(async () => {
    setLoading(true);

    information.i_images = dbImages;

    await Promise.all(
      images.map(async (item: any, index: number) => {
        const extension = item.realPath.split('.').pop(); // 확장자 추출
        const reference = storage().ref(`/information/${information.i_id}/${index}.${extension}`);

        if (Platform.OS === 'android') {
          await reference.putFile(item.path);
        } else {
          await reference.putFile('file://' + item.path);
        }
        let imageURL: string = await reference.getDownloadURL();

        information.i_images.push({ii_id: uuid.v4().toString(), ii_url: imageURL});
      }),
    ).then(() => {
      const informationInfo = {...information};
      updateInformation(information.i_id, informationInfo); // Firebase 업데이트
      navigation.pop();
      events.emit('updateInformation', i_id, informationInfo);
    });
  }, [information, dbImages, images, navigation, i_id]);

  /* 우측 상단 이미지 (저장) */
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (!loading ? <TopLeftButton name="close" onPress={() => navigation.pop()} /> : <ActivityIndicator size={20} color="#347deb" />),
      headerRight: () => (!loading ? <TopRightButton name="check" onPress={onSubmit} /> : <ActivityIndicator size={20} color="#347deb" />),
    });
  }, [loading, navigation, onSubmit]);

  /* 이미지 선택 기능 */
  const onSelectImage = async () => {
    try {
      const res = await MultipleImagePicker.openPicker({
        usedCameraButton: false,
        isExportThumbnail: true,
        allowedVideo: false,
        allowedVideoRecording: false,
        selectedAssets: images,
      });
      console.log(res);
      setImages(res);
    } catch (e: any) {
      console.log(e.code, e.message);
    }
  };

  return (
    <View style={styles.fullscreen}>
      <View style={styles.block}>
        <View style={styles.form}>
          <View style={styles.radioGroup}>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text={t('infocategory.c1', '정보')} innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={information.i_category === 1 ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setInformation({...information, i_category: 1})} />
            </View>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text={t('infocategory.c2', '질문')} innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={information.i_category === 2 ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setInformation({...information, i_category: 2})} />
            </View>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text={t('infocategory.c3', '일상 생활')} innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={information.i_category === 3 ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setInformation({...information, i_category: 3})} />
            </View>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text={t('infocategory.c4', '넋두리')} innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={information.i_category === 4 ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setInformation({...information, i_category: 4})} />
            </View>
          </View>
          <View style={styles.flex1}>
            <DabadaInput style={styles.input} placeholder={t('msg.pleaseInputInformationContents', '정보 글, 질문 글, 나누고 싶은 이야기를 적어 보세요. 어촌 동료들에게 도움이 되는 많은 이야기들을 작성해보세요.')} value={information.i_contents} onChangeText={(text: string) => setInformation({...information, i_contents: text})} returnKeyType="default" multiline={true} numberOfLines={10} hasMarginBottom={false} ref={ref_contents} />
          </View>
        </View>
      </View>
      <View style={styles.imageContainerWrapper}>
        <ScrollView contentContainerStyle={styles.imageContainer} horizontal={true} showsHorizontalScrollIndicator={true}>
          <TouchableOpacity onPress={onSelectImage} style={styles.imageBox}>
            <Icon style={styles.icon} name="add-a-photo" size={38} />
            <Text style={styles.photoNum}>{images.length}/10</Text>
          </TouchableOpacity>
          {dbImages.map((item: any) => (
            <TouchableOpacity key={item.ii_id} onPress={onSelectImage}>
              <Image style={styles.imageBox} source={{uri: item.ii_url}} />
              <Icon style={styles.relative} name="cancel" size={24} onPress={() => setDbImages(dbImages.filter((obj: any) => obj.ii_id !== item.ii_id))} />
            </TouchableOpacity>
          ))}
          {images.map((item: any, index: number) => (
            <TouchableOpacity key={index} onPress={onSelectImage}>
              <Image style={styles.imageBox} source={{uri: item.path}} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  radioGroup: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 12,
  },
  icon: {
    flexDirection: 'row',
    alignSelf: 'center',
    lineHeight: 70,
    marginRight: 4,
  },
  photoNum: {
    position: 'absolute',
    left: 28,
    bottom: 8,
    fontSize: 12,
    color: '#b9b9b9',
  },
  block: {
    paddingHorizontal: 16,
    flex: 1,
  },
  container: {
    flex: 1,
  },
  relative: {
    position: 'absolute',
    left: 71,
    top: -10,
    zIndex: 10,
  },
  text: {
    fontSize: 12,
    color: '#dfdfdf',
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#dfdfdf',
    borderBottomWidth: 1,
    borderBottomColor: '#dfdfdf',
  },
  imageBox: {
    alignItems: 'flex-start',
    width: 90,
    height: 90,
    borderColor: '#ccc',
    borderWidth: 3,
    borderRadius: 10,
    marginRight: 8,
  },
  form: {
    marginTop: 8,
    width: '100%',
  },
  imageContainerWrapper: {
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#efefef',
    borderWidth: 1,
  },
  imageContainer: {
    padding: 12,
  },
  input: {
    height: Dimensions.get('window').height - 300,
    borderRadius: 4,
    alignItems: 'flex-start',
    border: 'none',
    textAlignVertical: 'top',
  },
  chkTxt: {
    textDecorationLine: 'none',
    marginLeft: -8,
    fontSize: 14,
  },
  chkIcon: {
    borderRadius: 12,
    width: 11,
    height: 11.5,
  },
  chkIconInner: {
    borderRadius: 12,
  },
});

export default InformationModifyScreen;
