import {GiftedChat, IMessage, SystemMessage} from 'react-native-gifted-chat';
import React, {useState, useEffect, useCallback} from 'react';
import db from '@react-native-firebase/database';
import {View, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {authInfoState} from '../recoil/authInfoAtom';
import {useRecoilState, useRecoilValue} from 'recoil';
import uuid from 'react-native-uuid';
import {compareDiffChattingDate, createChatting, getChattingData, updateChatting, updateChattingProps} from '../utils/chatting';
import {getUserInfo} from '../utils/auth';
import {chattingInfoState, chattingStateProps} from '../recoil/chattingAtom';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './AppStack';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
const database = db().ref('chatting');
type ChattingRoomScreenProps = StackScreenProps<RootStackParamList, 'ChattingRoomScreen'>;

function ChattingRoomScreen({route}: ChattingRoomScreenProps) {
  const {u_id, p_id, c_id, p_title} = route.params;
  const [chattingId, setChattingId] = useState(c_id);
  const [sendMessageCount, setSendMessageCount] = useState(0);
  const [chattingStateInfo, setChattingStateInfo] = useRecoilState(chattingInfoState);
  const myInfo = useRecoilValue(authInfoState);
  //const [reportUser, setReportUser] = useState(null);
  const navigation = useNavigation<StackNavigationProp<any>>();

  console.log('TTTT', chattingStateInfo);
  console.log('TTTT2', chattingId);
  const filteredChattingState = chattingStateInfo && chattingStateInfo.length > 0 ? chattingStateInfo.filter(chatting => chatting.c_id === chattingId) : [];
  const systemMessage = {
    _id: 0,
    text: '부적절하거나 불쾌감을 줄 수 있는 대화는 삼가 부탁드립니다. 회원제재를 받을 수 있습니다.',
    createdAt: new Date().getTime(),
    system: true,
    user: {_id: ''},
  };
  const [messages, setMessages] = useState<IMessage[]>(filteredChattingState.length > 0 ? [...filteredChattingState[0].c_messages] : []);

  console.log('TTTT3', JSON.stringify(messages));
  const saveInitChattingData = async (msg: IMessage[]) => {
    console.log('msg length ', msg.length);
    const oldChattingData = await getChattingData(chattingId);
    // console.log('!!?@?@?@?@?@ ', oldChattingData);
    // if ((oldChattingData?.c_to_id === myInfo.u_id && oldChattingData?.c_from_not_read_cnt === 0) || (oldChattingData?.c_from_id === myInfo.u_id && oldChattingData?.c_to_not_read_cnt === 0)) {
    //   setSendMessageCount(0);
    // }

    msg.map(data => {
      if (oldChattingData && oldChattingData.c_from_id !== myInfo.u_id) {
        data.user.avatar = oldChattingData.c_from_photoUrl;
        console.log(data.user);
      } else {
        data.user.avatar = oldChattingData.c_to_photoUrl;
      }
      return data;
    });
    const chattingInfo: chattingStateProps = {
      ...oldChattingData,
      c_messages: msg,
    };

    console.log('oldChattingData', JSON.stringify(msg));
    setMessages(msg);
    // setMessages(prevMessages => {
    //   let newMessages: IMessage[] = [...prevMessages];
    //   if (prevMessages.length === 1) {
    //     console.log('test data1', prevMessages);
    //     newMessages = [...msg, ...prevMessages];
    //   } else {
    //     console.log('test data2', newMessages);
    //     msg.map(m => {
    //       let findList = newMessages.filter(curMessage => curMessage._id !== 0 && m._id !== 0 && curMessage._id === m._id);

    //       console.log('test data3', findList);
    //       if (findList.length === 0) {
    //         newMessages.unshift(m);
    //       }
    //     });
    //   }
    //   chattingInfo.c_messages = newMessages;
    //   return newMessages;
    // });
    console.log('oldChattingData', chattingInfo);

    setChattingStateInfo(prevChattingInfo => {
      const findChattingInfo = prevChattingInfo.filter(chatInfo => chatInfo.c_id === chattingId);

      console.log('setChatting', prevChattingInfo);
      //return prevChattingInfo;
      if (findChattingInfo && findChattingInfo.length > 0) {
        let findIndex = -1;
        let copyChattingInfo = [...prevChattingInfo];
        prevChattingInfo.map((chatInfo, idx) => {
          if (chatInfo.c_id === chattingId) {
            findIndex = idx;
          }
        });
        if (findIndex === -1) {
          storeChattingData(prevChattingInfo);
          return prevChattingInfo;
        } else {
          copyChattingInfo[findIndex] = {...chattingInfo, u_id: myInfo.u_id};
          storeChattingData(copyChattingInfo);
          return copyChattingInfo;
        }
      } else {
        const newChattingInfo = [...prevChattingInfo, {...chattingInfo, u_id: myInfo.u_id}];
        storeChattingData(newChattingInfo);
        return newChattingInfo;
      }
    });
  };
  const initChattingData = async () => {
    const isDiff = await compareDiffChattingDate(chattingId, filteredChattingState[0]?.c_regdate);
    const oldChattingData = await getChattingData(chattingId);

    if (chattingId && (filteredChattingState.length === 0 || isDiff)) {
      console.log('isDiff', isDiff);
      loadMessages();
    }
    // c_id 가  recoil에 저장된 date와 원격서버에 있는 chatting date가 다른지 체크
    // if (chattingId && (filteredChattingState.length === 0 || isDiff)) {
    //   //   //test();
    //   //   console.log('?@?@?@?');
    //   loadMessages(message => {
    //     //console.log('current! ', message);
    //     //setMessages(prevMessages => [message, ...prevMessages]);
    //     // let newChattingInfo = [];
    //     // let filteredChatting = chattingStateInfo.filter(chatting => chatting.c_id === c_id);
    //     // if (filteredChatting.length === 0) {
    //     //   return;
    //     // } else {
    //     //   console.log('filteredChatting', filteredChatting);
    //     //   let filteredMessage = filteredChatting[0].c_messages.filter(msg => msg._id === message._id);
    //     //   filteredChatting[0].c_messages = GiftedChat.append(filteredChatting[0].c_messages, message);
    //     //   chattingStateInfo.filter(chatting => chatting.c_id !== c_id);
    //     //   newChattingInfo.push(filteredChatting[0]);
    //     // }
    //     // setChattingStateInfo(newChattingInfo);
    //     // storeChattingData(newChattingInfo);
    //   });
    // }
  };
  // const checkReadChatting = async () => {
  //   const oldChattingData = await getChattingData(chattingId);
  //   console.log('!!?@?@?@?@?@ ', oldChattingData);
  //   if ((oldChattingData?.c_to_id === myInfo.u_id && oldChattingData?.c_from_not_read_cnt === 0) || (oldChattingData?.c_from_id === myInfo.u_id && oldChattingData?.c_to_not_read_cnt === 0)) {
  //     setSendMessageCount(0);
  //   }
  // };

  // useEffect(() => {
  //   checkReadChatting();
  // }, [filteredChattingState, sendMessageCount]);

  useEffect(() => {
    initChattingData();
    navigation.setOptions({
      title: p_title ? p_title : filteredChattingState[0]?.c_p_title,
    });
    console.log('?', filteredChattingState[0]);
    updateIsOnline(true);
    //listenToMessagesServer(data => saveInitChattingData([data]));
    return () => {
      console.log('?');
      updateIsOnline(false);
      closeChat();
    };
  }, []);

  const listenToMessagesServer = callback => {
    database.off(); //Detaches a callback previously attached with on()
    const onReceive = data => {
      const message = data.val();
      const newMessages = messages.filter(currentMessage => currentMessage._id !== message._id);

      console.log('test@@@@@@@@@', newMessages);
      callback({
        _id: data.key,
        text: message.text,
        createdAt: message.createdAt,
        user: {
          _id: message.user._id,
          name: message.user.name,
        },
      });
    };
    database.on('child_added', onReceive);
  };

  const updateIsOnline = (isOnline: boolean) => {
    if (filteredChattingState[0]?.c_from_id !== myInfo.u_id) {
      updateChatting(chattingId, {c_to_online: isOnline, c_to_not_read_cnt: 0});
    } else {
      updateChatting(chattingId, {c_from_online: isOnline, c_from_not_read_cnt: 0});
    }
  };

  const loadMessages = () => {
    database.off(); //Detaches a callback previously attached with on()

    database.orderByChild('createdAt').on('value', snapshot => {
      const messagesByServer: IMessage[] = [];

      snapshot.forEach(data => {
        const filteredData = messagesByServer.filter(m => m._id === data.key);
        if (filteredData.length === 0) {
          const serverData = data.val();
          console.log('CHILD', serverData);
          const message = {
            _id: data.key || '',
            text: serverData.text,
            createdAt: serverData.createdAt,
            user: {
              _id: serverData?.user._id,
              name: serverData.user.name,
            },
          };
          if (serverData.c_id === chattingId && serverData.p_id === p_id) {
            messagesByServer.unshift(message);
          }
        }
      });

      console.log('messagesByServer', messagesByServer);
      saveInitChattingData(messagesByServer);
    });
  };

  // const loadMessages = callback => {
  //   database.off(); //Detaches a callback previously attached with on()
  //   const onReceive = data => {
  //     const message = data.val();

  //     if (message.c_id === chattingId && message.p_id === p_id) {
  //       console.log('test', message);
  //       callback({
  //         _id: data.key,
  //         text: message.text,
  //         createdAt: message.createdAt,
  //         user: {
  //           _id: message.user._id,
  //           name: message.user.name,
  //         },
  //       });
  //     }
  //   };
  //   // let d = this.getLimit();
  //   // console.log(d);
  //   database.orderByChild('locationInfo').once('value', snapshot => {
  //     const arr = [];
  //     snapshot.forEach(data => {
  //       const message = data.val();
  //       const convertedData = {
  //         _id: data.key,
  //         text: message.text,
  //         createdAt: message.createdAt,
  //         user: {
  //           _id: message.user._id,
  //           name: message.user.name,
  //         },
  //       };
  //       if (message.c_id === chattingId && message.p_id === p_id) {
  //         arr.unshift(convertedData);
  //       }
  //     });
  //     saveInitChattingData(arr);
  //   });
  //   //database.orderByChild('locationInfo').on('child_added', onReceive);
  // };

  /* 채팅 저장 */
  const addNewChattingInfo = useCallback(async (message: IMessage, newChattingId: string) => {
    const sellerInfo = await getUserInfo(u_id);
    console.log(sellerInfo);
    if (!sellerInfo) {
      return;
    }
    // setLoading(true);
    //const reference = storage().ref(`/chatting/${roomId}/`);
    const chatting = {
      c_id: newChattingId,
      c_from_id: myInfo.u_id,
      c_from_nickname: myInfo.u_nickname,
      c_from_photoUrl: myInfo.u_photoUrl ? myInfo.u_photoUrl : '',
      c_to_id: u_id,
      c_to_nickname: sellerInfo.u_nickname,
      c_to_photoUrl: sellerInfo.u_photoUrl ? sellerInfo.u_photoUrl : '',
      c_p_id: p_id,
      c_p_title: p_title,
      c_lastMessage: message.text,
      c_regdate: Date.now(),
    };

    const chattingInfo: chattingStateProps = {
      ...chatting,
      c_messages: [message],
    };
    setMessages(prevMessages => [message, ...prevMessages]);
    console.log('gggg', JSON.stringify(chattingInfo));
    setChattingStateInfo(prevChattingInfo => {
      const newChattingInfo = [...prevChattingInfo, chattingInfo];
      storeChattingData({...newChattingInfo, u_id: myInfo.u_id});
      return newChattingInfo;
    });
    createChatting(chatting);

    // navigation.pop();
    // events.emit('refresh');
  }, []);

  const storeChattingData = async value => {
    try {
      await AsyncStorage.setItem('@chattingInfo', JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };
  const updateChattingInfo = useCallback(
    async message => {
      const updatedDate = Date.now();
      setMessages(prevMessages => [message, ...prevMessages]);
      setChattingStateInfo(prevChattingInfo => {
        const convertedChattingInfo = prevChattingInfo.map(chattingInfo => {
          if (chattingInfo.c_id === chattingId) {
            chattingInfo.c_lastMessage = message.text;
            chattingInfo.c_regdate = updatedDate;
            chattingInfo.c_messages = [message, ...chattingInfo.c_messages];
          }

          return chattingInfo;
        });
        console.log('저장', convertedChattingInfo);
        storeChattingData({...convertedChattingInfo, u_id: myInfo.u_id});
        return convertedChattingInfo;
      });

      const currentChattingInfo = await getChattingData(chattingId);
      const updChattingInfo: updateChattingProps = {c_lastMessage: message.text, c_regdate: updatedDate};

      let readCnt = sendMessageCount;
      if ((currentChattingInfo?.c_to_id === myInfo.u_id && currentChattingInfo?.c_from_not_read_cnt === 0) || (currentChattingInfo?.c_from_id === myInfo.u_id && currentChattingInfo?.c_to_not_read_cnt === 0)) {
        readCnt = 0;
      }

      console.log('current_chatting', currentChattingInfo);
      if (currentChattingInfo?.c_from_id === myInfo.u_id && !currentChattingInfo.c_to_online) {
        updChattingInfo.c_to_not_read_cnt = readCnt + 1;

        setSendMessageCount(readCnt + 1);
        updateChatting(chattingId, updChattingInfo);
        console.log('c_from_not_read_cnt');
      } else if (currentChattingInfo?.c_to_id === myInfo.u_id && !currentChattingInfo.c_from_online) {
        console.log('!!!c_to_not_read_cnt ', sendMessageCount + 1);
        updChattingInfo.c_from_not_read_cnt = readCnt + 1;
        setSendMessageCount(readCnt + 1);
        updateChatting(chattingId, updChattingInfo);
      } else {
        console.log('!!!other');
        updateChatting(chattingId, updChattingInfo);
      }
      console.log('isOnline', filteredChattingState[0]?.c_from_online);
    },
    [sendMessageCount, myInfo, filteredChattingState, chattingId, setChattingStateInfo],
  );

  const sendMessage = message => {
    console.log('보낸 메시지@!?', message);
    console.log('현재 메시지@!?', messages);
    let currentChattingId = chattingId ? chattingId : uuid.v4().toString();
    let today = new Date();
    let timestamp = today.toISOString();
    if (messages.length === 0) {
      console.log('!??');
      addNewChattingInfo({...message[0], createdAt: timestamp, p_id, c_id: currentChattingId}, currentChattingId);
      setChattingId(currentChattingId);
    } else {
      updateChattingInfo({...message[0], createdAt: timestamp, p_id, c_id: currentChattingId});
    }

    for (let i = 0; i < message.length; i++) {
      console.log('send', message.length);
      database.push({
        text: message[i].text,
        user: message[i].user,
        createdAt: timestamp,
        p_id,
        c_id: currentChattingId,
      });
      /*
      if (setFilterText(message[i].text)) {
      } else {
         showToast('불쾌감을 줄 수 있는 내용은 삼가 부탁드립니다', '전송 실패', defaultDuration, 'top');
      }*/
    }
  };
  const onPressAvatar = user => {
    navigation.push('UserHomeScreen', {u_id: user._id});

    // this.setState({reportUser: user.name});
    // this.Standard.open();
  };
  const onRenderSystemMessage = props => <SystemMessage {...props} containerStyle={{backgroundColor: '#7cc8c3'}} textStyle={{color: 'white', fontWeight: '500', fontSize: 17, textAlign: 'center'}} />;

  const closeChat = () => {
    if (database) {
      database.off();
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <GiftedChat
        locale="ko"
        messages={messages}
        onSend={message => {
          sendMessage(message);
        }}
        user={{
          _id: myInfo.u_id,
          name: myInfo.u_nickname,
        }}
        //this.props.route.params.nickname
        renderSystemMessage={onRenderSystemMessage}
        placeholder="message 입력"
        onPressAvatar={onPressAvatar}
        // onPressActionButton={this.onPressActionButton}
        // renderUsernameOnMessage
      />
      {/* <RBSheet
        ref={ref => {
          this.Standard = ref;
        }}
        height={230}
        closeOnDragDown
        customStyles={{
          container: {alignItems: 'center', backgroundColor: '#F5FCFF', borderTopLeftRadius: 30, borderTopRightRadius: 30},
        }}>
        <View>
          <TouchableOpacity onPress={this.onHandleEmail}>
            <MaterialIcons name={'report-problem'} />
            <Text />
          </TouchableOpacity>
        </View>
        <View>
          <View>
            <Ionicons name={'ios-person'} />
            <Text>유저정보</Text>
            <Text>{reportUser}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity>
            <MaterialIcons name={'thumb-down-alt'} />
            <Text>싫어요</Text>
            <Text />
          </TouchableOpacity>
        </View>
      </RBSheet> */}
    </View>
  );
}
export default ChattingRoomScreen;
