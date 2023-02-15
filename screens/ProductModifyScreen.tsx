import React, {useState, useEffect, useCallback, useRef} from 'react';
import {Pressable, StyleSheet, View, Platform, Image, ActivityIndicator, Alert, ScrollView, TextInput} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import {RadioButton} from 'react-native-paper';
import DabadaInputLine from '../components/common/DabadaInputLine';
import DabadaInput from '../components/common/DabadaInput';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';
import TopLeftButton from '../components/common/TopLeftButton';
import TopRightButton from '../components/common/TopRightButton';
import {createProduct, productProps, productPropsDefault} from '../utils/products';
import uuid from 'react-native-uuid';
import events from '../utils/events';

function ProductModifyScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const ref_contents = useRef<TextInput>(null);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [product, setProduct] = useState<productProps>({...productPropsDefault, p_id: uuid.v4().toString(), u_id: authInfo.u_id});
  const [images, setImages] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      createProduct(product); // Firebase 상품 등록
      navigation.pop();
      events.emit('refresh');
    });
  }, [navigation, images, product]);

  /* 우측 상단 이미지 (저장) */
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (!loading ? <TopLeftButton name="arrow-back-ios" onPress={onSubmit} /> : <ActivityIndicator size={20} color="#347deb" />),
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
        <Pressable onPress={onSelectImage} style={styles.imageBox}>
          <Icon style={styles.icon} name="add-a-photo" size={48} />
        </Pressable>
        {images.map((item: any, index: number) => (
          <Image key={index} style={styles.imageBox} source={{uri: item.path}} />
        ))}
      </ScrollView>
      <View style={styles.form}>
        <DabadaInputLine style={styles.border} placeholder={t('common.title', '제목')} value={product.p_title} onChangeText={(text: string) => setProduct({...product, p_title: text})} hasMarginBottom={false} />
        <View style={styles.radioGroup}>
          <View style={styles.radioContainer}>
            <RadioButton value="free" status={product.p_badatype === 'free' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'free'})} />
            <Text style={styles.radioLableFont}>{t('badatype.free', '그냥바다')}</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="money" status={product.p_badatype === 'money' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'money'})} />
            <Text style={styles.radioLableFont}>{t('badatype.money', '현금바다')}</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="drink" status={product.p_badatype === 'drink' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'drink'})} />
            <Text style={styles.radioLableFont}>{t('badatype.drink', '한잔바다')}</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="secret" status={product.p_badatype === 'secret' ? 'checked' : 'unchecked'} onPress={() => setProduct({...product, p_badatype: 'secret'})} />
            <Text style={styles.radioLableFont}>{t('badatype.secret', '몰래바다')}</Text>
          </View>
        </View>
        <DabadaInputLine placeholder={t('common.price', '가격')} value={product.p_price} onChangeText={(text: string) => onChangedPrice(text)} returnKeyType="next" keyboardType="numeric" hasMarginBottom={true} onSubmitEditing={() => ref_contents.current?.focus()} />
        <View style={styles.flex1}>
          <DabadaInput style={styles.input} placeholder={'게시글을 작성해주세요.\n(판매 금지 물품은 게시가 제한 될 수 있어요.)'} value={product.p_contents} onChangeText={(text: string) => setProduct({...product, p_contents: text})} returnKeyType="default" multiline={true} numberOfLines={10} hasMarginBottom={false} ref={ref_contents} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  radioLableFont: {
    fontSize: 12,
  },
  radioGroup: {
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    flexDirection: 'row',
    alignSelf: 'center',
    lineHeight: 84,
    marginRight: 4,
  },
  block: {
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
    width: '100%',
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: '#b9b9b9',
    borderBottomWidth: 1,
    borderBottomColor: '#b9b9b9',
  },
  imageBox: {
    alignItems: 'flex-start',
    width: 90,
    height: 90,
    borderColor: '#ccc',
    borderWidth: 3,
    borderRadius: 10,
  },
  form: {
    marginTop: 16,
    width: '100%',
  },
  imageContainer: {
    flex: 1,
    borderRadius: 5,
  },
  input: {
    height: 160,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    alignItems: 'flex-start',
    borderBottomColor: '#b9b9b9',
    borderRightColor: '#b9b9b9',
    borderTopColor: '#b9b9b9',
    borderLeftColor: '#b9b9b9',
    textAlignVertical: 'top',
  },
});

export default ProductModifyScreen;
