import {useCallback, useEffect, useState} from 'react';
import {getNewerProducts, getOlderProducts, getProducts, PAGE_SIZE} from '../utils/products';
import useProductsEventEffect from './useProductsEventEffect';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {productProps} from '../utils/products';

export default function useProducts(u_id?: string) {
  const [products, setProducts] = useState<productProps[]>([
    {
      p_id: '',
      u_id: '',
      p_title: '',
      p_badatype: 'free',
      p_price: '',
      p_contents: '',
      p_status: 1, // 1:판매중, 2:예약중, 3:판매완료, 4:판매중지
      p_regdate: '',
      p_like: 0,
      p_chat: 0,
      p_buyer_id: '',
      p_category: 1, // 1 고정값(카테고리 기능 추후 구현)
      p_view: 0,
      p_images: [],
    },
  ]);
  const [noMoreProduct, setNoMoreProduct] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  console.log('useProducts.js', u_id);

  const removeProduct = useCallback(
    (p_id: string) => {
      setProducts(products.filter(p => p.p_id !== p_id));
    },
    [products],
  );

  const updateProduct = useCallback(
    (p_id: string, productInfo: productProps) => {
      // id가 일치하는 상품 찾아서 내용 변경
      const nextProducts = products.map((p: productProps) =>
        p.p_id === p_id
          ? {
              ...p,
              productInfo,
            }
          : p,
      );
      setProducts(nextProducts);
    },
    [products],
  );

  const onLoadMore = async () => {
    if (noMoreProduct || !products || products.length < PAGE_SIZE) {
      return;
    }
    const lastProduct = products[products.length - 1];
    const olderProduct = await getOlderProducts(lastProduct.p_id, u_id);
    if (olderProduct.length < PAGE_SIZE) {
      setNoMoreProduct(true);
    }
    setProducts(products.concat(olderProduct));
  };

  const onRefresh = useCallback(async () => {
    if (!products || products.length === 0 || refreshing) {
      return;
    }
    const firstProduct = products[0];
    setRefreshing(true);
    const newerProduct = await getNewerProducts(firstProduct.p_id, u_id);
    setRefreshing(false);
    if (newerProduct.length === 0) {
      return;
    }
    setProducts(newerProduct.concat(products));
  }, [products, u_id, refreshing]);

  useEffect(() => {
    getProducts({u_id}).then(_products => {
      setProducts(_products);
      if (_products.length < PAGE_SIZE) {
        setNoMoreProduct(true);
      }
    });
  }, [u_id]);

  useProductsEventEffect({
    refresh: onRefresh,
    removeProduct,
    updateProduct,
    enabled: !u_id || u_id === authInfo.u_id,
  });

  return {
    products,
    noMoreProduct,
    refreshing,
    onLoadMore,
    onRefresh,
  };
}
