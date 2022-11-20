import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {FlatList, ListRenderItem, RefreshControl, StyleSheet} from 'react-native';
import TopRightButton from '../components/common/TopRightButton';
import ChattingCard from '../components/chatting/ChattingCard';
import {useRecoilState} from 'recoil';
import {authInfoState} from '../recoil/authInfoAtom';
import {chattingProps, getChatting} from '../utils/chatting';
import {StackNavigationProp} from '@react-navigation/stack';

function ChattingListScreen() {
  const [myInfo] = useRecoilState(authInfoState);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [chatting, setChatting] = useState<chattingProps[]>([]);
  const chattingReady = chatting !== undefined;
  console.log(chatting);
  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="search" onPress={() => navigation.push('SearchScreen')} />,
    });
    const unsubscribe = navigation.addListener('focus', () => {
      getChatting(myInfo.u_id).then(_chatting => {
        console.log('getChat', _chatting);
        setChatting(_chatting);
      });
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, myInfo.u_id]);

  const renderItem: ListRenderItem<chattingProps> = ({item}) => {
    return chattingReady ? <ChattingCard chatInfo={item} /> : <></>;
  };
  //const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl = <RefreshControl colors={['#347deb']} />;

  return <FlatList<chattingProps> data={chatting} renderItem={renderItem} keyExtractor={item => item.c_id} contentContainerStyle={styles.container} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} />;
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
