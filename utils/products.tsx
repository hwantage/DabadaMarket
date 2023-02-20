import firestore from '@react-native-firebase/firestore';
export const productCollection = firestore().collection('products');
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
  p_buyer_nickname: string;
  p_buyer_regdate: string;
}
export interface productSellReviewProps {
  p_seller_star: string;
  p_seller_note: string;
  p_seller_nickname: string;
  p_seller_regdate: string;
}

export interface productProps {
  p_id: string;
  u_id: string;
  p_title: string;
  p_badatype: 'free' | 'money' | 'drink' | 'secret';
  p_price: string;
  p_contents: string;
  p_status: number; // 1:판매중, 2:예약중, 3:거래완료, 4:판매중지
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
  p_keywords: string[];
}

export const productPropsDefault: productProps = {
  p_id: '',
  u_id: '',
  p_title: '',
  p_badatype: 'money', // 'free' | 'money' | 'drink' | 'secret';
  p_price: '',
  p_contents: '',
  p_status: 1, // 1:판매중, 2:예약중, 3:거래완료, 4:판매중지
  p_regdate: '',
  p_like: 0,
  p_chat: 0,
  p_buyer_id: '',
  p_category: 1, // 고정값(카테고리 기능 추후 구현)
  p_view: 0,
  p_images: [],
  p_buyer_review: {
    p_buyer_star: '',
    p_buyer_note: '',
    p_buyer_nickname: '',
    p_buyer_regdate: '',
  },
  p_seller_review: {
    p_seller_star: '',
    p_seller_note: '',
    p_seller_nickname: '',
    p_seller_regdate: '',
  },
  p_buy_regdate: '',
  p_keywords: [],
};

// 상품 리스트 조회 type
export interface getProductsProps {
  u_id?: string;
  p_id?: string;
  cursormode?: 'older' | 'newer' | '';
  querymode?: '' | 'sell' | 'buy' | 'sell_complete';
  keyword?: string | string[];
}

export const getProductsDefault: getProductsProps = {
  u_id: '',
  p_id: '',
  cursormode: '',
  querymode: '',
  keyword: '',
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
    //query = query.where('p_status', 'in', [1, 2, 3, 4]);
  }

  if (p_id) {
    const cursorDoc = await productCollection.doc(p_id).get();
    query = cursormode === 'older' ? query.startAfter(cursorDoc) : query.endBefore(cursorDoc);
  }
  const snapshot = keyword ? (Array.isArray(keyword) ? await query.where('p_keywords', 'array-contains-any', keyword).get() : await query.where('p_keywords', 'array-contains', keyword).get()) : await query.get();
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

// 상품 수정 (전체)
export function updateProduct(p_id: string, product: productProps) {
  return productCollection.doc(p_id).update({
    product,
  });
}

// 상품 수정
export function updateProductField(p_id: string, fieldName: string, fieldValue: any) {
  return productCollection.doc(p_id).update({
    [fieldName]: fieldValue,
  });
}

// 숫자 3자리 콤마. ₩ 100,000 형태로 리턴
export function comma(s: string | undefined) {
  if (s === undefined) {
    return '';
  }
  let str = String(s);
  return '₩ ' + str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 숫자만 추출
export function uncomma(s: string) {
  let str = String(s);
  return str.replace(/[^\d]+/g, '');
}
