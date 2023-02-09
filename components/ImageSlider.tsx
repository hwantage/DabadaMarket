import React, {useState} from 'react';
import {View, Image, Text, StyleSheet, ScrollView, Dimensions, Pressable, Modal} from 'react-native';
import ImageSliderFullScreen from './ImageSliderFullScreen';
interface Props {
  images: string[];
}

const ImageSlider = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [dragging, setDragging] = useState(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const onPressImage = () => {
    !dragging && setModalVisible(true);
  };
  const onModalClose = () => {
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={e => {
          const contentOffset = e.nativeEvent.contentOffset;
          const viewSize = e.nativeEvent.layoutMeasurement;
          const index = Math.floor(contentOffset.x / viewSize.width);
          setCurrentIndex(index);
        }}>
        {props.images.length === 0 ? (
          <Image style={styles.image} source={require('../assets/user.png')} />
        ) : (
          props.images.map((image, i) => {
            return (
              <View key={i}>
                <Pressable
                  onPress={onPressImage}
                  onMoveShouldSetResponder={() => {
                    setDragging(true);
                    return true;
                  }}
                  onResponderMove={e => console.log('dragging', e.nativeEvent)}
                  onResponderRelease={() => setDragging(false)}>
                  <Image style={styles.image} source={{uri: image}} resizeMode="cover" />
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {props.images.map((_, i) => {
          return <Text key={i} style={[styles.dot, i === currentIndex ? styles.dotBlack : styles.dotWhite]} />;
        })}
      </View>
      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={onModalClose}>
        <ImageSliderFullScreen images={props.images} currentIndex={currentIndex} onModalClose={onModalClose} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width - 32,
    flexDirection: 'column',
  },
  imgView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
    borderRadius: 6,
  },
  dotsContainer: {
    width: '100%',
    height: 30,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  dotBlack: {
    backgroundColor: '#ffffff',
  },
  dotWhite: {
    backgroundColor: '#b9b9b9',
  },
});

export default ImageSlider;
