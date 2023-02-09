import React, {useEffect, useState} from 'react';
import {View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, Image} from 'react-native';
import type {StackScreenProps} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getUserInfo} from '../utils/auth';
import {authInfoProps} from '../recoil/authInfoAtom';
import {RootStackParamList} from './AppStack';

type ReviewViewScreenProps = StackScreenProps<RootStackParamList, 'ReviewViewScreen'>;

function ReviewViewScreen({route}: ReviewViewScreenProps) {
  const [user, setUser] = useState<authInfoProps>(); // 상품 등록자 정보
  const [buyer, setBuyer] = useState<authInfoProps>(); // 상품 구매자 정보

  const {product} = route.params;
  useEffect(() => {
    getUserInfo(product.u_id).then(_user => {
      setUser(_user);
    });
    getUserInfo(product.p_buyer_id).then(_user => {
      setBuyer(_user);
    });
  }, [product]);

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
            <View style={styles.row}>
              <Text style={styles.text}>거래한 이웃</Text>
              <Text style={styles.bold3}>badasea</Text>
            </View>
          </View>
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.touchFlex_noborder}>
            <Text style={styles.bold2}>
              {user?.u_nickname}님,{'\n'}
              {buyer?.u_nickname}님에게 보낸 거래 후기 입니다.{'\n'}
            </Text>
          </View>
          <View style={styles.touchFlex_emoji}>
            <View style={styles.flex4}>
              <Icon name="emoticon" color={product.p_seller_review.p_seller_star === '5' ? '#039DF4' : '#b9b9b9'} size={70} />
              <Text style={styles.text}>좋아요!</Text>
            </View>
            <View style={styles.flex4}>
              <Icon name="emoticon-neutral" color={product.p_seller_review.p_seller_star === '3' ? '#d4b031' : '#b9b9b9'} size={70} />
              <Text style={styles.text}>별로에요!</Text>
            </View>
            <View style={styles.flex4}>
              <Icon name="emoticon-sad" color={product.p_seller_review.p_seller_star === '1' ? '#c94f26' : '#b9b9b9'} size={70} />
              <Text style={styles.text}>안좋아요!</Text>
            </View>
          </View>
          <View style={styles.flex2}>
            <Text style={styles.bold1}>{product.p_seller_review.p_seller_note}</Text>
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

export default ReviewViewScreen;
