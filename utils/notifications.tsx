/* 알림 키워드 저장 */
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

// 알림 키워드 등록
export function createNotificationKeyword(u_id: string, notifications: notificationKeywordProps) {
  return notificationCollection.doc(u_id).set(notifications);
}

// 알림 키워드 조회
export async function getNotificationKeyword(u_id: string): Promise<notificationKeywordProps> {
  let query = notificationCollection.doc(u_id);
  const snapshot = await query.get();
  const notifications: any = snapshot.data();
  return notifications;
}

// 알림 키워드 리셋(삭제)
export function resetNotificationKeyword(u_id: string) {
  return notificationCollection.doc(u_id).delete();
}
