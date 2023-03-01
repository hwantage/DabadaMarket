import {useCallback, useEffect, useState} from 'react';
import {getInformations, PAGE_SIZE} from '../utils/informations';
import useInformationEventEffect from './useInformationEventEffect';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import {informationProps, getInformationProps} from '../utils/informations';

export default function useInformations({i_group, u_id}: getInformationProps) {
  const [informations, setInformations] = useState<informationProps[] | undefined>(undefined);
  const [noMoreInformation, setNoMoreInformation] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  useEffect(() => {
    getInformations({i_group}).then(_informations => {
      setInformations(_informations);
      if (_informations.length < PAGE_SIZE) {
        setNoMoreInformation(true);
      }
    });
  }, [u_id, i_group]);

  const removeInformation = useCallback(
    (i_id: string) => {
      setInformations(informations?.filter(info => info.i_id !== i_id));
    },
    [informations],
  );

  const updateInformation = useCallback(
    (i_id: string, informationInfo: informationProps) => {
      // id가 일치하는 상품 찾아서 내용 변경
      const nextInformations = informations?.map((info: informationProps) =>
        info.i_id === i_id
          ? {
              //...p,
              ...informationInfo,
            }
          : info,
      );
      setInformations(nextInformations);
    },
    [informations],
  );

  const onLoadMoreInfo = async () => {
    if (noMoreInformation || !informations || informations.length < PAGE_SIZE) {
      return;
    }
    const lastInformation = informations[informations.length - 1];
    const olderInformation = await getInformations({i_group: i_group, i_id: lastInformation.i_id, cursormode: 'older', u_id: u_id});
    if (olderInformation.length < PAGE_SIZE) {
      setNoMoreInformation(true);
    }
    setInformations(informations.concat(olderInformation));
  };

  const refreshInformation = useCallback(async () => {
    if (!informations || informations.length === 0 || refreshing) {
      return;
    }
    const firstInformation = informations[0];
    setRefreshing(true);
    const newerInformation = await getInformations({i_group: i_group, i_id: firstInformation.i_id, cursormode: 'newer', u_id: u_id});
    setRefreshing(false);
    if (newerInformation.length === 0) {
      return;
    }
    setInformations(newerInformation.concat(informations));
  }, [i_group, informations, refreshing, u_id]);

  useInformationEventEffect({
    refreshInformation,
    removeInformation,
    updateInformation,
    enabled: !u_id || u_id === authInfo.u_id,
  });

  return {
    informations,
    noMoreInformation,
    refreshing,
    onLoadMoreInfo,
    refreshInformation,
  };
}
