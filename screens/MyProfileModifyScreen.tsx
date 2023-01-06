import React, {useState, useEffect} from 'react';
import {KeyboardAvoidingView, View, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import DabadaInput from '../components/common/DabadaInput';
import type {StackScreenProps} from '@react-navigation/stack';
import {authInfoDefault, authInfoProps} from '../recoil/authInfoAtom';
import {RootStackParamList} from './AppStack';
import DabadaButton from '../components/common/DabadaButton';
import {getUserInfo} from '../utils/auth';
// import {SafeAreaView} from 'react-native-safe-area-context';
import ModifyProfile from '../components/profile/ModifyProfile';
import Avatar from '../components/profile/Avatar';
import Profile from '../components/profile/Profile';
import Icon from 'react-native-vector-icons/MaterialIcons';

function MyProfileModifyScreen() {
  return (
    <>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ios: 'padding'})}>
        <SafeAreaView style={styles.block}>
          {/* <Text style={styles.title}>환영합니다!</Text> */}
          {/* <Text style={styles.description}>프로필을 설정하세요.</Text> */}
          <ModifyProfile />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
  },
  description: {
    marginTop: 16,
    fontSize: 21,
    color: '#757575',
  },
  fullscreen: {
    flex: 1,
    paddingHorizontal: 22,
  },
  flex: {
    // paddingVertical: 24,
    flex: 1,
    marginTop: 60,
    // justifyContent: 'flex-start',
    // alignItems: 'flex-start',
    // lineHeight: 20,
  },
  flex3: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingVertical: 10,
    // flexDirection: 'row',
  },
  avatar: {
    width: 20,
    height: 20,
  },
  flex4: {
    // flex: 1,
    width: '100%',
    // alignItems: 'flex-start',
    // justifyContent: 'flex-start',
    // marginBottom: -30,
    // paddingVertical: 10,
    flexDirection: 'row',
  },
  row: {
    paddingTop: 10,
    // textAlign: 20,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'flex-start',
    // paddingVertical: 10,
  },
  mgT: {
    paddingVertical: 20,
  },

  // flex2: {paddingVertical: 24, flexDirection: 'row', alignItems: 'flex-end'},
  bold1: {marginTop: 16, marginLeft: 16, fontSize: 18, fontWeight: 'bold', color: '#039DF4'},
  bold2: {fontSize: 18, fontWeight: 'bold', marginBottom: 14},
  bold3: {marginLeft: 8, fontSize: 18, fontWeight: 'bold'},
  dot: {paddingHorizontal: 4, marginTop: 8},
  text: {
    fontSize: 16,
    color: '#039DF4',
    marginTop: 6,
  },
  sellProduct: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderTopColor: '#b9b9b9',
    borderBottomColor: '#b9b9b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  review: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#b9b9b9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  icon: {
    position: 'absolute',
    top: 120,
    right: 140,
  },
});

export default MyProfileModifyScreen;
