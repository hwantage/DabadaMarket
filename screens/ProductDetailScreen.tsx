import React, {useEffect} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import TopRightButton from '../components/common/TopRightButton';
import Product from '../components/product/Product';
import {RootStackParamList} from './AppStack';

type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetailScreen'>;

function ProductDetailScreen({navigation, route}: ProductDetailScreenProps) {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const product = route.params;

  console.log('상세 제품 정보 :: ', product);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="more-vert" onPress={() => {}} />,
    });
  }, [navigation, authInfo]);

  return <Product product={product} />;
}

export default ProductDetailScreen;
