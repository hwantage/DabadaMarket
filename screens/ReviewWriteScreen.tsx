import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserInfo} from '../utils/auth';
import DabadaButton from '../components/common/DabadaButton';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaInput from '../components/common/DabadaInput';
import {RootStackParamList} from './AppStack';
import {updateProductField} from '../utils/products';
import events from '../utils/events';
import {useRecoilState} from 'recoil';
import moment from 'moment-timezone';
import {useTranslation} from 'react-i18next';

type ReviewWriteScreenProps = StackScreenProps<RootStackParamList, 'ReviewWriteScreen'>;

function ReviewWriteScreen({navigation, route}: ReviewWriteScreenProps) {
  const {t} = useTranslation();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [targetUser, setTargetUser] = useState<authInfoProps>(); // 상품 구매자 정보
  const [star, setStar] = useState<string>('5');
  const [note, setNote] = useState<string>('');

  const {product} = route.params;
  const initTargetUser = useCallback(async () => {
    await getUserInfo(product.p_buyer_id).then(_user => {
      setTargetUser(_user);
    });
  }, [product.p_buyer_id]);

  useEffect(() => {
    initTargetUser();
  }, [initTargetUser]);

  const onPressWriteReview = () => {
    const regdate = moment().format('YYYY-MM-DD HH:mm:ss');

    if (authInfo.u_id === product.u_id) {
      updateProductField(product.p_id, 'p_seller_review', {p_seller_star: star, p_seller_note: note, p_seller_nickname: authInfo.u_nickname, p_seller_regdate: regdate});
      events.emit('updateProduct', product.p_id, {...product, p_seller_review: {p_seller_star: star, p_seller_note: note, p_seller_nickname: authInfo.u_nickname, p_seller_regdate: regdate}});
    } else {
      updateProductField(product.p_id, 'p_buyer_review', {p_buyer_star: star, p_buyer_note: note, p_buyer_nickname: authInfo.u_nickname, p_buyer_regdate: regdate});
      events.emit('updateProduct', product.p_id, {...product, p_buyer_review: {p_buyer_star: star, p_buyer_note: note, p_buyer_nickname: authInfo.u_nickname, p_buyer_regdate: regdate}});
    }

    navigation.pop();
  };

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.touchFlex}>
          <Image source={product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../assets/user.png')} style={styles.imageBox} resizeMethod="resize" resizeMode="cover" />
          <View style={styles.flex3}>
            <Text style={styles.bold1}>{product.p_title}</Text>
            <View style={styles.row}>
              <Text style={styles.text}>{t('common.tradeNeighbors', '거래한 이웃')}</Text>
              <Text style={styles.bold3}>{targetUser?.u_nickname}</Text>
            </View>
          </View>
        </View>
        <ScrollView>
          <View style={styles.touchFlex_noborder}>
            <Text style={styles.bold2}>
              {authInfo.u_nickname}
              {t('common.dear', '님')},{'\n'}
              {targetUser?.u_nickname}
              {t('msg.howAboutTrade', '님과 거래가 어떠셨나요?')}
              {'\n'}
              <Text style={styles.text}>{t('msg.onlyCanSeeMe', '거래 선호도는 나만 볼 수 있어요.')}</Text>
            </Text>
          </View>
          <View style={styles.touchFlex_emoji}>
            <TouchableOpacity style={styles.flex4} onPress={() => setStar('5')}>
              <Icon name="emoticon" color={star === '5' ? '#039DF4' : '#b9b9b9'} size={70} />
              <Text style={styles.text}>{t('common.star5', '좋아요!')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex4} onPress={() => setStar('3')}>
              <Icon name="emoticon-neutral" color={star === '3' ? '#d4b031' : '#b9b9b9'} size={70} />
              <Text style={styles.text}>{t('common.star3', '별로에요!')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex4} onPress={() => setStar('1')}>
              <Icon name="emoticon-sad" color={star === '1' ? '#c94f26' : '#b9b9b9'} size={70} />
              <Text style={styles.text}>{t('common.star1', '안좋아요!')}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flex2}>
            <Text style={styles.bold1}>{t('msg.pleaseYourExperience', '따뜻한 거래 경험을 알려주세요!')}</Text>
            <DabadaInput style={styles.border} placeholder={t('common.inputHere', '여기에 적어주세요. (선택사항)')} onChangeText={(text: string) => setNote(text)} returnKeyType="default" multiline={true} numberOfLines={3} hasMarginBottom={false} />
            <DabadaButton hasMarginBottom={true} title={t('button.writeReview', '후기 보내기')} onPress={onPressWriteReview} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  touchFlex: {
    paddingVertical: 14,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    paddingHorizontal: 14,
    backgroundColor: '#fefefe',
  },
  touchFlex_noborder: {
    paddingTop: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  touchFlex_emoji: {
    paddingVertical: 38,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flex2: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  flex3: {
    flex: 1,
  },
  flex4: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  border: {
    marginVertical: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfdfdf',
    height: 100,
    borderRadius: 4,
    alignItems: 'flex-start',
    border: 'none',
    textAlignVertical: 'top',
    color: '#000000',
  },
  bold1: {fontSize: 16, fontWeight: 'bold', color: '#898989'},
  bold2: {fontSize: 20, fontWeight: 'bold'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 14,
    color: '#898989',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#039DF4',
    borderWidth: 1.5,
    borderRadius: 5,
    borderStyle: 'solid',
    height: 38,
    alignItems: 'center',
    borderBottomColor: '#039DF4',
    borderRightColor: '#039DF4',
    borderTopColor: '#039DF4',
    borderLeftColor: '#039DF4',
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 50,
    height: 50,
    borderRadius: 6,
    color: '#898989',
    marginRight: 12,
  },
});

export default ReviewWriteScreen;
