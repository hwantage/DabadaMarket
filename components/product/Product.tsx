import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Image, Pressable, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Slideshow from 'react-native-image-slider-show';
import {productProps} from '../../utils/products';
import DabadaButton from '../common/DabadaButton';
import Avatar from '../profile/Avatar';
import {getUserInfo} from '../../utils/auth';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useRecoilValue} from 'recoil';
import {chattingInfoState} from '../../recoil/chattingAtom';
import moment from 'moment';
import 'moment/locale/ko';

interface ProductProps {
  product: productProps;
}

function Product({product}: ProductProps) {
  const [user, setUser] = useState<authInfoProps>();
  const [imageIndex, setImageIndex] = useState<number>(0);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const chattingStateInfo = useRecoilValue(chattingInfoState);
  const myInfo = useRecoilValue(authInfoState);

  console.log(myInfo);
  console.log(product.u_id);
  useEffect(() => {
    getUserInfo(product.u_id).then(_user => {
      setUser(_user);
    });
  }, [product]);

  const onPressImage = () => {
    // 이미지 상세보기
  };

  const getPrevImage = useCallback((): void => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
  }, [imageIndex]);

  const getNextImage = useCallback(() => {
    if (imageIndex < product.p_images.length - 1) {
      setImageIndex(imageIndex + 1);
    }
  }, [imageIndex, product.p_images.length]);

  const goChattingScreen = () => {
    let c_id = '';
    chattingStateInfo.map(chattingState => {
      if (chattingState.c_p_id === product.p_id && chattingState.c_to_id === product.u_id) {
        c_id = chattingState.c_id;
      }
    });

    navigation.push('ChattingRoomScreen', {u_id: product.u_id, product});
  };

  return (
    <ScrollView>
      <View style={styles.head}>
        {/* <Pressable onPress={getPrevImage}>
            <Icon name="circle" size={12} />
          </Pressable> */}
        <Pressable style={styles.row} onPress={onPressImage}>
          <Image source={product.p_images.length > 0 ? {uri: product.p_images[imageIndex].p_url} : require('../../assets/user.png')} style={styles.image} resizeMethod="resize" resizeMode="cover" />
        </Pressable>
        {/* <Pressable onPress={getNextImage}>
            <Text style={styles.text}>{'>'}</Text>
          </Pressable> */}
        {/* <Slideshow dataSource={<Image source={product.p_images.length > 0 ? {uri: product.p_images[imageIndex].p_url} : require('../../assets/user.png')} style={styles.image} resizeMethod="resize" resizeMode="cover" />} /> */}
      </View>
      <View style={styles.profile2}>
        <Pressable
          style={styles.profile}
          onPress={() => {
            navigation.push('UserHomeScreen', {u_id: product.u_id});
          }}>
          <Avatar style={styles.avatar} source={user?.u_photoUrl ? {uri: user?.u_photoUrl} : require('../../assets/user.png')} />
          <Text style={styles.nickname}>{user?.u_nickname}</Text>
        </Pressable>
        <Text style={[styles.text, styles.hour]}>
          {moment(product.p_regdate).format('YYYY-MM-DD hh:mm:ss')} ({moment(product.p_regdate).fromNow()})
        </Text>
      </View>
      <View style={styles.paddingBlock}>
        <View style={styles.row}>
          <Text style={styles.tag_soldout}>거래완료</Text>
          <Text style={styles.p_title}>{product.p_title}knk 아워홈 식권 20매</Text>
        </View>
      </View>
      <View style={styles.row2}>
        <Text style={styles.p_price}>{product.p_contents}원하시는 장소로 가져가겠습니다.</Text>
      </View>
      <View style={styles.iconBox}>
        <Icon name="chat" color="#898989" size={16} />
        <Text style={styles.p_price}>{product.p_chat}</Text>
        <Icon name="remove-red-eye" color="#898989" size={16} />
        <Text style={styles.p_price}>{product.p_view}</Text>
      </View>
      <View style={styles.borderTop}>
        <View style={styles.head2}>
          <View style={styles.row}>
            <Text style={styles.text2}>{product.p_badatype} 바다</Text>
            <Text style={styles.bold}>{product.p_price}50,000원</Text>
          </View>
          <View style={styles.buttons}>
            <DabadaButton theme={'primary'} hasMarginBottom={false} title="채팅하기" onPress={goChattingScreen} />
          </View>
        </View>
      </View>

      {/* {myInfo.u_id !== product.u_id && (
        <View style={styles.buttons}>
          <DabadaButton hasMarginBottom={false} title="채팅하기" onPress={goChattingScreen} />
        </View>
      )} */}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  paddingBlock: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  flex1: {
    // flex: 1,
    width: '100%',
    flexDirection: 'row',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // marginHorizontal: 12
    // flex: 1,
    // display: 'flex',
    // textAlign: 'center',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  row3: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    // marginHorizontal: 12
    // flex: 1,
    // display: 'flex',
    // textAlign: 'center',
    borderTopColor: '#dfdfdf',
    borderTopWidth: 1,
  },
  p_title: {
    // lineHeight: 26,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#606060',
    marginLeft: 6,
    // marginBottom: 15,
  },
  p_badatype: {
    lineHeight: 16,
    fontSize: 10,
    fontWeight: 'bold',
  },
  p_price: {
    lineHeight: 17,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 3,
    color: '#898989',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: '100%',
    aspectRatio: 1,
    // marginBottom: 6,
    borderRadius: 6,
  },
  // text: {fontSize: 14, color: '#606060'},
  text2: {fontSize: 14, color: '#606060', paddingRight: 4},
  // button: {padding: 10},
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  buttons: {
    // margin: 30,
    marginRight: -16,
    padding: 12,
    width: 100,
    fontSize: 10,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingTop: 14,
    marginRight: 16,
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
  },
  head2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    // marginVertical: 8,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: '#dfdfdf',
  },
  profile2: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginHorizontal: 8,
    // marginVertical:
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    // borderWidth: 1,
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 14,
    // flex: 1,
  },
  bold: {fontSize: 18, fontWeight: 'bold', color: '#606060'},
  hour: {
    paddingRight: 16,
  },
  nickname: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  text: {
    color: '#606060',
    fontSize: 12,
    // lineHeight: 18,
  },
  tag_soldout: {
    color: '#ffffff',
    backgroundColor: '#898989',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#808080',
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#808080',
    fontSize: 12,
    height: 24,
    // marginTop: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tag_reserve: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderBottomColor: '#000',
    borderTopColor: '#000',
    fontSize: 12,
    height: 26,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});

export default Product;
