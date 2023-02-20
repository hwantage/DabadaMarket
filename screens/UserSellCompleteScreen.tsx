import React, {useEffect, useState, Fragment} from 'react';
import {ActivityIndicator, FlatList, ListRenderItem, Pressable, RefreshControl, StyleSheet, View} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import useProducts from '../hooks/useProducts';
import ProductAddButton from '../components/common/ProductAddButton';
import {StackNavigationProp, StackScreenProps} from '@react-navigation/stack';
import Avatar from '../components/profile/Avatar';
import {RootStackParamList} from './AppStack';
import {useNavigation} from '@react-navigation/native';
import {getUserInfo} from '../utils/auth';
import {authInfoDefault, authInfoProps} from '../recoil/authInfoAtom';

type UserSellCompleteScreenProps = StackScreenProps<RootStackParamList, 'UserSellCompleteScreen'>;

function UserSellCompleteScreen({route}: UserSellCompleteScreenProps) {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {u_id} = route.params;
  const [user, setUser] = useState<authInfoProps>(authInfoDefault);
  const products = useProducts({u_id: u_id, querymode: 'sell_complete'});
  const [loading, setLoading] = useState(true);

  const productsReady = products !== undefined;

  useEffect(() => {
    //console.log('useeffect of UserSellCompleteScreen');
    if (productsReady) {
      setLoading(false);
    }
  }, [productsReady]);

  useEffect(() => {
    //console.log('useeffect of UserSellCompleteScreen2');
    getUserInfo(u_id).then(_user => {
      setUser(_user);
    });
  }, [u_id]);

  const renderItem: ListRenderItem<productProps> = ({item}) => <ProductCard product={item} querymode="sell" />;
  const listFooterComponent: any = !products.noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={products.onRefresh} refreshing={products.refreshing} colors={['#347deb']} />;

  return (
    <>
      <View style={styles.profile2}>
        <Pressable
          style={styles.profile}
          onPress={() => {
            navigation.pop();
          }}>
          <Avatar source={user?.u_photoUrl ? {uri: user?.u_photoUrl} : require('../assets/user.png')} />
          <Text style={styles.nickname}>{user?.u_nickname}</Text>
        </Pressable>
      </View>
      <View style={styles.flex1}>
        {!loading && products !== undefined && products.products?.length === 0 ? (
          <>
            <Text style={styles.text}>판매중인 상품이 존재하지 않습니다.</Text>
            <ProductAddButton />
          </>
        ) : (
          <FlatList<productProps> data={products.products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={products.onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flex1: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  text: {paddingTop: 40, textAlign: 'center', fontSize: 15},
  profile2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 14,
  },
  nickname: {
    lineHeight: 16,
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default UserSellCompleteScreen;
