import {atom} from 'recoil';

export const authInfoState = atom({
  key: 'authInfoState',
  default: {
    id: '',
    displayName: '',
    photoURL: '',
  },
});
