import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Pressable, StyleSheet, View, Platform, Image, ActivityIndicator, Alert} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import DabadaInput from '../components/common/DabadaInput';
import DabadaButton from '../components/common/DabadaButton';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {useTranslation} from 'react-i18next';

function ProductAddScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [p_title, setP_title] = useState<string>();
  const [p_contents, setP_contents] = useState<string>();
  const [p_badatype, setP_badatype] = useState<string>('free');
  const [p_price, setP_price] = useState<string>('0');
  const [p_category] = useState<number>(1);
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    setLoading(true);

    let photoURL = null;
    if (response) {
      const asset = response.assets[0];
      const extension = asset.fileName.split('.').pop(); // 확장자 추출
      const reference = storage().ref(`/product/${authInfo.u_id}.${extension}`);

      if (Platform.OS === 'android') {
        await reference.putString(asset.base64, 'base64', {
          contentType: asset.type,
        });
      } else {
        await reference.putFile(asset.uri);
      }

      photoURL = response ? await reference.getDownloadURL() : null;
    } else {
      photoURL = authInfo?.u_photoUrl || {};
    }

    const productInfo = {
      p_id: '',
      u_id: authInfo.u_id,
      p_title: p_title,
      p_badatype: p_badatype,
      p_price: p_price,
      p_contents: p_contents,
      p_status: 1,
      p_regdate: '현재시간',
      p_like: 0,
      p_chat: 0,
      p_buyer_id: '',
      p_category: p_category,
      p_view: 0,
    };

    const productImageInfo = photoURL;
    console.log(productInfo, productImageInfo);

    //createProduct(productInfo); // Firebase 상품 등록
    //createProductImage(productImageInfo); // Firebase 상품 등록
    navigation.navigate('BottomTab');
  };

  const onSelectImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 512,
        maxHeight: 512,
        includeBase64: Platform.OS === 'android',
      },
      res => {
        if (res.didCancel) {
          console.log(' 취소 ');
          return;
        }
        console.log(res);
        setResponse(res);
      },
    );
  };

  const onChangedPrice = (text: string) => {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      } else {
        // your call back function
        Alert.alert('경고', '숫자만 입력하십시오.');
      }
    }
    setP_price(newText);
  };

  return (
    <View style={styles.block}>
      <Pressable onPress={onSelectImage}>
        <Image style={styles.imageBox} source={response ? {uri: response?.assets[0]?.uri} : authInfo?.u_photoUrl ? {uri: authInfo.u_photoUrl} : require('../assets/image.png')} />
      </Pressable>

      <View style={styles.form}>
        <DabadaInput placeholder={t('common.title', '제목')} value={p_title} onChangeText={setP_title} returnKeyType="next" hasMarginBottom={false} />
        <DabadaInput placeholder={t('common.contents', '내용')} value={p_contents} onChangeText={setP_contents} onSubmitEditing={onSubmit} returnKeyType="next" hasMarginBottom={false} />
        <View>
          <RadioButton.Group onValueChange={value => setP_badatype(value)} value={p_badatype}>
            <RadioButton.Item label="그냥바다" value="free" />
            <RadioButton.Item label="현금바다" value="money" />
            <RadioButton.Item label="한잔바다" value="drink" />
            <RadioButton.Item label="몰래바다" value="secret" />
          </RadioButton.Group>
        </View>
        <DabadaInput placeholder={t('common.price', '가격')} value={p_price} onChangeText={text => onChangedPrice(text)} onSubmitEditing={onSubmit} returnKeyType="next" keyboardType="numeric" hasMarginBottom={false} />
        {loading && <ActivityIndicator size={32} color="#6200ee" style={styles.spinner} />}
        {!loading && (
          <View style={styles.buttons}>
            <DabadaButton title={t('button.save', '저장')} onPress={onSubmit} hasMarginBottom={true} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  title: {
    fontSize: 48,
  },
  description: {
    marginTop: 16,
    fontSize: 21,
    color: '#757575',
  },
  block: {
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    width: '100%',
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    width: 128,
    height: 128,
  },
  form: {
    marginTop: 16,
    width: '100%',
  },
  buttons: {
    marginTop: 48,
  },
  spinner: {
    marginTop: 48,
    height: 104,
  },
});

export default ProductAddScreen;
