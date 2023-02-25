import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, View, Platform, Image, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Alert} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import DabadaInputLine from '../components/common/DabadaInputLine';
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
import {updateProduct, productProps, productPropsDefault, comma, uncomma, getProductInfo} from '../utils/products';
import uuid from 'react-native-uuid';
import events from '../utils/events';
import {RootStackParamList} from './AppStack';

type ProductModifyScreenProps = StackScreenProps<RootStackParamList, 'ProductModifyScreen'>;

function ProductModifyScreen({route}: ProductModifyScreenProps) {
  const {t} = useTranslation();
  const {p_id} = route.params;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const ref_contents = useRef<TextInput>(null);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [product, setProduct] = useState<productProps>({...productPropsDefault, p_images: []});
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getProductInfo(p_id).then(_response => {
      if (authInfo.u_id === _response.u_id) {
        setProduct(_response);
        /*
        const p_images = _response.p_images.map((item: productProps) => {
          return item.p_url;
        });
        //console.log('이미지들', p_images);
        //setImages(p_images);
        //console.log(_response);
        */
      } else {
        Alert.alert(t('common.alert', '알림'), t('msg.isNotMyProduct', '본인이 작성한 상품만 수정할 수 있습니다.'));
        navigation.pop();
      }
    });
  }, [authInfo.u_id, navigation, p_id, t]);

  /* 상품 저장 */
  const onSubmit = useCallback(async () => {
    setLoading(true);
    await Promise.all(
      images.map(async (item: any, index: number) => {
        const extension = item.realPath.split('.').pop(); // 확장자 추출
        const reference = storage().ref(`/product/${product.p_id}/${index}.${extension}`);

        if (Platform.OS === 'android') {
          await reference.putFile(item.path);
        } else {
          await reference.putFile('file://' + item.path);
        }
        let imageURL: string = await reference.getDownloadURL();

        product.p_images.push({pi_id: uuid.v4().toString(), p_url: imageURL});
      }),
    ).then(() => {
      updateProduct(product.p_id, {...product, p_price: uncomma(product.p_price), p_keywords: product.p_title.split(' ')}); // Firebase 상품 등록
      navigation.pop();
      events.emit('refresh');
    });
  }, [navigation, images, product]);

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

  /* 판매 가격 3자리 콤마 처리, 숫자만 입력 가능 */
  const inputPriceFormat = (str: string) => {
    setProduct({...product, p_price: comma(uncomma(str))});
  };

  return (
    <View style={styles.fullscreen}>
      <View>
        <ScrollView contentContainerStyle={styles.imageContainer} horizontal={true} showsHorizontalScrollIndicator={true}>
          <TouchableOpacity onPress={onSelectImage} style={styles.imageBox}>
            <Icon style={styles.icon} name="add-a-photo" size={38} />
            <Text style={styles.photoNum}>{images.length}/10</Text>
          </TouchableOpacity>
          {images.map((item: any, index: number) => (
            <TouchableOpacity key={index} onPress={onSelectImage}>
              <Image style={styles.imageBox} source={{uri: item.path}} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onSelectImage}>
            <Image style={styles.imageBox} source={{uri: 'https://firebasestorage.googleapis.com/v0/b/dabadamarket.appspot.com/o/product%2F941e58d6-6aa6-4386-9eca-5b0dba69470e%2F0.jpeg?alt=media&token=6da6895f-c092-43c2-be83-796c34e0f52e'}} />
            <Icon style={styles.relative} name="cancel" size={24} />
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.block}>
        <View style={styles.form}>
          <DabadaInputLine style={styles.border} placeholder={t('common.title', '제목')} value={product.p_title} onChangeText={(text: string) => setProduct({...product, p_title: text})} hasMarginBottom={false} />
          <View style={styles.radioGroup}>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="현금바다" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={product.p_badatype === 'money' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setProduct({...product, p_badatype: 'money'})} />
            </View>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="그냥바다" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={product.p_badatype === 'free' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setProduct({...product, p_badatype: 'free'})} />
            </View>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="한잔바다" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={product.p_badatype === 'drink' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setProduct({...product, p_badatype: 'drink'})} />
            </View>
            <View style={styles.container}>
              <BouncyCheckbox size={18} fillColor="#039DF4" unfillColor="#FFFFFF" text="몰래바다" innerIconStyle={styles.chkIconInner} iconStyle={styles.chkIcon} disableBuiltInState={true} isChecked={product.p_badatype === 'secret' ? true : false} textStyle={styles.chkTxt} checkIconImageSource={undefined} onPress={() => setProduct({...product, p_badatype: 'secret'})} />
            </View>
          </View>
          <DabadaInputLine placeholder={t('common.price', '₩ 가격(선택 사항)')} value={product.p_price} onChangeText={(text: string) => inputPriceFormat(text)} returnKeyType="next" keyboardType="numeric" hasMarginBottom={true} onSubmitEditing={() => ref_contents.current?.focus()} />
          <View style={styles.flex1}>
            <DabadaInput style={styles.input} placeholder={'게시글을 작성해주세요.\n(판매 금지 물품은 게시가 제한 될 수 있어요.)'} value={product.p_contents} onChangeText={(text: string) => setProduct({...product, p_contents: text})} returnKeyType="default" multiline={true} numberOfLines={10} hasMarginBottom={false} ref={ref_contents} />
          </View>
        </View>
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
  flex3: {
    flex: 1,
    flexDirection: 'row',
  },
  radioLableFont: {
    fontSize: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 12,
  },
  radioLabel: {
    flex: 2,
    alignSelf: 'center',
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  mainPhotoBox: {
    backgroundColor: '#347deb',
    opacity: 0.6,
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  mainPhotoText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  form: {
    marginTop: 8,
    width: '100%',
  },
  imageContainer: {
    padding: 12,
  },
  input: {
    height: 160,
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

export default ProductModifyScreen;
