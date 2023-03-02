import React from 'react';
import {StyleSheet, SafeAreaView, ScrollView} from 'react-native';
import ModifyProfile from '../components/profile/ModifyProfile';

function MyProfileModifyScreen() {
  return (
    <>
      <ScrollView style={styles.scrollView}>
        <SafeAreaView style={styles.block}>
          <ModifyProfile />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  block: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MyProfileModifyScreen;
