import React from 'react';
import {StyleSheet, View, Pressable, Text, Platform} from 'react-native';

type DabadaButtonProps = {
  onPress: any;
  title: string;
  hasMarginBottom: boolean;
  theme: 'primary' | 'secondary';
};

function CustomButton({onPress, title, hasMarginBottom, theme = 'primary'}: DabadaButtonProps) {
  const isPrimary = theme === 'primary';

  return (
    <View style={[styles.block, hasMarginBottom && styles.margin]}>
      <Pressable
        onPress={onPress}
        style={({pressed}) => [styles.wrapper, isPrimary && styles.primaryWrapper, Platform.OS === 'ios' && pressed && {opacity: 0.5}]}
        android_ripple={{
          color: isPrimary ? '#ffffff' : '#6200ee',
        }}>
        <Text style={[styles.text, isPrimary ? styles.primaryText : styles.secondaryText]}>{title}</Text>
      </Pressable>
    </View>
  );
}

CustomButton.defaultProps = {
  theme: 'primary',
};

const styles = StyleSheet.create({
  overflow: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  wrapper: {
    borderRadius: 4,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor 제거
  },
  primaryWrapper: {
    backgroundColor: '#6200ee',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'white',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#6200ee',
  },
  margin: {
    marginBottom: 58,
  },
  block: {
    flex: 1,
    zIndex: 0,
  },
});

export default CustomButton;
