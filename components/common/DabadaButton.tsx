import React from 'react';
import {StyleSheet, View, Pressable, Platform} from 'react-native';
import {default as Text} from './/DabadaText';

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
          color: isPrimary ? '#ffffff' : '#039DF4',
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
  wrapper: {
    borderRadius: 4,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryWrapper: {
    backgroundColor: '#039DF4',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'white',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#039DF4',
    fontSize: 14,
    paddingHorizontal: 0,
    paddingVertical: 0,
    flex: 0,
  },
  margin: {
    marginBottom: 58,
  },
  block: {
    zIndex: 0,
  },
});

export default CustomButton;
