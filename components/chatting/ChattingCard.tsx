import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {authInfoState} from '../../recoil/authInfoAtom';
import Avatar from '../profile/Avatar';
import {chattingProps} from '../../utils/chatting';
import {StackNavigationProp} from '@react-navigation/stack';
interface ChattingCardProps {
  chatInfo: chattingProps;
}
function ChattingCard({chatInfo}: ChattingCardProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [myInfo] = useRecoilState(authInfoState);

  const onPress = () => {
    navigation.navigate('ChattingRoomScreen', {p_id: chatInfo.c_p_id, u_id: myInfo.u_id === chatInfo.c_from_id ? chatInfo.c_to_id : chatInfo.c_from_id, c_id: chatInfo.c_id});
  };

  const getFormatDateString = (dateValue: number) => {
    const date = new Date(dateValue);
    return date.getMonth() + 1 + '월' + date.getDate() + '일';
  };

  return (
    <>
      <View style={styles.block}>
        <Pressable style={styles.row} onPress={() => onPress()}>
          {/* <Image source={product.p_images.length > 0 ? {uri: product.p_images[0].p_url} : require('../../assets/user.png')} style={styles.image} resizeMethod="resize" resizeMode="cover" /> */}
          <Avatar source={{uri: myInfo.u_id === chatInfo.c_from_id ? chatInfo?.c_to_photoUrl : chatInfo?.c_from_photoUrl}} size={40} />
          <View style={styles.chattingTextRow}>
            <View style={styles.chattingTopRow}>
              <Text style={styles.c_title}>{myInfo.u_id === chatInfo.c_from_id ? chatInfo.c_to_nickname : chatInfo.c_from_nickname}</Text>
              <Text style={styles.c_regdate}>{getFormatDateString(chatInfo?.c_regdate)}</Text>
            </View>
            <Text style={styles.c_lastMessage}>{chatInfo.c_lastMessage}</Text>
          </View>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 10,
    paddingLeft: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  chattingTextRow: {
    paddingHorizontal: 16,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  chattingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default ChattingCard;
