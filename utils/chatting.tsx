import firestore from '@react-native-firebase/firestore';
import {productProps} from './products';
export const chattingCollection = firestore().collection('chatting');

export enum CHAT_PRODUCT_STATE {
  SELL = '판매중',
  RESERVATION = '예약중',
  COMPLETE = '거래완료',
}

export interface chattingProps {
  c_id: string;
  c_from_photoUrl: string | {} | null;
  c_from_nickname: string;
  c_from_id: string;
  c_to_photoUrl: string | {} | null;
  c_to_nickname: string;
  c_to_id: string;
  c_product: productProps;
  c_lastMessage: string;
  c_regdate: string;
  c_to_online: boolean;
  c_from_online: boolean;
  c_to_not_read_cnt: number;
  c_from_not_read_cnt: number;
  c_product_state: CHAT_PRODUCT_STATE;
}

export interface updateChattingProps {
  c_lastMessage?: string;
  c_regdate?: string;
  c_to_online?: boolean;
  c_from_online?: boolean;
  c_from_not_read_cnt?: number;
  c_to_not_read_cnt?: number;
  c_product?: productProps;
  c_product_state?: CHAT_PRODUCT_STATE;
}

export async function getChatting(u_id: string): Promise<chattingProps[]> {
  //console.log('getProduct :: ', u_id, p_id, cursormode, querymode, keyword);
  //  let query = chattingCollection.orderBy('regdate', 'desc');
  let query = chattingCollection;
  console.log(u_id);
  const query1 = query.where('c_from_id', '==', u_id).get();
  const query2 = query.where('c_to_id', '==', u_id).get();
  //const snapshot = await query.get();

  const [querySnapshot1, querySnapshot2] = await Promise.all([query1, query2]);

  const docArray1 = querySnapshot1.docs;
  const docArray2 = querySnapshot2.docs;

  const totalDocs = docArray1.concat(docArray2);

  const chatting: any = totalDocs.map(doc => ({
    ...doc.data(),
  }));

  return chatting;
}
//FirebaseFirestoreTypes.FieldValue
export async function compareDiffChattingDate(c_id: string, c_regdate: string) {
  console.log(c_id);
  const doc = await chattingCollection.doc(c_id).get();
  const chattingData = doc.data();
  if (!chattingData) {
    return false;
  }
  console.log('c_regdate', c_regdate);
  console.log('chattingData.c_regdate', chattingData.c_regdate);
  return c_regdate !== chattingData.c_regdate;
}

export async function getChattingData(c_id: string) {
  const doc = await chattingCollection.doc(c_id).get();
  const chattingData = await doc.data();

  return chattingData;
}
// 채팅 룸 생성
export function createChatting(chatting: chattingProps) {
  console.log('createChatting :: ', chatting);
  return chattingCollection.doc(chatting.c_id).set({...chatting});
}

export function updateChatting(c_id: string, updateObj: updateChattingProps) {
  console.log('update!!! ', updateObj);
  return chattingCollection.doc(c_id).update(updateObj);
}
