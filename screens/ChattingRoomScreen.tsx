import {GiftedChat, IMessage, SystemMessage} from 'react-native-gifted-chat';
import React, {useState, useEffect, useCallback} from 'react';
import db from '@react-native-firebase/database';
import {View, TouchableOpacity, Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RBSheet from 'react-native-raw-bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {authInfoState} from '../recoil/authInfoAtom';
import {useRecoilState, useRecoilValue} from 'recoil';
import uuid from 'react-native-uuid';
import {compareDiffChattingDate, createChatting, getChattingData, updateChatting} from '../utils/chatting';
import {getUserInfo} from '../utils/auth';
import {chattingInfoState, chattingStateProps} from '../recoil/chattingAtom';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './AppStack';
const database = db().ref('chatting');
type ChattingRoomScreenProps = StackScreenProps<RootStackParamList, 'ChattingRoomScreen'>;

function ChattingRoomScreen({route}: ChattingRoomScreenProps) {
  const {u_id, p_id, c_id} = route.params;
  const [chattingId, setChattingId] = useState(c_id);
  const [chattingStateInfo, setChattingStateInfo] = useRecoilState(chattingInfoState);
  const myInfo = useRecoilValue(authInfoState);
  const [reportUser, setReportUser] = useState(null);

  console.log('TTTT', chattingStateInfo);
  console.log('TTTT2', chattingId);
  const filteredChattingState = chattingStateInfo.length > 0 ? chattingStateInfo.filter(chatting => chatting.c_id === chattingId) : [];
  const systemMessage = {
    _id: 0,
    text: '부적절하거나 불쾌감을 줄 수 있는 대화는 삼가 부탁드립니다. 회원제재를 받을 수 있습니다.',
    createdAt: new Date().getTime(),
    system: true,
    user: {_id: ''},
  };
  const [messages, setMessages] = useState(filteredChattingState.length > 0 ? [...filteredChattingState[0].c_messages, systemMessage] : [systemMessage]);

  console.log('TTTT3', JSON.stringify(messages));
  const saveInitChattingData = async (msg: IMessage[]) => {
    const oldChattingData = await getChattingData(chattingId);
    const chattingInfo: chattingStateProps = {
      ...oldChattingData,
      c_messages: msg,
    };

    setMessages(prevMessages => [...msg, ...prevMessages]);
    console.log('oldChattingData', chattingInfo);
    setChattingStateInfo(prevChattingInfo => {
      const newChattingInfo = [...prevChattingInfo, {...chattingInfo, u_id}];
      storeChattingData(newChattingInfo);
      return newChattingInfo;
    });
  };
  const initChattingData = async () => {
    const isDiff = await compareDiffChattingDate(chattingId, filteredChattingState[0]?.c_regdate);

    if (chattingId && (filteredChattingState.length === 0 || isDiff)) {
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
  useEffect(() => {
    initChattingData();
    listenToMessagesServer(data => console.log('get', data));
    return () => {
      console.log('?');
      closeChat();
    };
  }, []);

  const listenToMessagesServer = callback => {
    database.off(); //Detaches a callback previously attached with on()
    const onReceive = data => {
      const message = data.val();
      if (message.c_id === chattingId && message.p_id === p_id) {
        callback({
          _id: data.key,
          text: message.text,
          createdAt: message.createdAt,
          user: {
            _id: message.user._id,
            name: message.user.name,
          },
        });
      }
    };
    database.on('child_changed', onReceive);
  };

  const loadMessages = () => {
    database.off(); //Detaches a callback previously attached with on()

    database.once('value', snapshot => {
      const messagesByServer: IMessage[] = [];

      snapshot.forEach(data => {
        const serverData = data.val();
        const message = {
          _id: data.key || '',
          text: serverData.text,
          createdAt: serverData.createdAt,
          user: {
            _id: serverData.user._id,
            name: serverData.user.name,
          },
        };
        if (serverData.c_id === chattingId && serverData.p_id === p_id) {
          messagesByServer.unshift(message);
        }
      });
      saveInitChattingData(messagesByServer);
    });
    //database.orderByChild('locationInfo').on('child_added', onReceive);
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
  const addNewChattingInfo = useCallback(async (message, newChattingId: string) => {
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
  const updateChattingInfo = useCallback(async message => {
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
    updateChatting(chattingId, message.text, updatedDate);
  }, []);

  const sendMessage = message => {
    console.log('보낸 메시지@!?', message);
    console.log('현재 메시지@!?', messages);
    let currentChattingId = chattingId ? chattingId : uuid.v4().toString();
    let today = new Date();
    let timestamp = today.toISOString();
    if (messages.length === 1) {
      console.log('!??');
      addNewChattingInfo({...message[0], createdAt: timestamp, p_id, c_id: currentChattingId}, currentChattingId);
      setChattingId(currentChattingId);
    } else {
      updateChattingInfo({...message[0], createdAt: timestamp, p_id, c_id: currentChattingId});
    }
    console.log(message);

    for (let i = 0; i < message.length; i++) {
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
      {/*
  <Toast ref={ref => Toast.setRef(ref)} /> */}
      <RBSheet
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
      </RBSheet>
    </View>
  );
}
export default ChattingRoomScreen;
