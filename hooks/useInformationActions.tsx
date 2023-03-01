import {useState} from 'react';
import {ActionSheetIOS, Platform, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import events from '../utils/events';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {removeInformation} from '../utils/informations';

export default function useInformationActions(i_id: string) {
  const {t} = useTranslation();
  const [isSelecting, setIsSelecting] = useState(false);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const edit = () => {
    navigation.navigate('InformationModifyScreen', {
      i_id,
    });
  };

  const remove = async () => {
    Alert.alert(
      t('common.delete', '삭제'),
      t('msg.deleteSure', '정말로 삭제하시겠어요?'),
      [
        {
          text: t('common.cancel', '취소'),
          onPress: () => console.log('Delete Pressed'),
          style: 'cancel',
        },
        {
          text: t('common.delete', '삭제'),
          onPress: async () => {
            await removeInformation(i_id);
            navigation.pop();
            events.emit('removeInformation', i_id);
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const onPressMore = () => {
    if (Platform.OS === 'android') {
      setIsSelecting(true);
    } else {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [t('common.edit', '수정'), t('common.delete', '삭제'), t('common.cancel', '취소')],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        buttonIndex => {
          if (buttonIndex === 0) {
            edit();
          } else if (buttonIndex === 1) {
            remove();
          }
        },
      );
    }
  };

  const actions = [
    {
      icon: 'edit',
      text: t('common.edit', '수정'),
      onPress: edit,
    },
    {
      icon: 'delete',
      text: t('common.delete', '삭제'),
      onPress: remove,
    },
  ];

  const onClose = () => {
    setIsSelecting(false);
  };

  return {
    isSelecting,
    onPressMore,
    onClose,
    actions,
  };
}
