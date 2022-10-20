/* 로그인, 회원가입, 정보 갱신, 로그 아웃 */
import auth from '@react-native-firebase/auth';
import {authInfoProps} from '../recoil/authInfoAtom';

export function login(email: string, password: string) {
  console.log(email, password);
  return auth().signInWithEmailAndPassword(email, password);
}

export function join(email: string, password: string) {
  return auth().createUserWithEmailAndPassword(email, password);
}

export function subscribeAuth(callback: any) {
  return auth().onAuthStateChanged(callback);
}

export function logout() {
  return auth().signOut();
}

/* 사용자 정보 */
import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('users');

export function createUser({u_id, u_nickname, u_photoUrl, u_group, u_lang}: authInfoProps) {
  return usersCollection.doc(u_id).set({
    u_id,
    u_nickname,
    u_photoUrl,
    u_group,
    u_lang,
  });
}

export async function getUserInfo(u_id: string): Promise<any> {
  const doc = await usersCollection.doc(u_id).get();
  return doc.data();
}
