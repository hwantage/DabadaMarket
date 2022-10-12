import React from 'react';
import {default as Text} from '../components/common/DabadaText';
import {useTranslation} from 'react-i18next';

function ProductListScreen() {
  const {t} = useTranslation();
  return <Text>{t('button.add')}</Text>;
}
export default ProductListScreen;
