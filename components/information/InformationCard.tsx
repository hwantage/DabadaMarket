import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import moment from 'moment-timezone';
import {useTranslation} from 'react-i18next';
import {informationProps, informationPropsDefault} from '../../utils/informations';

interface InformationCardProps {
  information: informationProps;
}

function InformationCard({information: props}: InformationCardProps) {
  const {t} = useTranslation();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [information, setInformation] = useState<informationProps>(informationPropsDefault);

  useEffect(() => {
    setInformation(props);
  }, [props]);

  const onPressInformationCard = () => {
    navigation.navigate('InformationDetailScreen', {information: information});
  };

  let i_category_str = ''; // 1 : 정보, 2 : 질문, 3 : 일상 생활, 4 : 넋두리
  let i_category_css = {};

  switch (information.i_category) {
    case 1:
      i_category_str = t('infocategory.c1', '정보');
      i_category_css = styles.tag_c1;
      break;
    case 2:
      i_category_str = t('infocategory.c2', '질문');
      i_category_css = styles.tag_c2;
      break;
    case 3:
      i_category_str = t('infocategory.c3', '일상 생활');
      i_category_css = styles.tag_c3;
      break;
    case 4:
      i_category_str = t('infocategory.c4', '넋두리');
      i_category_css = styles.tag_c4;
      break;
    case 90:
      i_category_str = t('infocategory.c90', '다바다 소식');
      i_category_css = styles.tag_c91;
      break;
    case 91:
      i_category_str = t('infocategory.c91', '이벤트');
      i_category_css = styles.tag_c91;
      break;
  }

  return (
    <>
      <View style={styles.block}>
        <TouchableOpacity style={styles.touchFlex} onPress={() => onPressInformationCard()}>
          <View style={styles.review}>
            <Text style={i_category_css}>{i_category_str}</Text>
            <Text style={styles.text}>{information.i_regdate !== null ? moment(information.i_regdate).fromNow() : ''}</Text>
          </View>
          <View style={styles.review}>
            <View style={styles.flex3}>
              <View style={styles.review}>
                <Text style={styles.bold1}>{information.i_contents.length > 100 ? information.i_contents.substring(0, 100) + '...' : information.i_contents}</Text>
              </View>
            </View>
          </View>
          {information.i_images.length > 0 && <Image source={information.i_images.length > 0 ? {uri: information.i_images[0].ii_url} : require('../../assets/image.png')} style={styles.imageBox} resizeMethod="resize" resizeMode="cover" />}

          <View style={styles.review}>
            <Text style={styles.p_regdate}>{information.i_nickname}</Text>
            <View style={styles.iconBox}>
              <Icon name="chat" color="#898989" size={16} />
              <Text style={styles.p_num}>{information.i_comment_cnt}</Text>
              <Icon name="remove-red-eye" color="#898989" size={16} />
              <Text style={styles.p_num}>{information.i_view}</Text>
            </View>
          </View>
          {/*information.i_images.map((item: any, index: number) => (
            <Image key={index} source={information.i_images.length > 0 ? {uri: information.i_images[index].ii_url} : require('../../assets/image.png')} style={styles.imageBox} resizeMethod="resize" resizeMode="cover" />
          ))*/}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    paddingVertical: 24,
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  flex2: {
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  block: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#dfdfdf',
    backgroundColor: '#ffffff',
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
  },
  p_title: {
    lineHeight: 26,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  p_badatype: {
    lineHeight: 16,
    fontSize: 10,
    fontWeight: 'bold',
  },
  p_price: {
    lineHeight: 17,
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 3,
    color: 'black',
  },
  p_num: {
    lineHeight: 17,
    fontSize: 16,
    marginHorizontal: 3,
    color: '#898989',
  },
  p_regdate: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 12,
    alignItems: 'center',
  },
  touchFlex: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  flex3: {
    flex: 1,
  },
  text: {
    marginTop: 2,
    fontSize: 12,
    color: '#b0b0b0',
  },
  bold1: {marginTop: 4, fontSize: 14, fontWeight: 'bold', color: '#898989', lineHeight: 16},
  textStatus: {marginTop: 4, fontSize: 12, fontWeight: 'bold', color: '#166de0', marginRight: 40, marginLeft: 40},
  textReview1: {marginTop: 4, fontSize: 12, fontWeight: 'bold', color: '#166de0'},
  textReview2: {marginTop: 4, fontSize: 12, fontWeight: 'bold', color: 'black'},
  imageBox: {
    backgroundColor: '#cdcdcd',
    alignItems: 'flex-start',
    width: '100%',
    height: 100,
    borderRadius: 6,
    color: '#898989',
    marginRight: 12,
    marginTop: 10,
  },
  review: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  review2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 6,
    marginTop: 5,
  },
  tag_c1: {
    color: '#ffffff',
    backgroundColor: '#ff9933',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ff9933',
    fontSize: 12,
    fontWeight: 'bold',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tag_c2: {
    color: '#ffffff',
    backgroundColor: '#ff4dff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ff4dff',
    fontSize: 12,
    fontWeight: 'bold',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tag_c3: {
    color: '#ffffff',
    backgroundColor: '#3366ff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#3366ff',
    fontSize: 12,
    fontWeight: 'bold',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tag_c4: {
    color: '#ffffff',
    backgroundColor: '#808080',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#808080',
    fontSize: 12,
    fontWeight: 'bold',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  tag_c91: {
    color: '#ffffff',
    backgroundColor: '#e95945',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#e95945',
    fontSize: 12,
    fontWeight: 'bold',
    height: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
});

export default InformationCard;
