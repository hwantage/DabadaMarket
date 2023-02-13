import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {ActivityIndicator, Button, FlatList, ListRenderItem, RefreshControl, StyleSheet} from 'react-native';
import TopRightButton from '../components/common/TopRightButton';
import ProductCard from '../components/product/ProductCard';
import {productProps} from '../utils/products';
import SplashScreen from 'react-native-splash-screen';
import useProducts from '../hooks/useProducts';
import adminKeyData from '../dabadamarket-firebase-adminkey.json';
import messaging from '@react-native-firebase/messaging';
function ProductListScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const {products, noMoreProduct, refreshing, onLoadMore, onRefresh} = useProducts({});

  const productsReady = products !== undefined;

  useEffect(() => {
    if (productsReady) {
      SplashScreen.hide();
    }
  }, [products, productsReady]);

  /* 우측 상단 이미지 (검색) */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <>
          {/* <Button onPress={getAuthToken} title="TEST" /> */}
          <TopRightButton name="search" onPress={() => navigation.push('SearchScreen')} />
        </>
      ),
    });
  }, [navigation]);

  const getAuthToken = async () => {
    // POST Request (To get Access Token)
    let url = 'https://accounts.google.com/o/oauth2/token';

    let postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      },
      data: {
        client_id: adminKeyData.client_id,
        client_secret: adminKeyData.private_key,
        redirect_uri: adminKeyData.token_uri,
        grant_type: adminKeyData.type,
      },

      redirect: 'follow',
    };
    // var authToken = fetch(url, postOptions);

    let response = await fetch(url, postOptions);
    console.log('TOKEN 123', response);
  };

  const sendMessage = async () => {
    await sendPushNotification('eQhFz9uhTiqBsSn0SZGsgU:APA91bEY3XLYmEXW2OEupRgIuI10oATNo13LTvH_Nm7N3ZNSRYhECB-sEK3afCB5s9edMNvAIbIaeyVhPqX6xak9Gbrvvy_hNIXFALZ6HHrJNatZuhMQ0-AJIpdLkyNh2_IBrw8MJ7E7', '이게 제목?!', '이거뭔데');
  };
  const renderItem: ListRenderItem<productProps> = ({item}) => {
    return productsReady ? <ProductCard product={item} querymode={null} /> : <></>;
  };
  const listFooterComponent: any = !noMoreProduct && <ActivityIndicator style={styles.spinner} size={32} color="#347deb" />;
  const listRefreshControl: any = <RefreshControl onRefresh={onRefresh} refreshing={refreshing} colors={['#347deb']} />;

  return <FlatList<productProps> data={products} renderItem={renderItem} keyExtractor={item => item.p_id} contentContainerStyle={styles.container} onEndReached={onLoadMore} onEndReachedThreshold={0.75} refreshControl={listRefreshControl} ListFooterComponent={listFooterComponent} />;
}

export const sendPushNotification = async (token, title, body) => {
  //console.log("token==>", token);

  const FIREBASE_API_KEY = 'ya29.a0AVvZVsoOHEZQ7Ob3La66dtmjJ-nkpnt56455TR6gBA0L7H0kUNgGFKaqDyL6mm_ins_CAtDUxsO5u7LIICG3lOh5ZhQLvLmd6ngoSzu92Ox79i2KuTHNhYf6iMJz_gVOkwhS80YzqJ3Wo60DJFClh8-F5rLHaCgYKAfYSARASFQGbdwaICZWd94zcbrQP0lYHB-nsGg0163';

  // const message = {
  //   registration_ids: [token],
  //   notification: {
  //     title: title,
  //     body: body,
  //     vibrate: 1,
  //     sound: 1,
  //     show_in_foreground: true,
  //     priority: 'high',
  //     content_available: true,
  //   },
  // };

  const message = {
    message: {
      token,
      notification: {
        body,
        title,
      },
    },
  };

  let headers = new Headers({
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + FIREBASE_API_KEY,
  });

  let response = await fetch('https://fcm.googleapis.com/v1/projects/dabadamarket/messages:send', {
    method: 'POST',
    headers,
    body: JSON.stringify(message),
  });
  // console.log("=><*", response);
  response = await response.json();
  console.log('fcmTEST', response);
  //  console.log("=><*", response);
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  spinner: {
    height: 64,
  },
});

export default ProductListScreen;
