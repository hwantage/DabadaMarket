import React, {useMemo} from 'react';
import {View, StyleSheet, Image, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {productProps} from '../../utils/products';

interface ProductCardProps {
  product: productProps;
}

function ProductCard({product}: ProductCardProps) {
  const date = useMemo(() => (product.p_regdate ? new Date(product.p_regdate) : new Date()), [product.p_regdate]);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const onPress = () => {
    navigation.navigate('ProductDetailScreen');
  };

  return (
    <>
      <View style={styles.block}>
        <Pressable style={styles.row} onPress={onPress}>
          <Image source={product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../../assets/user.png')} style={styles.image} resizeMethod="resize" resizeMode="cover" />
          <View style={styles.paddingBlock}>
            <Text style={styles.p_title}>{product.p_title}</Text>
            <View style={styles.row}>
              <Text style={styles.p_badatype}>{product.p_badatype}</Text>
              <Text style={styles.p_price}>{product.p_price}</Text>
            </View>
            <Text style={styles.p_regdate}>{date.toLocaleString()}</Text>
            <View style={styles.row}>
              <Icon name="recommend" color="#347deb" size={14} />
              <Text style={styles.p_price}>{product.p_like}</Text>
              <Icon name="chat" color="#347deb" size={14} />
              <Text style={styles.p_price}>{product.p_chat}</Text>
              <Icon name="touch-app" color="#347deb" size={14} />
              <Text style={styles.p_price}>{product.p_view}</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </>
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
    width: 100,
    aspectRatio: 1,
    marginBottom: 6,
    borderRadius: 10,
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default ProductCard;
