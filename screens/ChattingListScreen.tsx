import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, ListRenderItem, StyleSheet, Text} from 'react-native';
import TopRightButton from '../components/common/TopRightButton';
import ChattingCard from '../components/chatting/ChattingCard';
import {useRecoilState} from 'recoil';
import {authInfoState} from '../recoil/authInfoAtom';
import {chattingProps, getChatting} from '../utils/chatting';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

const chattingCollection = firestore().collection('chatting');
function ChattingListScreen() {
  const [myInfo] = useRecoilState(authInfoState);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [chatting, setChatting] = useState<chattingProps[]>([]);
  const chattingReady = chatting !== undefined;

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    console.log('myInfo', myInfo);
    // navigation.setOptions({
    //   headerRight: () => <TopRightButton name="search" onPress={() => navigation.push('SearchScreen')} />,
    // });

    const unsubscribe = chattingCollection.onSnapshot(
      querySnapshot => {
        let isChanged = false;
        querySnapshot.docChanges().forEach(change => {
          // if (change.type === 'added') {
          //   console.log('New city: ', change.doc.data());
          // }
          // if (change.type === 'removed') {
          //   console.log('Removed city: ', change.doc.data());
          // }
          if (change.type === 'modified') {
            isChanged = true;
            // const changedChattingData = change.doc.data();
            // console.log('Modified city: ', changedChattingData);
          }
        });
        if (isChanged) {
          getChatting(myInfo.u_id).then(_chatting => {
            console.log('getChat', _chatting);
            setChatting(_chatting);
          });
        }
      },
      err => {
        console.log(`Encountered error: ${err}`);
      },
    );
    getChatting(myInfo.u_id).then(_chatting => {
      console.log('getChat', _chatting);
      setChatting(_chatting);
    });
    // const unsubscribe = navigation.addListener('focus', () => {
    //   getChatting(myInfo.u_id).then(_chatting => {
    //     console.log('getChat', _chatting);
    //     setChatting(_chatting);
    //   });
    // });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, myInfo.u_id]);
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
  //const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  //const listRefreshControl = <RefreshControl colors={['#347deb']} />;

  return <FlatList<chattingProps> data={chatting} renderItem={renderItem} ListEmptyComponent={renderEmpty} keyExtractor={item => item.c_id} contentContainerStyle={styles.container} onEndReachedThreshold={0.75} />;
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
});

export default ChattingListScreen;
