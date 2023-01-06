import firestore from '@react-native-firebase/firestore';
export const productCollection = firestore().collection('product');
export const PAGE_SIZE = 12;
import moment from 'moment';
import 'moment/locale/ko';

export interface productImageProps {
  pi_id: string;
  p_url: string;
}
export interface productBuyReviewProps {
  p_buyer_star: string;
  p_buyer_note: string;
}
export interface productSellReviewProps {
  p_seller_star: string;
  p_seller_note: string;
}

export interface productProps {
  p_id: string;
  u_id: string;
  p_title: string;
  p_badatype: 'free' | 'money' | 'drink' | 'secret';
  p_price: string;
  p_contents: string;
  p_status: number; // 1:판매중, 2:예약중, 3:판매완료, 4:판매중지
  p_regdate: string;
  p_like: number;
  p_chat: number;
  p_buyer_id: string;
  p_category: number; // 1 고정값(카테고리 기능 추후 구현)
  p_view: number;
  p_images: productImageProps[];
  p_buyer_review: productBuyReviewProps;
  p_seller_review: productSellReviewProps;
  p_buy_regdate: string;
}

// 상품 리스트 조회 type
export interface getProductsProps {
  u_id?: string;
  p_id?: string;
  cursormode?: 'older' | 'newer' | '';
  querymode?: '' | 'sell' | 'buy' | 'sell_complete';
  keyword?: string;
}

export const getProductsDefault: getProductsProps = {
  u_id: '',
  p_id: '',
  cursormode: '',
  querymode: '',
};

export async function getProducts({u_id, p_id, cursormode, querymode, keyword}: getProductsProps = getProductsDefault): Promise<productProps[]> {
  console.log('getProduct :: ', u_id, p_id, cursormode, querymode, keyword);
  let query = productCollection.orderBy('p_regdate', 'desc').limit(PAGE_SIZE);

  if (querymode === 'buy') {
    query = query.where('p_buyer_id', '==', u_id);
  } else if (querymode === 'sell') {
    if (u_id) {
      query = query.where('u_id', '==', u_id).where('p_status', 'in', [1, 2]);
    }
  } else if (querymode === 'sell_complete') {
    if (u_id) {
      query = query.where('u_id', '==', u_id).where('p_status', 'in', [3, 4]);
    }
  } else {
    query = query.where('p_status', 'in', [1, 2, 3]);
  }
  if (keyword) {
    query = query.startAt(keyword).endAt(keyword + '\uf8ff');
  }

  if (p_id) {
    const cursorDoc = await productCollection.doc(p_id).get();
    query = cursormode === 'older' ? query.startAfter(cursorDoc) : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();
  const products: any = snapshot.docs.map(doc => ({
    ...doc.data(),
    p_regdate: moment(doc.data().p_regdate.toDate()).format('YYYY-MM-DD hh:mm:ss'),
  }));

  return products;
}

export async function getProductCnt({u_id, querymode}: getProductsProps = getProductsDefault): Promise<number> {
  let query = null;

  if (querymode === 'buy') {
    query = productCollection.where('p_buyer_id', '==', u_id);
  } else if (querymode === 'sell') {
    if (u_id) {
      query = productCollection.where('u_id', '==', u_id).where('p_status', 'in', [1, 2]);
    }
  } else if (querymode === 'sell_complete') {
    if (u_id) {
      query = productCollection.where('u_id', '==', u_id).where('p_status', 'in', [3, 4]);
    }
  } else {
    query = productCollection.where('p_status', 'in', [1, 2, 3]);
  }

  if (query !== null) {
    const snapshot = await query.get();
    return snapshot.size;
  } else {
    return 0;
  }
}

// 상품 등록
export function createProduct(product: productProps) {
  return productCollection.doc(product.p_id).set({...product, p_regdate: firestore.FieldValue.serverTimestamp()});
}

// 상품 상세 정보
export async function getProductInfo(p_id: string): Promise<any> {
  const doc = await productCollection.doc(p_id).get();
  return doc.data();
}
// 상품 삭제
export function removeProduct(p_id: string) {
  return productCollection.doc(p_id).delete();
}
