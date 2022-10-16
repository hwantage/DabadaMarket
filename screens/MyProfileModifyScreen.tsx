import React from 'react';
import {KeyboardAvoidingView, Platform, StyleSheet} from 'react-native';
import {default as Text} from '../components/common/DabadaText';
import {SafeAreaView} from 'react-native-safe-area-context';
import ModifyProfile from '../components/profile/ModifyProfile';

function MyProfileModifyScreen() {
  return (
    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ios: 'padding'})}>
      <SafeAreaView style={styles.block}>
        <Text style={styles.title}>환영합니다!</Text>
        <Text style={styles.description}>프로필을 설정하세요.</Text>
        <ModifyProfile />
      </SafeAreaView>
    </KeyboardAvoidingView>
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
});

export default MyProfileModifyScreen;
