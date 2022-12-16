import React from 'react';
import {StyleSheet, View, Pressable, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type IconLeftButtonProps = {
  name: string;
  color: string;
  onPress: any;
};

function TopLeftButton({name, color, onPress}: IconLeftButtonProps) {
  return (
    <View style={styles.block}>
      <Pressable
        style={({pressed}) => [
          styles.circle,
          Platform.OS === 'ios' &&
            pressed && {
              opacity: 0.3,
            },
        ]}
        onPress={onPress}
        android_ripple={{color: '#347deb'}}>
        <Icon name={name} color={color} size={24} />
      </Pressable>
    </View>
  );
}

TopLeftButton.defaultProps = {
  color: '#347deb',
};

const styles = StyleSheet.create({
  block: {
    marginLeft: -8,
    borderRadius: 24,
    overflow: 'hidden',
  },
  circle: {
    height: 48,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TopLeftButton;
