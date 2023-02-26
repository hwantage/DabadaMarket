import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import TopRightButton from '../components/common/TopRightButton';
import Product from '../components/product/Product';
import {RootStackParamList} from './AppStack';
import useProductActions from '../hooks/useProductActions';
import ActionSheetModal from '../components/ActionSheetModal';
import {getProductInfo, productProps, productPropsDefault, updateProductField} from '../utils/products';
import events from '../utils/events';

type ProductDetailScreenProps = StackScreenProps<RootStackParamList, 'ProductDetailScreen'>;

function ProductDetailScreen({navigation, route}: ProductDetailScreenProps) {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const product = route.params.product;
  const [productInfo, setProductInfo] = useState<productProps>(productPropsDefault);
  const querymode = route.params.querymode;
  const {isSelecting, onPressMore, onClose, actions} = useProductActions(product.p_id, querymode);

  const initProduct = useCallback(async () => {
    await getProductInfo(product.p_id).then(_response => {
      setProductInfo(_response);
    });
  }, [product.p_id]);

  // 상품 상세 화면 포커스 될 때마다 새로 갱신
  useFocusEffect(
    useCallback(() => {
      initProduct();
    }, [initProduct]),
  );

  useEffect(() => {
    console.log('상품 상세 정보 조회');
    if (productInfo.p_id === '' && product.u_id !== authInfo.u_id) {
      updateProductField(product.p_id, 'p_view', product.p_view + 1); // p_view 조회수 카운터 증가 내역을 Firestore에 반영
      events.emit('updateProduct', product.p_id, {...product, p_view: product.p_view + 1});
    }
    authInfo.u_id === product.u_id &&
      navigation.setOptions({
        headerRight: () => <TopRightButton name="more-vert" onPress={onPressMore} />,
      });
  }, [authInfo.u_id, navigation, onPressMore, product, product.p_id, product.p_view, product.u_id, productInfo.p_id]);

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
