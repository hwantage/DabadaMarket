import React, {useEffect, useState} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import TopRightButton from '../components/common/TopRightButton';
import Product from '../components/product/Product';
import {RootStackParamList} from './AppStack';
import useProductActions from '../hooks/useProductActions';
import ActionSheetModal from '../components/ActionSheetModal';
import {getProductInfo, productProps, updateProductField} from '../utils/products';

type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetailScreen'>;

function ProductDetailScreen({navigation, route}: ProductDetailScreenProps) {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const product = route.params.product;
  const [productInfo, setProductInfo] = useState<productProps>();
  const querymode = route.params.querymode;
  const {isSelecting, onPressMore, onClose, actions} = useProductActions(product.p_id, querymode);

  const isMyProduct = authInfo.u_id === product.u_id;

  useEffect(() => {
    updateProductField(product.p_id, 'p_view', product.p_view); // p_view 조회수 카운터 증가 내역을 Firestore에 반영
    getProductInfo(product.p_id).then(_response => setProductInfo(_response));
    isMyProduct &&
      navigation.setOptions({
        headerRight: () => <TopRightButton name="more-vert" onPress={onPressMore} />,
      });
  }, [navigation, isMyProduct, onPressMore, product.p_id, product.p_view]);

  return (
    <>
      <Product product={productInfo} />
      <ActionSheetModal visible={isSelecting} actions={actions} onClose={onClose} />
    </>
  );
}

export default ProductDetailScreen;
