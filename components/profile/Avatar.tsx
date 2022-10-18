import React from 'react';
import {Image} from 'react-native';

export interface avatarProps {
  source?: {} | null;
  size: number;
}

function Avatar({source, size}: avatarProps) {
  return (
    <Image
      source={source || require('../../assets/user.png')}
      resizeMode="cover"
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

Avatar.defaultProps = {
  size: 32,
};

export default Avatar;
