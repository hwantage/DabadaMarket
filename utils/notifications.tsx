/* 최근 검색어 저장 */
import firestore from '@react-native-firebase/firestore';

export const notificationCollection = firestore().collection('notification');

export interface notificationKeywordProps {
  notifications: [
    {
      n_id: string;
      n_word: string;
    },
  ];
}

export function createNotificationKeyword(u_id: string, notifications: notificationKeywordProps) {
  console.log('createNotificationKeyword :: ', u_id, notifications);
  return notificationCollection.doc(u_id).set(notifications);
}

export async function getNotificationKeyword(u_id: string): Promise<notificationKeywordProps> {
  let query = notificationCollection.doc(u_id);
  const snapshot = await query.get();
  const notifications: any = snapshot.data();
  return notifications;
}

export function resetNotificationKeyword(u_id: string) {
  return notificationCollection.doc(u_id).delete();
}
