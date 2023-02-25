import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaButton from '../components/common/DabadaButton';
import DabadaInputLine from '../components/common/DabadaInputLine';
import {createSearchRecent, getSearchRecent, resetSearchRecent, searchProps} from '../utils/search';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useTranslation} from 'react-i18next';

function SearchScreen() {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [recentSearchs, setRecentSearchs] = useState<searchProps>();
  const [keyword, setKeyword] = useState<string>('');

  useEffect(() => {
    getSearchRecent(authInfo.u_id).then(_response => {
      setRecentSearchs(_response);
    });
  }, [authInfo]);

  const onPressSearch = () => {
    let newRecentSearchs = recentSearchs;

    if (newRecentSearchs !== undefined) {
      // 이미 저장된 검색어 여부 확인
      const index = newRecentSearchs.keywords.findIndex(item => item.k_word === keyword);
      if (index < 0) {
        newRecentSearchs.keywords.unshift({k_id: uuid.v4().toString(), k_word: keyword});
        createSearchRecent(authInfo.u_id, newRecentSearchs);
      }
    } else {
      // 신규 검색어 저장
      newRecentSearchs = {
        keywords: [{k_id: uuid.v4().toString(), k_word: keyword}],
      };
      createSearchRecent(authInfo.u_id, newRecentSearchs);
    }
    setRecentSearchs({...newRecentSearchs});
    goSearchResultScreen(keyword);
  };

  const goSearchResultScreen = (searchword: string) => {
    setKeyword(searchword);
    navigation.push('SearchResultScreen', {keyword: searchword});
  };

  const onPressRemove = (k_id: string) => {
    let newRecentSearchs = recentSearchs;
    if (newRecentSearchs !== undefined) {
      const index = newRecentSearchs.keywords.findIndex(item => item.k_id === k_id);
      newRecentSearchs.keywords.splice(index, 1);
      setRecentSearchs({...newRecentSearchs});
      createSearchRecent(authInfo.u_id, newRecentSearchs);
    }
  };

  const onPressReset = () => {
    resetSearchRecent(authInfo.u_id);
    setRecentSearchs(undefined);
  };

  return (
    <ScrollView style={styles.fullscreen}>
      <View style={styles.flex}>
        <View style={styles.row2}>
          <DabadaInputLine placeholder={t('msg.inputSearchKeyword', '검색어를 입력하세요.')} hasMarginBottom={false} value={keyword} returnKeyType="done" onSubmitEditing={onPressSearch} onChangeText={(text: string) => setKeyword(text)} />
        </View>
      </View>
      {recentSearchs !== undefined && (
        <View style={styles.between}>
          <Text style={styles.bold}>{t('common.recentSearchList', '최근 검색어')}</Text>
          <DabadaButton theme={'secondary'} hasMarginBottom={false} title={t('button.deleteAll', '모두 지우기')} onPress={onPressReset} />
        </View>
      )}

      <>
        {recentSearchs !== undefined ? (
          recentSearchs.keywords.map(item => (
            <View style={styles.between2} key={item.k_id}>
              <View style={styles.searched}>
                <Pressable
                  onPress={() => {
                    goSearchResultScreen(item.k_word);
                  }}>
                  <Text style={styles.text}>{item.k_word}</Text>
                </Pressable>
                <Pressable
                  hitSlop={2}
                  onPress={() => {
                    onPressRemove(item.k_id);
                  }}>
                  <Icon name="close" size={20} color="#898989" />
                </Pressable>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.textEmpty}>{t('msg.inputSearchKeywordOnTheForm', '검색어 창에 검색어를 입력하십시오.')}</Text>
        )}
      </>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    flexDirection: 'row',
  },
  between: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  between2: {
    flex: 2,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  searched: {
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: '#b9b9b9',
    flexDirection: 'row',
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomColor: '#fefefe',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  row2: {
    padding: 14,
    justifyContent: 'space-between',
    flex: 1,
  },
  bold: {
    color: '#757575',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    color: '#757575',
    fontSize: 14,
  },
  textEmpty: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default SearchScreen;
