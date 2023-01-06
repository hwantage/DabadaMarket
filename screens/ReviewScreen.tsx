import React, {useState, useEffect} from 'react';
import {View, StyleSheet, SafeAreaView, Text, TouchableOpacity, ScrollView, Image, TextInput} from 'react-native';
import TopLeftButton from '../components/common/TopLeftButton';
import Avatar from '../components/profile/Avatar';
import Profile from '../components/profile/Profile';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import {useRecoilState} from 'recoil';
import {authInfoProps, authInfoState} from '../recoil/authInfoAtom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DabadaButton from '../components/common/DabadaButton';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
//import {TextInput} from 'react-native-paper';

function ReviewScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);

  // useEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => <TopLeftButton name="arrow-back-ios" onPress={() => navigation.push('MyBuyScreen')} />,
  //   });
  // }, [navigation, authInfo]);

  const onPressBuy = () => {
    navigation.push('MyBuyScreen');
  };

  const [scrollHeight, setScrollHeight] = useState(null);
  return (
    <>
      <SafeAreaView style={styles.fullscreen}>
        <TouchableOpacity style={styles.touchFlex}>
          <Image style={styles.imageBox} />
          <View style={styles.flex3}>
            <Text style={styles.bold1}>knk 아워홈 식권 20매</Text>
            <View style={styles.row}>
              <Text style={styles.text}>거래한 이웃</Text>
              <Text style={styles.bold3}>badasea</Text>
            </View>
          </View>
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.touchFlex_noborder}>
            <Text style={styles.bold2}>
              hwan77님,{'\n'}badasea님과 거래가 어떠셨나요?{'\n'}
              <Text style={styles.text}>거래 선호도는 나만 볼 수 있어요.</Text>
            </Text>
          </View>
          <View style={styles.touchFlex_emoji}>
            <TouchableOpacity style={styles.flex4}>
              <Icon name="emoticon" color="#039DF4" size={70} />
              <Text style={styles.text}>좋아요!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex4}>
              <Icon name="emoticon-neutral" color="#b9b9b9" size={70} />
              <Text style={styles.text}>별로에요!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.flex4}>
              <Icon name="emoticon-sad" color="#b9b9b9" size={70} />
              <Text style={styles.text}>안좋아요!</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.flex}>
            <Text style={styles.bold1}>어떤 점이 좋았나요?</Text>
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="나눔을 해주셨어요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="상품상태가 설명한 것과 같아요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="상품설명이 자세해요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="좋은 상품을 저렴하게 판매해요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="시간 약속을 잘 지켜요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="응답이 빨라요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
            <BouncyCheckbox
              size={20}
              style={styles.row}
              fillColor="#039DF4"
              unfillColor="#FFFFFF"
              text="친절하고 매너가 좋아요."
              textStyle={{
                textDecorationLine: 'none',
                marginLeft: -8,
              }}
              innerIconStyle={{borderRadius: 4}}
              iconStyle={{borderRadius: 4}}
              onPress={(isChecked: boolean) => {}}
            />
          </View>
          <View style={styles.flex2}>
            <Text style={styles.bold1}>따뜻한 거래 경험을 알려주세요!</Text>
            <Text style={styles.text}>거래 선호도는 나만 볼 수 있어요.</Text>
            <TextInput style={styles.border} placeholder={'여기에 적어주세요. (선택사항)'} multiline />
            <DabadaButton hasMarginBottom={true} title="후기 보내기" onPress={onPressBuy} />
          </View>
        </ScrollView>
      </SafeAreaView>
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
  buttons: {
    margin: 24,
  },
  fullscreen: {
    flex: 1,
    //paddingHorizontal: 22,
    backgroundColor: '#ffffff',
  },
  touchFlex: {
    paddingVertical: 14,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    paddingHorizontal: 14,
    backgroundColor: '#fefefe',
  },
  touchFlex_noborder: {
    paddingTop: 16,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  touchFlex_emoji: {
    paddingVertical: 38,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flex: {
    // paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'column',
  },
  flex2: {
    flex: 1,
    paddingVertical: 36,
    paddingHorizontal: 16,
    // flexDirection: 'row',
  },
  flex3: {
    flex: 1,
    // paddingVertical: 0,
    // flexDirection: 'row',
  },
  flex4: {
    flex: 1,
    // width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: -30,
    // paddingVertical: 10,
    // flexDirection: 'row',
  },
  row: {
    paddingTop: 8,
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  mgT: {
    paddingVertical: 20,
  },
  border: {
    marginVertical: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfdfdf',
    borderRadius: 8,
    height: 50,
  },
  bold1: {fontSize: 16, fontWeight: 'bold', color: '#898989'},
  bold2: {fontSize: 20, fontWeight: 'bold'},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 14,
    color: '#898989',
  },
  button: {
    backgroundColor: 'transparent',
    color: '#039DF4',
    borderWidth: 1.5,
    borderRadius: 5,
    borderStyle: 'solid',
    height: 38,
    alignItems: 'center',
    borderBottomColor: '#039DF4',
    borderRightColor: '#039DF4',
    borderTopColor: '#039DF4',
    borderLeftColor: '#039DF4',
  },
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: 50,
    height: 50,
    borderRadius: 6,
    //backgroundColor: 'transparent',
    color: '#898989',
    marginRight: 12,
  },
  tag_soldout: {
    color: '#ffffff',
    backgroundColor: '#898989',
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#808080',
    borderTopColor: '#808080',
    borderLeftColor: '#808080',
    borderRightColor: '#808080',
    fontSize: 12,
    height: 24,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tag_reserve: {
    backgroundColor: '#ccc',
    borderRadius: 20,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderBottomColor: '#000',
    borderTopColor: '#000',
    fontSize: 12,
    height: 26,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
});

export default ReviewScreen;
