import React, {useEffect, useState} from 'react';
import {Pressable, ScrollView, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import DabadaButton from '../components/common/DabadaButton';
import DabadaInput from '../components/common/DabadaInput';
import DabadaInputLine from '../components/common/DabadaInputLine';
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

  const onPressDelete = () => {
    navigation.push('');
  };

  return (
    <ScrollView style={styles.fullscreen}>
      <View style={styles.flex}>
        <View style={styles.row2}>
          <DabadaInputLine placeholder={'검색어를 입력하세요.'} hasMarginBottom={false} />
          {/* <DabadaButton theme={'secondary'} hasMarginBottom={false} title="설정" onPress={() => navigation.push('BottomTab')} /> */}
        </View>
      </View>
      {/* <View style={styles.flex2}>
        <DabadaInput placeholder="검색어를 입력하세요." hasMarginBottom={false} value={keyword} returnKeyType="done" onSubmitEditing={onPressSearch} onChangeText={(text: string) => setKeyword(text)} />
      </View> */}
      <View style={styles.between}>
        <Text style={styles.bold}>최근 검색어</Text>
        <DabadaButton theme={'secondary'} hasMarginBottom={false} title="모두 지우기" onPress={onPressDelete} />
      </View>
      <View style={styles.between2}>
        <View style={styles.searched}>
          <Text style={styles.text}>스타벅스</Text>
          <Icon name="close" size={20} color="#898989" />
        </View>
        <View style={styles.searched}>
          <Text style={styles.text}>교환권</Text>
          <Icon name="close" size={20} color="#898989" onPress={onPressDelete} />
        </View>
      </View>
      <View style={styles.between2}>
        <View style={styles.searched}>
          <Text style={styles.text}>치킨</Text>
          <Icon name="close" size={20} color="#898989" />
        </View>
        <View style={styles.searched}>
          <Text style={styles.text}>무료나눔</Text>
          <Icon name="close" size={20} color="#898989" onPress={onPressDelete} />
        </View>
      </View>

      {/* 원래 소스
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
      </View> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex: {
    // paddingTop: 16,
    // paddingBottom: 12,
    flexDirection: 'row',
  },
  flex2: {
    padding: 12,
  },
  between: {
    // width: '50'
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  between2: {
    // width: '50'
    flex: 2,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // justifyContent: 'space-evenly',
    // marginBottom: 16,
    borderBottomColor: '#fefefe',
    borderBottomWidth: 1,
    borderStyle: 'solid',
  },
  row2: {
    padding: 14,
    justifyContent: 'space-between',
    // flexDirection: 'row',
    flex: 1,
    // alignItems: 'center',
  },
  bold: {
    color: '#757575',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    color: '#757575',
    fontSize: 14,
    // lineHeight: 18,
  },
  // row: {
  //   paddingTop: 10,
  //   // textAlign: 20,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   // justifyContent: 'flex-start',
  //   // paddingVertical: 10,
  // },
});

export default SearchScreen;
