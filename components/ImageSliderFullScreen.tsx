import React, {useState, useRef, useEffect} from 'react';
import {View, Image, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Props {
  images: string[];
  currentIndex: number;
  onModalClose: () => void;
}

const ImageSliderFullScreen = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState<number>(props.currentIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({x: Dimensions.get('window').width * props.currentIndex, y: 0, animated: false});
    }
  }, [props]);

  const closeModal = () => {
    props.onModalClose();
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.closer}>
          <Icon name="close" size={30} color="#fefefe" onPress={closeModal} />
        </View>
        <ScrollView
          ref={scrollViewRef}
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
                <View style={styles.imgView} key={i}>
                  <Image style={styles.image} source={{uri: image}} resizeMethod="auto" resizeMode="contain" />
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: Dimensions.get('window').width,
    height: '100%',
    flexDirection: 'column',
    backgroundColor: '#000000',
  },
  closer: {
    position: 'absolute',
    top: 0,
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    zIndex: 10,
  },
  imgView: {
    flex: 1,
    width: Dimensions.get('screen').width,
    height: '100%',
    margin: 0,
    padding: 0,
    backgroundColor: '#000000',
  },
  image: {
    width: Dimensions.get('screen').width,
    height: 'auto',
    aspectRatio: 1,
  },
  headerContainer: {
    width: '100%',
    height: 30,
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    width: '100%',
    height: 30,
    position: 'absolute',
    bottom: 10,
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

export default ImageSliderFullScreen;
