import firestore from '@react-native-firebase/firestore';
export const chattingCollection = firestore().collection('chatting');

export interface chattingProps {
  c_id: string;
  c_from_photoUrl: string | {} | null;
  c_from_nickname: string;
  c_from_id: string;
  c_to_photoUrl: string | {} | null;
  c_to_nickname: string;
  c_to_id: string;
  c_p_id: string;
  c_lastMessage: string;
  c_regdate: number;
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
export async function compareDiffChattingDate(c_id: string, c_regdate: number) {
  console.log(c_id);
  const doc = await chattingCollection.doc(c_id).get();
  const chattingData = doc.data();
  if (!chattingData) {
    return false;
  }
  return c_regdate !== chattingData.c_regdate;
}

export async function getChattingData(c_id: string) {
  const doc = await chattingCollection.doc(c_id).get();
  const chattingData = await doc.data();

  return chattingData;
}
// 채팅 룸 생성
export function createChatting(chatting: chattingProps) {
  return chattingCollection.doc(chatting.c_id).set({...chatting});
}

export function updateChatting(c_id: string, text: string, updatedDate: number) {
  return chattingCollection.doc(c_id).update({c_lastMessage: text, c_regdate: updatedDate});
}
