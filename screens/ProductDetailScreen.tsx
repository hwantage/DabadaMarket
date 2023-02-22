import React, {useCallback, useEffect, useState} from 'react';
import type {StackScreenProps} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import TopRightButton from '../components/common/TopRightButton';
import Product from '../components/product/Product';
import {RootStackParamList} from './AppStack';
import useProductActions from '../hooks/useProductActions';
import ActionSheetModal from '../components/ActionSheetModal';
import {getProductInfo, productProps, productPropsDefault, updateProduct} from '../utils/products';

type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetailScreen'>;

function ProductDetailScreen({navigation, route}: ProductDetailScreenProps) {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const product = route.params.product;
  const [productInfo, setProductInfo] = useState<productProps>(productPropsDefault);
  const querymode = route.params.querymode;
  const {isSelecting, onPressMore, onClose, actions} = useProductActions(product.p_id, querymode);

  const initProduct = useCallback(async () => {
    console.log('initProduct of ProductDetailScreen');
    await getProductInfo(product.p_id).then(_response => {
      console.log(_response);
      setProductInfo(_response);
    });
  }, [product.p_id]);

  useEffect(() => {
    console.log('useeffect of ProductDetailScreen');
    if (productInfo.p_id === '') {
      console.log('ProductDetailScreen : try updateProductField');
      //updateProductField(product.p_id, 'p_view', product.p_view); // p_view 조회수 카운터 증가 내역을 Firestore에 반영
      updateProduct(product.p_id, {...product, p_view: product.p_view});
      initProduct();
    }
    authInfo.u_id === product.u_id &&
      navigation.setOptions({
        headerRight: () => <TopRightButton name="more-vert" onPress={onPressMore} />,
      });
  }, [authInfo.u_id, initProduct, navigation, onPressMore, product, product.p_id, product.p_view, product.u_id, productInfo.p_id]);

  return (
    <>
      {productInfo.p_id !== '' && (
        <>
          <Product product={productInfo} />
          <ActionSheetModal visible={isSelecting} actions={actions} onClose={onClose} />
        </>
      )}
    </>
  );
}

export default ProductDetailScreen;
