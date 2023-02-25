import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import type {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import {getUserInfo} from '../utils/auth';
import Avatar from '../components/profile/Avatar';
import {authInfoDefault, authInfoProps} from '../recoil/authInfoAtom';
import {RootStackParamList} from './AppStack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useProducts from '../hooks/useProducts';
import {useNavigation} from '@react-navigation/native';

type UserHomeScreenProps = StackScreenProps<RootStackParamList, 'UserHomeScreen'>;

function UserHomeScreen({route}: UserHomeScreenProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [user, setUser] = useState<authInfoProps>(authInfoDefault);
  const {u_id} = route.params;
  const products = useProducts({u_id: u_id, querymode: 'sell'});
  const products_complete = useProducts({u_id: u_id, querymode: 'sell_complete'});

  useEffect(() => {
    getUserInfo(u_id).then(_user => {
      setUser(_user);
    });
  }, [u_id]);

  const onPressSell = () => {
    navigation.push('UserSellScreen', user);
  };

  const onPressComplete = () => {
    navigation.push('UserSellCompleteScreen', user);
  };

  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <View style={styles.flex}>
          <Avatar source={user?.u_photoUrl && {uri: user?.u_photoUrl}} size={60} />
          <Text style={styles.bold1}>{user?.u_nickname}</Text>
        </View>
        <TouchableOpacity onPress={onPressSell}>
          <View style={styles.sellProduct}>
            <View style={styles.flex}>
              <Text style={styles.bold2}>판매중인 상품</Text>
              <Text style={styles.bold3}>{products.productCnt}개</Text>
            </View>
            <Icon name="chevron-right" size={30} color="#898989" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressComplete}>
          <View style={styles.review}>
            <View style={styles.flex}>
              <Text style={styles.bold2}>거래 완료 상품</Text>
              <Text style={styles.bold3}>{products_complete.productCnt_complete}개</Text>
            </View>
            <Icon name="chevron-right" size={30} color="#898989" />
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
  },
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flex2: {
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    marginLeft: 16,
  },
  bold1: {marginTop: 16, marginLeft: 16, fontSize: 18, fontWeight: 'bold'},
  bold2: {fontSize: 18, fontWeight: 'bold'},
  bold3: {marginLeft: 16, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  sellProduct: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  review: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttons: {
    margin: 24,
  },
});

export default UserHomeScreen;
