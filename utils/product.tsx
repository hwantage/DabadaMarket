import firestore from '@react-native-firebase/firestore';

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
}

export interface productImageProps {
  pi_id: string;
  p_id: string;
  p_url: string;
}

// 상품
export const productCollection = firestore().collection('product');

export function createProduct(product: productProps) {
  return productCollection.doc(product.p_id).set({...product, p_regdate: firestore.FieldValue.serverTimestamp()});
}

export async function getProductInfo(p_id: string): Promise<any> {
  const doc = await productCollection.doc(p_id).get();
  return doc.data();
}

// 상품 이미지
export const productImageCollection = firestore().collection('productImage');

export function createProductImage(p_id: string, productImage: productImageProps[]) {
  return productImageCollection.doc(p_id).set({productImage});
}
