import React from 'react';
import {View, StyleSheet, Pressable, TouchableOpacity, Image} from 'react-native';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {authInfoState} from '../../recoil/authInfoAtom';
import Avatar from '../profile/Avatar';
import {chattingProps} from '../../utils/chatting';
import {StackNavigationProp} from '@react-navigation/stack';
import {chattingNotificationCntState} from '../../recoil/chattingAtom';
interface ChattingCardProps {
  chatInfo: chattingProps;
}
function ChattingCard({chatInfo}: ChattingCardProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [myInfo] = useRecoilState(authInfoState);
  const [chattingNotificationCnt, setChattingNotificationCnt] = useRecoilState(chattingNotificationCntState);
  const readCnt = myInfo.u_id === chatInfo.c_from_id ? chatInfo.c_from_not_read_cnt : chatInfo.c_to_not_read_cnt;
  console.log('chat_card', chatInfo?.c_product?.p_images[0]);
  const onPress = () => {
    navigation.navigate('ChattingRoomScreen', {p_id: chatInfo.c_p_id, u_id: myInfo.u_id === chatInfo.c_from_id ? chatInfo.c_to_id : chatInfo.c_from_id, c_id: chatInfo.c_id});
  };

  const getFormatDateString = (dateValue: number) => {
    const date = new Date(dateValue);
    return date.getMonth() + 1 + '월' + date.getDate() + '일';
  };

  return (
    <>
      <Pressable style={styles.touchFlex} onPress={() => onPress()}>
        <View style={styles.between}>
          <View style={styles.flex2}>
            <Avatar source={{uri: myInfo.u_id === chatInfo.c_from_id ? chatInfo?.c_to_photoUrl : chatInfo?.c_from_photoUrl}} size={48} />
            <View>
              <View style={styles.row}>
                <Text style={styles.bold3}>{myInfo.u_id === chatInfo.c_from_id ? chatInfo.c_to_nickname : chatInfo.c_from_nickname}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.bold4}>{chatInfo.c_lastMessage}</Text>
                {readCnt > 0 && (
                  <View style={styles.notReadBadgeRow}>
                    <Text style={styles.c_notReadMessage}>{readCnt}</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          <View style={styles.flex3}>
            <Text style={styles.bold4}>{getFormatDateString(chatInfo?.c_regdate)}</Text>
            <Image style={styles.imageBox} resizeMethod="resize" resizeMode="cover" source={chatInfo?.c_product?.p_images.length > 0 ? {uri: chatInfo.c_product.p_images[0].p_url} : require('../../assets/user.png')} />
            {/* <Image source={product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../../assets/user.png')} style={styles.image} resizeMethod="resize" resizeMode="cover" /> */}
          </View>
        </View>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    // paddingTop: 10,
    // paddingLeft: 15,
    // paddingBottom: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: 'grey',
  },
  chattingTextRow: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chattingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  review: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 50,
    height: 50,
    borderRadius: 6,
    color: '#898989',
    marginLeft: 8,
  },
  c_title: {
    lineHeight: 26,
    fontSize: 22,
    fontWeight: 'bold',
  },
  c_regdate: {
    lineHeight: 26,
    fontSize: 12,
  },
  c_lastMessage: {
    fontSize: 14,
  },
  c_notReadMessage: {
    fontSize: 14,
    color: 'white',
  },
  notReadBadgeRow: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  p_price: {
    lineHeight: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    backgroundColor: '#bdbdbd',
    width: 100,
    aspectRatio: 1,
    marginBottom: 6,
    borderRadius: 10,
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
  touchFlex: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    // justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    backgroundColor: '#ffffff',
    // flex: 1,
  },
  flex2: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  flex3: {
    flexDirection: 'row',
    flex: 2,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  between: {
    flexDirection: 'row',
    // flex: 1,
    // justifyContent: 'fl',
    // backgroundColor: '#c00',
    flex: 1,
  },
  bold3: {marginLeft: 8, fontSize: 16, fontWeight: 'bold'},
  bold4: {marginLeft: 8, fontSize: 14},
});

export default ChattingCard;
