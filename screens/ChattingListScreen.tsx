import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, SafeAreaView, FlatList, Text, TouchableOpacity, ScrollView} from 'react-native';
import Avatar from '../components/profile/Avatar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TopRightButton from '../components/common/TopRightButton';
import ChattingCard from '../components/chatting/ChattingCard';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {useRecoilState} from 'recoil';
import {chattingProps, getChatting} from '../utils/chatting';
import {StackNavigationProp} from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import {chattingInfoState, chattingNotificationCntState} from '../recoil/chattingAtom';
dayjs.locale('ko');
const chattingCollection = firestore().collection('chatting');
function ChattingListScreen() {
  const [myInfo] = useRecoilState(authInfoState);
  const navigation = useNavigation<StackNavigationProp<any>>();
  // const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  const [chatting, setChatting] = useState<chattingProps[]>([]);
  const chattingReady = chatting !== undefined;

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    // let clock = new clockSync({});
    // console.log('current Time', clock.getTime());
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
            let cnt = 0;
            _chatting.map(chattingInfo => {
              if (myInfo.u_id === chattingInfo.c_from_id) {
                cnt += chattingInfo.c_from_not_read_cnt ? chattingInfo.c_from_not_read_cnt : 0;
              } else {
                cnt += chattingInfo.c_to_not_read_cnt ? chattingInfo.c_to_not_read_cnt : 0;
              }
            });
            console.log('cnt', cnt);
            if (cnt > 0) {
              setChattingNotificationCnt(cnt);
            }
            console.log('current_chatting ', _chatting);
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

  // 주임님 소스
  return <FlatList<chattingProps> data={chatting} renderItem={renderItem} ListEmptyComponent={renderEmpty} keyExtractor={item => item.c_id} contentContainerStyle={styles.container} onEndReachedThreshold={0.75} />;

  // 임시 소스
  // return (
  //   <>
  //     <ScrollView style={styles.fullscreen}>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           {/* <Profile profileUser={myInfo} /> */}
  //           <Avatar size={48} />
  //           {/* <Text>111</Text> */}
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>hwan77</Text>
  //             <Text style={styles.bold4}>1시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>좋은 거래였습니다 감사합니다^^</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>hkChoi</Text>
  //             <Text style={styles.bold4}>2시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>네고는 안됩니다 ^^;</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>heeCastle</Text>
  //             <Text style={styles.bold4}>5시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>좋은 주말 보내세요~</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>badasea</Text>
  //             <Text style={styles.bold4}>어제</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>이모티콘을 보냈어요.</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>badasea</Text>
  //             <Text style={styles.bold4}>5시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>좋은 주말 보내세요~</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>badasea</Text>
  //             <Text style={styles.bold4}>5시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>좋은 주말 보내세요~</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>badasea</Text>
  //             <Text style={styles.bold4}>5시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>좋은 주말 보내세요~</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //       <TouchableOpacity style={styles.touchFlex}>
  //         <View style={styles.flex2}>
  //           <Avatar size={48} />
  //         </View>
  //         <View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold3}>badasea</Text>
  //             <Text style={styles.bold4}>5시간 전</Text>
  //           </View>
  //           <View style={styles.row}>
  //             <Text style={styles.bold4}>좋은 주말 보내세요~</Text>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </ScrollView>
  //   </>
  // );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    paddingHorizontal: 2,
  },
  touchFlex: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
  },
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
  },
  flex2: {
    // flex: 1,
    //paddingVertical: 6,
    flexDirection: 'row',
  },
  flex3: {
    flex: 1,
    // paddingVertical: 10,
    // flexDirection: 'row',
  },
  flex4: {
    // flex: 1,
    width: '100%',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // marginBottom: -30,
    // paddingVertical: 10,
    flexDirection: 'row',
  },
  row: {
    //paddingTop: 10,
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  bold1: {
    marginTop: 16,
    marginLeft: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#039DF4',
  },
  bold2: {fontSize: 18, fontWeight: 'bold'},
  bold3: {marginLeft: 8, fontSize: 16, fontWeight: 'bold'},
  bold4: {marginLeft: 8, fontSize: 14},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 16,
    color: '#039DF4',
    marginTop: 6,
  },
  sellProduct: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#b9b9b9',
    borderBottomColor: '#b9b9b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  review: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#b9b9b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#039DF4',
    borderWidth: 1.5,
    borderRadius: 5,
    borderStyle: 'solid',
    height: 38,
    alignItems: 'center',
    borderBottomColor: '#039DF4',
    borderRightColor: '#039DF4',
    borderTopColor: '#039DF4',
    borderLeftColor: '#039DF4',
  },
  spinner: {
    height: 64,
  },
});

export default ChattingListScreen;
