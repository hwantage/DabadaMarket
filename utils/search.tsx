/* 최근 검색어 저장 */
import firestore from '@react-native-firebase/firestore';

export const searchCollection = firestore().collection('searchRecent');

export interface searchProps {
  keywords:
    | [
        {
          k_id: string;
          u_id?: string;
          k_word: string;
        },
      ];
}

export function createSearchRecent(u_id: string, recentSearchs: searchProps) {
  return searchCollection.doc(u_id).set(recentSearchs);
}

export async function getSearchRecent(u_id: string): Promise<searchProps> {
  let query = searchCollection.doc(u_id);
  const snapshot = await query.get();
  const searchs: any = snapshot.data();
  return searchs;
}
