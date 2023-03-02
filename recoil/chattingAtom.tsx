import {IMessage} from 'react-native-gifted-chat';
import {atom} from 'recoil';
import {chattingProps} from '../utils/chatting';
export interface chatMessageProps extends IMessage {
  u_id?: string;
  p_id?: string;
  c_id?: string;
}
export interface chattingStateProps extends chattingProps {
  u_id?: string;
  c_messages: IMessage[];
}

export const chattingInfoState = atom<chattingStateProps[]>({
  key: 'chattingInfo',
  default: [],
});

// 채팅 알림 횟수
export const chattingNotificationCntState = atom({
  key: 'chattingNotificationCntState',
  default: 0,
});
