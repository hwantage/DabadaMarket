import {atom} from 'recoil';

export interface authInfoProps {
  id: string;
  displayName: string;
  photoURL: string;
}

export const authInfoState = atom<authInfoProps>({
  key: 'authInfo',
  default: {
    id: '',
    displayName: '',
    photoURL: '',
  },
});
