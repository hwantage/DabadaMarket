import React from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';

function ProductListScreen() {
  const {t} = useTranslation();
  return <Text>{t('button.add')}</Text>;
}
export default ProductListScreen;
