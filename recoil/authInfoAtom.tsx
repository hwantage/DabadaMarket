import {atom} from 'recoil';

export interface authInfoProps {
  u_id: string;
  u_nickname: string;
  u_group: string;
  u_lang: string;
  u_photoUrl: string | {} | null;
  u_fcmToken: string;
}

export const authInfoDefault: authInfoProps = {
  u_id: '',
  u_nickname: '',
  u_group: '',
  u_lang: '',
  u_photoUrl: '',
  u_fcmToken: '',
};

export const authInfoState = atom<authInfoProps>({
  key: 'authInfo',
  default: authInfoDefault,
});
