import {useEffect, useState} from 'react';
import {chattingProps, getChatting} from '../utils/chatting';

export default function useChatting(u_id: string) {
  const [chatting, setChatting] = useState<chattingProps[] | undefined>([]);
  //const [noMoreProduct, setNoMoreProduct] = useState<boolean>(false);
  //const [refreshing, setRefreshing] = useState<boolean>(false);
  //const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    //console.log('useeffect of useChatting');
    getChatting(u_id).then(_chatting => {
      setChatting(_chatting);
    });
  }, [u_id]);

  // const removeProduct = useCallback(
  //   (p_id: string) => {
  //     setProducts(products?.filter(p => p.p_id !== p_id));
  //   },
  //   [products],
  // );

  // const updateProduct = useCallback(
  //   (p_id: string, productInfo: productProps) => {
  //     // id가 일치하는 상품 찾아서 내용 변경
  //     const nextProducts = products?.map((p: productProps) =>
  //       p.p_id === p_id
  //         ? {
  //             ...p,
  //             productInfo,
  //           }
  //         : p,
  //     );
  //     setProducts(nextProducts);
  //   },
  //   [products],
  // );

  // const onLoadMore = async () => {
  //   if (noMoreProduct || !products || products.length < PAGE_SIZE) {
  //     return;
  //   }
  //   const lastProduct = products[products.length - 1];
  //   const olderProduct = await getProducts({p_id: lastProduct.p_id, cursormode: 'older', u_id: u_id, querymode: querymode});
  //   if (olderProduct.length < PAGE_SIZE) {
  //     setNoMoreProduct(true);
  //   }
  //   setProducts(products.concat(olderProduct));
  // };

  // const onRefresh = useCallback(async () => {
  //   if (!products || products.length === 0 || refreshing) {
  //     return;
  //   }
  //   const firstProduct = products[0];
  //   setRefreshing(true);
  //   const newerProduct = await getProducts({p_id: firstProduct.p_id, cursormode: 'newer', u_id: u_id, querymode: querymode});
  //   setRefreshing(false);
  //   if (newerProduct.length === 0) {
  //     return;
  //   }
  //   setProducts(newerProduct.concat(products));
  // }, [products, refreshing, u_id, querymode]);

  // useProductsEventEffect({
  //   refresh: onRefresh,
  //   removeProduct,
  //   updateProduct,
  //   enabled: !u_id || u_id === authInfo.u_id,
  // });

  return {
    ...chatting,
  };
}
