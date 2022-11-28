import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Image, Pressable, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {productProps} from '../../utils/products';
import DabadaButton from '../common/DabadaButton';
import Avatar from '../profile/Avatar';
import {getUserInfo} from '../../utils/auth';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import {useRecoilValue} from 'recoil';
import {chattingInfoState} from '../../recoil/chattingAtom';

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

    navigation.push('ChattingRoomScreen', {u_id: product.u_id, p_id: product.p_id, c_id, p_title: product.p_title});
  };

  return (
    <ScrollView>
      <View style={styles.block}>
        <View style={[styles.head, styles.paddingBlock]}>
          <Pressable onPress={getPrevImage}>
            <Text style={styles.text}>{'<'}</Text>
          </Pressable>
          <Pressable style={styles.row} onPress={onPressImage}>
            <Image source={product.p_images.length > 0 ? {uri: product.p_images[imageIndex].p_url} : require('../../assets/user.png')} style={styles.image} resizeMethod="resize" resizeMode="cover" />
          </Pressable>
          <Pressable onPress={getNextImage}>
            <Text style={styles.text}>{'>'}</Text>
          </Pressable>
        </View>
        <View style={[styles.head, styles.paddingBlock]}>
          <Pressable
            style={styles.profile}
            onPress={() => {
              navigation.push('UserHomeScreen', {u_id: product.u_id});
            }}>
            <Avatar source={user?.u_photoUrl ? {uri: user?.u_photoUrl} : require('../../assets/user.png')} />
            <Text style={styles.nickname}>{user?.u_nickname}</Text>
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={() => {
              navigation.push('UserHomeScreen', {u_id: product.u_id});
            }}>
            <Icon name="keyboard-arrow-right" size={20} />
          </Pressable>
        </View>
        <View style={styles.paddingBlock}>
          <Text style={styles.p_title}>{product.p_title}</Text>
          <View style={styles.row}>
            <Text style={styles.p_badatype}>{product.p_badatype}</Text>
            <Text style={styles.p_price}>{product.p_price}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="recommend" color="#347deb" size={14} />
            <Text style={styles.p_price}>{product.p_like}</Text>
            <Icon name="chat" color="#347deb" size={14} />
            <Text style={styles.p_price}>{product.p_chat}</Text>
            <Icon name="touch-app" color="#347deb" size={14} />
            <Text style={styles.p_price}>{product.p_view}</Text>
          </View>
          <Text style={styles.p_price}>{product.p_contents}</Text>
        </View>
        {myInfo.u_id !== product.u_id && (
          <View style={styles.buttons}>
            <DabadaButton hasMarginBottom={true} title="채팅으로 거래하기" onPress={goChattingScreen} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 10,
    marginLeft: 10,
  },
  paddingBlock: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  p_title: {
    lineHeight: 26,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  p_badatype: {
    lineHeight: 16,
    fontSize: 10,
    fontWeight: 'bold',
  },
  p_price: {
    lineHeight: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: '100%',
    aspectRatio: 1,
    marginBottom: 6,
    borderRadius: 5,
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  buttons: {
    margin: 24,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nickname: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  text: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default Product;
