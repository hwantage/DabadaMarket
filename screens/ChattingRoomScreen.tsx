import React, {useEffect, useState, useCallback} from 'react';
import {GiftedChat, IMessage, User} from 'react-native-gifted-chat';
import db from '@react-native-firebase/database';
import {View, StyleSheet, Image, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authInfoState} from '../recoil/authInfoAtom';
import {useRecoilState, useRecoilValue} from 'recoil';
import uuid from 'react-native-uuid';
import {CHAT_PRODUCT_STATE, compareDiffChattingDate, createChatting, getChattingData, updateChatting, updateChattingProps} from '../utils/chatting';
import {getUserInfo} from '../utils/auth';
import {chatMessageProps, chattingInfoState, chattingStateProps} from '../recoil/chattingAtom';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from './AppStack';
import {useNavigation} from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import {default as Text} from '../components/common/DabadaText';
import {comma, updateProductField} from '../utils/products';
import moment from 'moment-timezone';
import {FIREBASE_API_KEY} from '../components/common/FirebaseInfo';

const database = db().ref('chatting');
type ChattingRoomScreenProps = StackScreenProps<RootStackParamList, 'ChattingRoomScreen'>;

function ChattingRoomScreen({route}: ChattingRoomScreenProps) {
  const {p_id, c_id, product} = route.params;
  const [chattingStateInfo, setChattingStateInfo] = useRecoilState(chattingInfoState);

  const findChatInfoByProduct = product && chattingStateInfo && chattingStateInfo.length > 0 ? chattingStateInfo.filter(chat => chat?.c_product?.p_id === product?.p_id) : [];

  const [chattingId, setChattingId] = useState(findChatInfoByProduct.length > 0 ? findChatInfoByProduct[0]?.c_id : c_id);
  const [sendMessageCount, setSendMessageCount] = useState(0);

  const myInfo = useRecoilValue(authInfoState);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const [filteredChattingState, setFilteredChattingState] = useState<chattingStateProps[]>([]);
  const [messages, setMessages] = useState<IMessage[]>(filteredChattingState.length > 0 ? [...filteredChattingState[0].c_messages] : []);
  const [currentProductState, setCurrentProductState] = useState(product ? product.p_status : filteredChattingState.length > 0 ? filteredChattingState[0]?.c_product.p_status : 1);
  const saveInitChattingData = useCallback(
    async (msg: IMessage[]) => {
      const oldChattingData = await getChattingData(chattingId);
      setCurrentProductState(oldChattingData?.c_product ? oldChattingData?.c_product.p_status : 1);

      msg.map(data => {
        if (oldChattingData && oldChattingData.c_from_id !== myInfo.u_id) {
          data.user.avatar = String(oldChattingData.c_from_photoUrl);
        } else {
          data.user.avatar = String(oldChattingData.c_to_photoUrl);
        }
        return data;
      });
      const chattingInfo: chattingStateProps = {
        ...oldChattingData,
        c_messages: msg,
      };

      setMessages(msg);

      setChattingStateInfo(prevChattingInfo => {
        const findChattingInfo = prevChattingInfo.filter(chatInfo => chatInfo.c_id === chattingId);

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
    },
    [chattingId, myInfo.u_id, setChattingStateInfo],
  );
  const loadMessages = useCallback(() => {
    database.off(); //Detaches a callback previously attached with on()
    database.orderByChild('createdAt').on('value', snapshot => {
      const messagesByServer: IMessage[] = [];

      snapshot.forEach(data => {
        const filteredData = messagesByServer.filter(m => m._id === data.key);
        console.log('snap ', filteredData);
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

          // if (serverData.c_id === chattingId && serverData?.c_product_p_id === filteredChattingState[0]?.c_product.p_id) {

          if (serverData.c_id === chattingId) {
            messagesByServer.unshift(message);
          }
        }
        return true;
      });

      saveInitChattingData(messagesByServer);
    });
  }, [chattingId, saveInitChattingData]);

  const updateIsOnline = useCallback(
    (isOnline: boolean) => {
      if (filteredChattingState[0]?.c_from_id !== myInfo.u_id) {
        updateChatting(chattingId, {c_to_online: isOnline, c_to_not_read_cnt: 0});
      } else {
        updateChatting(chattingId, {c_from_online: isOnline, c_from_not_read_cnt: 0});
      }
    },
    [chattingId, filteredChattingState, myInfo.u_id],
  );

  const initChattingData = useCallback(async () => {
    const isDiff = await compareDiffChattingDate(chattingId, filteredChattingState[0]?.c_regdate);

    // 채팅이 시작된 상태에서 (메시지를 한개라도 보내야 chattingId가 생성됨) 채팅 데이터가 없거나 날짜가 동기화 안 된 경우에 메시지를 새로 불러온다.
    if (chattingId && (filteredChattingState.length === 0 || isDiff)) {
      loadMessages();
    }
  }, [chattingId, filteredChattingState, loadMessages]);
  useEffect(() => {
    if (chattingStateInfo && chattingStateInfo.length > 0) {
      setFilteredChattingState(chattingStateInfo.filter(chatting => chatting.c_id === chattingId));
    }
  }, [chattingId, chattingStateInfo]);

  useEffect(() => {
    if (chattingId) {
      initChattingData();
      updateIsOnline(true);
    }

    return () => {
      if (chattingId) {
        updateIsOnline(false);
      }
      closeChat();
    };
  }, [chattingId, chattingStateInfo, initChattingData, updateIsOnline]);

  /* 채팅 저장 */
  const addNewChattingInfo = useCallback(
    async (message: chatMessageProps, newChattingId: string) => {
      const sellerInfo = await getUserInfo(product?.u_id);

      if (!sellerInfo) {
        return;
      }
      const chatting = {
        c_id: newChattingId,
        c_from_id: myInfo.u_id,
        c_from_nickname: myInfo.u_nickname,
        c_from_photoUrl: myInfo.u_photoUrl ? myInfo.u_photoUrl : '',
        c_to_id: product?.u_id,
        c_to_nickname: sellerInfo.u_nickname,
        c_to_photoUrl: sellerInfo.u_photoUrl ? sellerInfo.u_photoUrl : '',
        c_product: product,
        c_lastMessage: message.text,
        c_regdate: moment().format('YYYY-MM-DD HH:mm:ss'),
        c_product_state: CHAT_PRODUCT_STATE.SELL,
      };

      const chattingInfo: chattingStateProps = {
        ...chatting,
        c_messages: [message],
      };
      setMessages(prevMessages => [message, ...prevMessages]);

      setChattingStateInfo(prevChattingInfo => {
        const newChattingInfo = [...prevChattingInfo, chattingInfo];
        storeChattingData({...newChattingInfo});
        return newChattingInfo;
      });
      createChatting(chatting);

      updateProductField(product ? product.p_id : filteredChattingState[0]?.c_product.p_id, 'p_chat', filteredChattingState[0]?.c_product.p_chat + 1); // p_view 조회수 카운터 증가 내역을 Firestore에 반영
    },
    [filteredChattingState, myInfo.u_id, myInfo.u_nickname, myInfo.u_photoUrl, product, setChattingStateInfo],
  );

  const storeChattingData = async (value: chattingStateProps[]) => {
    try {
      await AsyncStorage.setItem('@chattingInfo', JSON.stringify(value));
    } catch (e) {
      console.log('saving error', e);
    }
  };
  const sendPushNotification = async (token: string, title: string, body: string) => {
    const message = {
      registration_ids: [token],
      notification: {
        title: title,
        body: body,
        vibrate: 1,
        sound: 1,
        show_in_foreground: true,
        priority: 'high',
        content_available: true,
      },
    };

    let headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + FIREBASE_API_KEY,
    });

    let response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers,
      body: JSON.stringify(message),
    });
    await response.json();
  };

  const updateChattingInfo = useCallback(
    async (message: chatMessageProps) => {
      const currentDatetime = moment().format('YYYY-MM-DD HH:mm:ss');
      setMessages(prevMessages => [message, ...prevMessages]);
      setChattingStateInfo(prevChattingInfo => {
        const convertedChattingInfo = prevChattingInfo.map(chattingInfo => {
          if (chattingInfo.c_id === chattingId) {
            chattingInfo.c_lastMessage = message.text;
            chattingInfo.c_regdate = currentDatetime;
            chattingInfo.c_messages = [message, ...chattingInfo.c_messages];
          }

          return chattingInfo;
        });
        console.log('저장', convertedChattingInfo);
        storeChattingData({...convertedChattingInfo});
        return convertedChattingInfo;
      });

      const currentChattingInfo = await getChattingData(chattingId);
      const updChattingInfo: updateChattingProps = {c_lastMessage: message.text, c_regdate: currentDatetime};

      let readCnt = sendMessageCount;
      let senderId = currentChattingInfo?.c_from_id;
      if (currentChattingInfo?.c_from_id === myInfo.u_id) {
        senderId = currentChattingInfo.c_to_id;
      }
      let sendInfo = await getUserInfo(senderId);
      await sendPushNotification(sendInfo.u_fcmToken, '채팅 알림', message.text);

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
        updateChatting(chattingId, updChattingInfo);
      }
    },
    [sendMessageCount, myInfo, chattingId, setChattingStateInfo],
  );

  const sendMessage = (message: IMessage[]) => {
    let currentChattingId = chattingId ? chattingId : uuid.v4().toString();
    const timestamp = moment().toDate();

    console.log('timestamp!!!', timestamp);
    if (messages.length === 0) {
      addNewChattingInfo({...message[0], createdAt: timestamp, c_id: currentChattingId}, currentChattingId);
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
  const onPressAvatar = (user: User) => {
    navigation.push('UserHomeScreen', {u_id: user._id});

    // this.setState({reportUser: user.name});
    // this.Standard.open();
  };
  //  const onRenderSystemMessage = props => <SystemMessage {...props} containerStyle={{backgroundColor: '#7cc8c3'}} textStyle={{color: 'white', fontWeight: '500', fontSize: 17, textAlign: 'center'}} />;

  const closeChat = () => {
    if (database) {
      database.off();
    }
  };

  const onChangeProductState = (state: number) => {
    console.log('채팅 제품', filteredChattingState[0]?.c_product);

    const updChattingInfo: updateChattingProps = {c_product: {...filteredChattingState[0]?.c_product, p_status: state}, c_regdate: moment().format('YYYY-MM-DD HH:mm:ss')};
    console.log('onChangeStatus', state);
    updateChatting(chattingId, updChattingInfo);
    updateProductField(product ? product.p_id : filteredChattingState[0]?.c_product.p_id, 'p_status', state); // p_view 조회수 카운터 증가 내역을 Firestore에 반영
    updateProductField(product ? product.p_id : filteredChattingState[0]?.c_product.p_id, 'p_buyer_id', filteredChattingState[0]?.c_product.u_id);
    setCurrentProductState(state);
  };

  let p_status_str = ''; // 1:판매중, 2:예약중, 3:거래완료, 4:판매중지
  //let p_buy_available = true; // 판매중, 예약중 일때만 구매 가능. 거래완료, 판매중지 일 경우 false 로 변경.

  switch (currentProductState) {
    case 1:
      p_status_str = '판매중';
      break;
    case 2:
      p_status_str = '예약중';
      break;
    case 3:
      p_status_str = '거래완료';
      //p_buy_available = false;
      break;
    case 4:
      p_status_str = '판매중지';
      //p_buy_available = false;
      break;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.touchFlex} behavior="padding">
        <Image style={styles.imageBox} source={product ? (product.p_images && product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../assets/user.png')) : filteredChattingState[0]?.c_product.p_images && filteredChattingState[0]?.c_product.p_images.length > 0 ? {uri: filteredChattingState[0]?.c_product.p_images[0].p_url} : require('../assets/user.png')} />
        <View style={styles.container}>
          <View style={styles.infoRow}>
            <View style={styles.flex2}>
              <Text numberOfLines={1} style={styles.text}>
                제품명: {product ? product.p_title : filteredChattingState[0]?.c_product?.p_title}
              </Text>
            </View>
            <View style={styles.flex3}>
              {filteredChattingState[0]?.c_to_id === myInfo.u_id ? (
                <Picker selectedValue={currentProductState} onValueChange={onChangeProductState} style={styles.picker}>
                  <Picker.Item label="판매중" value={1} />
                  <Picker.Item label="예약중" value={2} />
                  <Picker.Item label="거래완료" value={3} />
                </Picker>
              ) : (
                <Text style={styles.bold3}>{p_status_str}</Text>
              )}
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.bold3}>{`${comma(product ? (product.p_price > '0' ? product.p_price : '0') : filteredChattingState[0]?.c_product?.p_price > '0' ? filteredChattingState[0]?.c_product?.p_price : '0')}원`}</Text>
          </View>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.chattingRow}>
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
          // renderSystemMessage={onRenderSystemMessage}
          placeholder="message 입력"
          onPressAvatar={onPressAvatar}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  touchFlex: {
    flex: 0.12,
    minHeight: 22,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    backgroundColor: '#fefefe',
  },
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
  },
  flex2: {flex: 0.55},
  flex3: {flex: 0.45},
  row: {
    //paddingTop: 10,
    // textAlign: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRow: {
    flex: 0.55,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceRow: {
    flex: 0.45,
    flexDirection: 'row',
    marginLeft: 8,
  },
  picker: {
    width: '100%',
  },
  bold1: {marginTop: 16, marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#039DF4'},
  bold2: {fontSize: 18, fontWeight: 'bold'},
  bold3: {fontSize: 16, fontWeight: 'bold'},
  bold4: {fontSize: 14},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 14,
    //color: '#039DF4',
    marginLeft: 6,
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 50,
    height: 50,
    borderRadius: 6,
    color: '#898989',
    marginRight: 12,
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
  chattingRow: {
    flex: 0.88,
  },
});
export default ChattingRoomScreen;
