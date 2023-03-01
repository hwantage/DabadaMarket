import firestore from '@react-native-firebase/firestore';
export const informationCollection = firestore().collection('information');
export const commentCollection = firestore().collection('informationComment');
export const PAGE_SIZE = 12;

export interface informationImageProps {
  ii_id: string;
  ii_url: string;
}
export interface informationProps {
  i_group: string;
  i_category: number; // 1 : 정보, 2 : 질문, 3 : 일상 생활, 4 : 넋두리
  i_id: string;
  u_id: string;
  i_nickname: string;
  i_contents: string;
  i_images: informationImageProps[];
  i_view: number;
  i_like: number;
  i_regdate: string;
  i_comment_cnt: number;
}
export const informationPropsDefault: informationProps = {
  i_group: 'somansa',
  i_category: 1,
  i_id: '',
  u_id: '',
  i_nickname: '',
  i_contents: '',
  i_images: [],
  i_view: 0,
  i_like: 0,
  i_regdate: '',
  i_comment_cnt: 0,
};
export interface commentProps {
  ic_id: string;
  i_id: string;
  u_id: string;
  u_nickname: string;
  u_photoUrl: string | {} | null;
  ic_contents: string;
  ic_like: number;
  ic_regdate: string;
}
export const commentPropsDefault: commentProps = {
  ic_id: '',
  i_id: '',
  u_id: '',
  u_nickname: '',
  u_photoUrl: '',
  ic_contents: '',
  ic_like: 0,
  ic_regdate: '',
};

// 정보 리스트 조회 type
export interface getInformationProps {
  i_group?: string;
  i_id?: string;
  u_id?: string;
  cursormode?: 'older' | 'newer' | '';
}

export const getInformationDefault: getInformationProps = {
  i_group: 'somansa',
  u_id: '',
  i_id: '',
  cursormode: '',
};

// 정보 리스트 조회
export async function getInformations({i_group, u_id, i_id, cursormode}: getInformationProps = getInformationDefault): Promise<informationProps[]> {
  console.log('getInformations :: ', i_group, u_id, i_id, cursormode);
  let query = informationCollection.orderBy('i_regdate', 'desc').limit(PAGE_SIZE);
  query = query.where('i_group', 'in', [i_group, '']);

  if (i_id) {
    const cursorDoc = await informationCollection.doc(i_id).get();
    query = cursormode === 'older' ? query.startAfter(cursorDoc) : query.endBefore(cursorDoc);
  }
  const snapshot = await query.get();

  const informations: any = snapshot.docs.map(doc => ({
    ...doc.data(),
  }));
  return informations;
}

// 정보 등록
export function createInformation(information: informationProps) {
  console.log('createInformation :: ', information);
  return informationCollection.doc(information.i_id).set(information);
}

// 정보 조회 (i_id 로 개별 조회)
export async function getInformationInfo(i_id: string): Promise<any> {
  const doc = await informationCollection.doc(i_id).get();
  return doc.data();
}

// 코멘트 전체 삭제
const deleteAllComments = async (collectionName: string, fieldName: string, value: string) => {
  const db = firestore();
  const collectionRef = db.collection(collectionName);
  const querySnapshot = await collectionRef.where(fieldName, '==', value).get();
  const batch = db.batch();
  querySnapshot.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

// 정보 삭제
export function removeInformation(i_id: string) {
  deleteAllComments('informationComment', 'i_id', i_id);
  return informationCollection.doc(i_id).delete();
}

// 정보 수정 (전체)
export function updateInformation(i_id: string, information: informationProps) {
  console.log('updateInformation', i_id, information);
  return informationCollection.doc(i_id).set(information);
}

// 정보 수정 (특정 필드)
export function updateInformationField(i_id: string, fieldName: string, fieldValue: any) {
  console.log('updateInformationField', i_id, fieldName, fieldValue);
  return informationCollection.doc(i_id).update({
    [fieldName]: fieldValue,
  });
}

// 댓글 목록 조회
export async function getComments(i_id: string): Promise<commentProps[]> {
  console.log('getComments :: ', i_id);
  let query = commentCollection.orderBy('ic_regdate', 'asc').where('i_id', '==', i_id);
  const snapshot = await query.get();
  const comments: any = snapshot.docs.map(doc => ({
    ...doc.data(),
  }));
  return comments;
}

// 댓글 등록
export function createComment(comment: commentProps) {
  console.log('createComment :: ', comment);
  return commentCollection.doc(comment.ic_id).set(comment);
}

// 댓글 삭제
export function removeComment(ic_id: string) {
  return commentCollection.doc(ic_id).delete();
}

// 댓글 수정 (전체)
export function updateComment(ic_id: string, comment: commentProps) {
  console.log('updateComment', ic_id, comment);
  return commentCollection.doc(ic_id).set(comment);
}

// 댓글 수정 (특정 필드)
export function updateCommentField(ic_id: string, fieldName: string, fieldValue: any) {
  console.log('updateCommentField', ic_id, fieldName, fieldValue);
  return commentCollection.doc(ic_id).update({
    [fieldName]: fieldValue,
  });
}
