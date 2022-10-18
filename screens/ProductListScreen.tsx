import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import {default as Text} from '../components/common/DabadaText';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import TopRightButton from '../components/common/TopRightButton';

function ProductListScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  console.log(authInfo);

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <TopRightButton name="search" onPress={() => navigation.push('SearchScreen')} />,
    });
  }, [navigation]);

  return <Text>{t('button.add')}</Text>;
}
export default ProductListScreen;
