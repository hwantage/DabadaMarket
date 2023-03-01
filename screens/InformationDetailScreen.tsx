import React, {useCallback, useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import type {StackScreenProps} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import TopRightButton from '../components/common/TopRightButton';
import {RootStackParamList} from './AppStack';
import ActionSheetModal from '../components/ActionSheetModal';
import events from '../utils/events';
import {getInformationInfo, informationProps, informationPropsDefault, updateInformationField} from '../utils/informations';
import useInformationActions from '../hooks/useInformationActions';
import Information from '../components/information/Information';

type InformationDetailScreenProps = StackScreenProps<RootStackParamList, 'InformationDetailScreen'>;

function InformationDetailScreen({navigation, route}: InformationDetailScreenProps) {
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const information = route.params.information;
  const [informationInfo, setInformationInfo] = useState<informationProps>(informationPropsDefault);
  const {isSelecting, onPressMore, onClose, actions} = useInformationActions(information.i_id);

  const initInformation = useCallback(async () => {
    await getInformationInfo(information.i_id).then(_response => {
      if (_response.u_id !== authInfo.u_id) {
        updateInformationField(information.i_id, 'i_view', information.i_view + 1); // i_view 조회수 카운터 증가 내역을 Firestore에 반영
        events.emit('updateInformation', information.i_id, {...information, i_view: information.i_view + 1});
        setInformationInfo({..._response, i_view: _response.i_view + 1});
      } else {
        setInformationInfo(_response);
      }
    });
  }, [authInfo.u_id, information]);

  // 상세 화면 포커스 될 때마다 새로 갱신
  useFocusEffect(
    useCallback(() => {
      initInformation();
    }, [initInformation]),
  );

  useEffect(() => {
    authInfo.u_id === informationInfo.u_id &&
      navigation.setOptions({
        headerRight: () => <TopRightButton name="more-vert" onPress={onPressMore} />,
      });
  }, [authInfo.u_id, informationInfo.u_id, navigation, onPressMore]);

  return (
    <>
      {informationInfo.i_id !== '' && (
        <>
          <Information information={informationInfo} />
          <ActionSheetModal visible={isSelecting} actions={actions} onClose={onClose} />
        </>
      )}
    </>
  );
}

export default InformationDetailScreen;
