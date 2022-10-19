import firestore from '@react-native-firebase/firestore';

export const PAGE_SIZE = 12;

export interface productImageProps {
  pi_id: string;
  p_url: string;
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
}

export const productCollection = firestore().collection('product');

// 상품 등록
export function createProduct(product: productProps) {
  return productCollection.doc(product.p_id).set({...product, p_regdate: firestore.FieldValue.serverTimestamp()});
}

// 상품 상세 정보
export async function getProductInfo(p_id: string): Promise<any> {
  const doc = await productCollection.doc(p_id).get();
  return doc.data();
}

// 상품 리스트
export async function getProducts({u_id, mode, p_id}: {u_id?: string; mode?: string; p_id?: string} = {u_id: '', mode: '', p_id: ''}): Promise<productProps[]> {
  console.log('getProduct :: ', u_id, mode, p_id);
  let query = productCollection.orderBy('p_regdate', 'desc').limit(PAGE_SIZE);
  if (u_id) {
    query = query.where('u_id', '==', u_id);
  }
  if (p_id) {
    const cursorDoc = await productCollection.doc(p_id).get();
    query = mode === 'older' ? query.startAfter(cursorDoc) : query.endBefore(cursorDoc);
  }

  const snapshot = await query.get();

  const products: any = snapshot.docs.map(doc => ({
    ...doc.data(),
  }));

  console.log(products);

  return products;
}

// 이전 목록 보기
export async function getOlderProducts(p_id: string, u_id?: string) {
  return getProducts({
    u_id,
    mode: 'older',
    p_id,
  });
}

// 최신 목록 보기
export async function getNewerProducts(p_id: string, u_id?: string) {
  return getProducts({
    u_id,
    mode: 'newer',
    p_id,
  });
}

// 상품 삭제
export function removePost(p_id: string) {
  return productCollection.doc(p_id).delete();
}
