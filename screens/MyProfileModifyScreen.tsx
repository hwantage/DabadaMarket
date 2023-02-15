import React from 'react';
import {KeyboardAvoidingView, StyleSheet, SafeAreaView, Platform} from 'react-native';
import ModifyProfile from '../components/profile/ModifyProfile';

function MyProfileModifyScreen() {
  return (
    <>
      <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.select({ios: 'padding'})}>
        <SafeAreaView style={styles.block}>
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
});

export default MyProfileModifyScreen;
