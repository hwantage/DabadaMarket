import {IMessage} from 'react-native-gifted-chat';
import {atom} from 'recoil';
import {chattingProps} from '../utils/chatting';
export interface chatMessageProps {
  _id: number;
  createdAt: string;
  text?: string;
  user?: {
    _id: string;
    name: string;
  };
}
export interface chattingStateProps extends chattingProps {
  c_messages: IMessage[];
}
// export interface chattingProps {
//   c_id: string;
//   c_messages: chatMessageProps[];
//   p_id: string;
// }

export const chattingInfoState = atom<chattingStateProps[]>({
  key: 'chattingInfo',
  default: [],
});
