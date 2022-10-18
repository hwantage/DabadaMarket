import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Pressable, StyleSheet, View, Platform, Image, ActivityIndicator, Alert, ScrollView, TextInput} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import {RadioButton} from 'react-native-paper';
import DabadaInput from '../components/common/DabadaInput';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';
import TopRightButton from '../components/common/TopRightButton';
import {productProps, createProduct, createProductImage, productImageProps} from '../utils/product';
import uuid from 'react-native-uuid';

function ProductAddScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const ref_contents = useRef<TextInput>(null);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [product, setProduct] = useState<productProps>({
    p_id: uuid.v4().toString(),
    u_id: authInfo.u_id,
    p_title: '',
    p_badatype: 'free',
    p_price: '',
    p_contents: '',
    p_status: 1, // 1:판매중, 2:예약중, 3:판매완료, 4:판매중지
    p_regdate: '',
    p_like: 0,
    p_chat: 0,
    p_buyer_id: '',
    p_category: 1, // 고정값(카테고리 기능 추후 구현)
    p_view: 0,
  });
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  /* 상품 저장 */
  const onSubmit = useCallback(async () => {
    setLoading(true);
    let productImage: productImageProps[] = [];

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

        productImage.push({pi_id: uuid.v4().toString(), p_id: product.p_id, p_url: imageURL});
      }),
    ).then(() => {
      console.log('product::', product);
      createProduct(product); // Firebase 상품 등록
      createProductImage(product.p_id, productImage); // Firebase 이미지 등록
      navigation.navigate('BottomTab');
    });
  }, [navigation, product, images]);

  /* 우측 상단 이미지 (저장) */
  useEffect(() => {
    navigation.setOptions({
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

      console.log('response: ', res);
      console.log(res[0]?.realPath);
      setImages(res);
    } catch (e: any) {
      console.log(e.code, e.message);
    }
  };

  /* 판매 가격 숫자만 입력 가능 */
  const onChangedPrice = (text: string) => {
    let price = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        price = price + text[i];
      } else {
        // your call back function
        Alert.alert('경고', '숫자만 입력하십시오.');
      }
    }
    setProduct({...product, p_price: price});
  };

  return (
    <View style={styles.block}>
      <ScrollView contentContainerStyle={styles.imageContainer} horizontal={true} showsHorizontalScrollIndicator={true}>
        <Pressable onPress={onSelectImage}>
          <Image style={styles.imageBox} source={require('../assets/image.png')} />
        </Pressable>
        {images.map((item: any, index: number) => (
          <Image key={index} style={styles.imageBox} source={{uri: item.path}} />
        ))}
      </ScrollView>

      <View style={styles.form}>
        <DabadaInput placeholder={t('common.title', '제목')} value={product.p_title} onChangeText={(text: string) => setProduct({...product, p_title: text})} hasMarginBottom={false} />
        <View style={styles.radioGroup}>
          <View style={styles.flex1}>
            <RadioButton value="free" status={product.p_badatype === 'free' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'free'})} />
          </View>
          <View style={styles.radioLabel}>
            <Text style={styles.radioLableFont}>{t('badatype.free', '그냥바다')}</Text>
          </View>
          <View style={styles.flex1}>
            <RadioButton value="money" status={product.p_badatype === 'money' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'money'})} />
          </View>
          <View style={styles.radioLabel}>
            <Text style={styles.radioLableFont}>{t('badatype.money', '현금바다')}</Text>
          </View>
          <View style={styles.flex1}>
            <RadioButton value="drink" status={product.p_badatype === 'drink' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'drink'})} />
          </View>
          <View style={styles.radioLabel}>
            <Text style={styles.radioLableFont}>{t('badatype.drink', '한잔바다')}</Text>
          </View>
          <View style={styles.flex1}>
            <RadioButton value="secret" status={product.p_badatype === 'secret' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'secret'})} />
          </View>
          <View style={styles.radioLabel}>
            <Text style={styles.radioLableFont}>{t('badatype.secret', '몰래바다')}</Text>
          </View>
        </View>
        <DabadaInput placeholder={t('common.price', '가격')} value={product.p_price} onChangeText={(text: string) => onChangedPrice(text)} returnKeyType="next" keyboardType="numeric" hasMarginBottom={true} onSubmitEditing={() => ref_contents.current?.focus()} />
        <DabadaInput placeholder={t('common.contents', '내용')} value={product.p_contents} onChangeText={(text: string) => setProduct({...product, p_contents: text})} returnKeyType="default" multiline={true} numberOfLines={10} hasMarginBottom={false} ref={ref_contents} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  radioLableFont: {
    fontSize: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  radioLabel: {
    flex: 2,
    alignSelf: 'center',
  },
  block: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    width: 78,
    height: 78,
    marginRight: 5,
    borderRadius: 4,
  },
  form: {
    marginTop: 16,
    width: '100%',
  },
  imageContainer: {
    paddingBottom: 5,
  },
});

export default ProductAddScreen;
