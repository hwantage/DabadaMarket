import React from 'react';
import {Text, StyleSheet, StyleProp, TextStyle} from 'react-native';

type DabadaTextProps = {
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  onPress?: () => void;
};

const DabadaText = (props: DabadaTextProps) => {
  return (
    <Text {...props} style={[styles.defaultFont, props.style]}>
      {props.children}
    </Text>
  );
};

/* 기본 텍스트 스타일 정의 */
const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'sans-serif-thin',
    fontWeight: '800',
    fontSize: 20,
    color: '#353535',
  },
});

export default DabadaText;
