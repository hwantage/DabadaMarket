import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaButton from '../components/common/DabadaButton';
import DabadaInput from '../components/common/DabadaInput';
import {createSearchRecent, getSearchRecent, searchProps} from '../utils/search';
import uuid from 'react-native-uuid';
import Icon from 'react-native-vector-icons/MaterialIcons';

function SearchScreen() {
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

  return (
    <ScrollView>
      <View>
        <DabadaInput placeholder="검색어를 입력하세요." hasMarginBottom={false} value={keyword} returnKeyType="done" onSubmitEditing={onPressSearch} onChangeText={(text: string) => setKeyword(text)} />
        <DabadaButton hasMarginBottom={false} title="검색" onPress={onPressSearch} />
      </View>
      <Text style={styles.text}>최근 검색어</Text>
      <View>
        {recentSearchs !== undefined ? (
          recentSearchs.keywords.map(item => (
            <View key={item.k_id} style={styles.row}>
              <Pressable
                onPress={() => {
                  goSearchResultScreen(item.k_word);
                }}>
                <Text>{item.k_word}</Text>
              </Pressable>
              <Pressable
                hitSlop={2}
                onPress={() => {
                  onPressRemove(item.k_id);
                }}>
                <Icon name="delete-forever" size={20} />
              </Pressable>
            </View>
          ))
        ) : (
          <Text>검색을 수행하세요.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  text: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  },
});

export default SearchScreen;
