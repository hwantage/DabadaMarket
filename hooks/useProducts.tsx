import {useCallback, useEffect, useState} from 'react';
import {getProducts, getProductCnt, PAGE_SIZE} from '../utils/products';
import useProductsEventEffect from './useProductsEventEffect';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {productProps, getProductsProps} from '../utils/products';

export default function useProducts({u_id, querymode, keyword}: getProductsProps) {
  const [products, setProducts] = useState<productProps[] | undefined>(undefined);
  //const [productCnt, setProductCnt] = useState<productCntProps[]>([{querymode: '', cnt: 0}]);
  const [productCnt, setProductCnt] = useState<number>(0);
  const [productCnt_complete, setProductCnt_complete] = useState<number>(0);
  const [noMoreProduct, setNoMoreProduct] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    getProducts({u_id, querymode, keyword}).then(_products => {
      setProducts(_products);
      if (_products.length < PAGE_SIZE) {
        setNoMoreProduct(true);
      }
    });

    // sell | sell_complete 인 경우 갯수 조회
    if (querymode !== undefined && querymode !== 'buy') {
      getProductCnt({u_id, querymode, keyword}).then(_cnt => {
        if (querymode === 'sell') {
          setProductCnt(_cnt);
        } else if (querymode === 'sell_complete') {
          setProductCnt_complete(_cnt);
        }
      });
    }
  }, [keyword, querymode, u_id]);

  const decreaseCount = useCallback(
    (qmode: string | null) => {
      if (qmode === 'sell') {
        setProductCnt(productCnt - 1);
      } else if (qmode === 'sell_complete') {
        setProductCnt_complete(productCnt_complete - 1);
      }
    },
    [productCnt, productCnt_complete],
  );

  const removeProduct = useCallback(
    (p_id: string, qmode: string | null) => {
      setProducts(products?.filter(p => p.p_id !== p_id));
      decreaseCount(qmode);
    },
    [decreaseCount, products],
  );

  const updateProduct = useCallback(
    (p_id: string, productInfo: productProps) => {
      // id가 일치하는 상품 찾아서 내용 변경
      const nextProducts = products?.map((p: productProps) =>
        p.p_id === p_id
          ? {
              //...p,
              ...productInfo,
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
    const olderProduct = await getProducts({p_id: lastProduct.p_id, cursormode: 'older', u_id: u_id, querymode: querymode});
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
    const newerProduct = await getProducts({p_id: firstProduct.p_id, cursormode: 'newer', u_id: u_id, querymode: querymode});
    setRefreshing(false);
    if (newerProduct.length === 0) {
      return;
    }
    setProducts(newerProduct.concat(products));
  }, [products, refreshing, u_id, querymode]);

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
    productCnt,
    productCnt_complete,
  };
}
