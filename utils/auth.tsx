/* 로그인, 회원가입, 정보 갱신, 로그 아웃 */
import auth from '@react-native-firebase/auth';
import {authInfoProps} from '../recoil/authInfoAtom';
// 로그인 처리
export function login(email: string, password: string) {
  return auth().signInWithEmailAndPassword(email, password);
}
// 가입 처리
export function join(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}
// 인증 정보 확인
export function subscribeAuth(callback: any) {
  return auth().onAuthStateChanged(callback);
}
// 로그아웃
export function logout() {
  return auth().signOut();
}

/* 사용자 정보 */
import firestore from '@react-native-firebase/firestore';
export const usersCollection = firestore().collection('users');
// 사용자 정보 생성 / 업데이트
export function createUser({u_id, u_nickname, u_photoUrl, u_group, u_lang}: authInfoProps) {
  return usersCollection.doc(u_id).set({
    u_id,
    u_nickname,
    u_photoUrl,
    u_group,
    u_lang,
  });
}
// 사용자 정보 조회
export async function getUserInfo(u_id: string): Promise<any> {
  const doc = await usersCollection.doc(u_id).get();
  return doc.data();
}
