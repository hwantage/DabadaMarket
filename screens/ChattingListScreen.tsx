import React, {useEffect, useState} from 'react';
import {StyleSheet, FlatList, Text, ListRenderItem} from 'react-native';
import ChattingCard from '../components/chatting/ChattingCard';
import {authInfoState} from '../recoil/authInfoAtom';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {chattingProps, getChatting} from '../utils/chatting';
import firestore from '@react-native-firebase/firestore';
import {chattingNotificationCntState} from '../recoil/chattingAtom';

const chattingCollection = firestore().collection('chatting');
function ChattingListScreen() {
  const [myInfo] = useRecoilState(authInfoState);
  const setChattingNotificationCnt = useSetRecoilState(chattingNotificationCntState);

  const [chatting, setChatting] = useState<chattingProps[]>([]);
  const chattingReady = chatting !== undefined;

  useEffect(() => {
    const unsubscribe = chattingCollection.onSnapshot(
      querySnapshot => {
        let isChanged = false;
        querySnapshot.docChanges().forEach(change => {
          // if (change.type === 'added') {
          // }
          // if (change.type === 'removed') {
          // }
          if (change.type === 'modified') {
            isChanged = true;
          }
        });
        if (isChanged) {
          getChatting(myInfo.u_id).then(_chatting => {
            let cnt = 0;
            _chatting.map(chattingInfo => {
              if (myInfo.u_id === chattingInfo.c_from_id) {
                cnt += chattingInfo.c_from_not_read_cnt ? chattingInfo.c_from_not_read_cnt : 0;
              } else {
                cnt += chattingInfo.c_to_not_read_cnt ? chattingInfo.c_to_not_read_cnt : 0;
              }
            });
            if (cnt > 0) {
              setChattingNotificationCnt(cnt);
            }
            setChatting(_chatting);
          });
        }
      },
      err => {
        console.log(`Encountered error: ${err}`);
      },
    );
    getChatting(myInfo.u_id).then(_chatting => {
      setChatting(_chatting);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const renderEmpty = () => {
    return (
      <>
        <Text>채팅이 없습니다.</Text>
      </>
    );
  };
  const renderItem: ListRenderItem<chattingProps> = ({item}) => {
    return chattingReady ? <ChattingCard chatInfo={item} /> : <></>;
  };
  return <FlatList<chattingProps> data={chatting} renderItem={renderItem} ListEmptyComponent={renderEmpty} keyExtractor={item => item.c_id} contentContainerStyle={styles.container} onEndReachedThreshold={0.75} />;
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
});

export default ChattingListScreen;
