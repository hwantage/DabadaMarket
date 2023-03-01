import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, Pressable, ScrollView, ActivityIndicator, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {StackNavigationProp} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {default as Text} from '../common/DabadaText';
import Avatar from '../profile/Avatar';
import ImageSlider from '../ImageSlider';
import {getUserInfo} from '../../utils/auth';
import {authInfoProps, authInfoState} from '../../recoil/authInfoAtom';
import moment from 'moment-timezone';
import {useTranslation} from 'react-i18next';
import {commentProps, createComment, informationProps, removeComment, updateComment} from '../../utils/informations';
import DabadaInput from '../common/DabadaInput';
import DabadaButton from '../common/DabadaButton';
import useComments from '../../hooks/useComments';
import uuid from 'react-native-uuid';
import {useRecoilState} from 'recoil';

interface InformationProps {
  information: informationProps;
}

function Information({information}: InformationProps) {
  const {t} = useTranslation();
  const [user, setUser] = useState<authInfoProps>(); // 등록자 정보
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [commentContents, setCommentContents] = useState('');
  const [updatedComment, setUpdatedComment] = useState('');
  const {comments, onAddComment, onUpdateComment, onRemoveComment} = useComments(information.i_id);
  const [authInfo] = useRecoilState<authInfoProps>(authInfoState);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const handleEditComment = (commentId: string) => {
    setEditingCommentId(commentId);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
  };

  const handleSaveComment = (commentId: string) => {
    const commentInfo: commentProps | undefined = comments?.find(item => {
      return item.ic_id === commentId;
    });
    if (commentInfo !== undefined) {
      onUpdateComment(commentId, {...commentInfo, ic_contents: updatedComment}); // 객체 관리
      updateComment(commentId, {...commentInfo, ic_contents: updatedComment}); // 디비 저장
    }
    setEditingCommentId(null);
  };

  const setUserAvatar = useCallback(async () => {
    await getUserInfo(information.u_id).then(_user => {
      setUser(_user);
      setLoading(false);
    });
  }, [information.u_id]);

  useEffect(() => {
    setUserAvatar();
  }, [comments, setUserAvatar]);

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

  const deleteComment = (id: string) => {
    Alert.alert(
      t('common.delete', '삭제'),
      t('msg.deleteSure', '정말로 삭제하시겠어요?'),
      [
        {
          text: t('common.cancel', '취소'),
          onPress: () => console.log('Delete Pressed'),
          style: 'cancel',
        },
        {
          text: t('common.delete', '삭제'),
          onPress: () => {
            onRemoveComment(id);
            removeComment(id);
          },
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  };

  const onSubmitComment = () => {
    const regdate = moment().format('YYYY-MM-DD HH:mm:ss');
    const commentInfo = {
      ic_id: uuid.v4().toString(),
      i_id: information.i_id,
      u_id: authInfo.u_id,
      u_nickname: authInfo.u_nickname,
      u_photoUrl: authInfo.u_photoUrl,
      ic_contents: commentContents,
      ic_like: 0,
      ic_regdate: regdate,
    };
    onAddComment(commentInfo); // 객체 관리
    createComment(commentInfo); // 디비 저장
    setCommentContents(''); // state 초기화
  };

  return (
    <>
      {loading || information?.i_id === '' ? (
        <View style={styles.spinnerWrapper}>
          <ActivityIndicator size={32} color="#347deb" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.profile2}>
            <Pressable
              style={styles.profile}
              onPress={() => {
                navigation.push('UserHomeScreen', {u_id: information?.u_id});
              }}>
              <Avatar source={user?.u_photoUrl ? {uri: user?.u_photoUrl} : require('../../assets/user.png')} />
              <Text style={styles.nickname}>{user?.u_nickname}</Text>
            </Pressable>
            <Text style={[styles.text, styles.hour]}>
              {information?.i_regdate} ({moment(information?.i_regdate).fromNow()})
            </Text>
          </View>
          <View style={styles.review}>
            <Text style={i_category_css}>{i_category_str}</Text>
          </View>
          <View style={styles.row2}>
            <Text style={styles.iTxt}>{information?.i_contents}</Text>
          </View>
          <View style={styles.iconBox}>
            <Icon name="chat" color="#898989" size={16} />
            <Text style={styles.iTxt}>{information?.i_comment_cnt}</Text>
            <Icon name="remove-red-eye" color="#898989" size={16} />
            <Text style={styles.iTxt}>{information?.i_view}</Text>
          </View>
          {information?.i_images.length > 0 && (
            <View style={styles.head}>
              <ImageSlider images={information?.i_images?.map(item => item.ii_url)} />
            </View>
          )}
          {comments?.map((item: any, index: number) => (
            <View key={index}>
              <View style={styles.profileComment2}>
                <Pressable
                  style={styles.profileComment}
                  onPress={() => {
                    navigation.push('UserHomeScreen', {u_id: item?.u_id});
                  }}>
                  <Avatar source={item?.u_photoUrl ? {uri: item?.u_photoUrl} : require('../../assets/user.png')} />
                  <Text style={styles.nickname}>{item?.u_nickname}</Text>
                </Pressable>
                <Text style={[styles.text, styles.hour]}>{moment(item?.ic_regdate).fromNow()}</Text>
              </View>
              <View style={styles.commentBox}>
                <View style={styles.delArea}>
                  {authInfo.u_id === item.u_id && (
                    <>
                      {editingCommentId === item.ic_id ? (
                        <>
                          <Icon name="save" color="#898989" size={16} onPress={() => handleSaveComment(item.ic_id)} />
                          <Icon name="close" color="#898989" size={16} onPress={() => handleCancelEditComment()} />
                        </>
                      ) : (
                        <>
                          <Icon name="edit" color="#898989" size={16} onPress={() => handleEditComment(item.ic_id)} />
                          <Icon name="delete-forever" color="#898989" size={16} onPress={() => deleteComment(item.ic_id)} />
                        </>
                      )}
                    </>
                  )}
                </View>
                {editingCommentId === item.ic_id ? <DabadaInput style={styles.commentsTxtInput} maxLength={1000} defaultValue={item.ic_contents} placeholder={t('msg.pleaseInputComment', '댓글을 작성해 주십시오.')} onChangeText={setUpdatedComment} returnKeyType="default" multiline={true} numberOfLines={3} hasMarginBottom={true} /> : <Text style={styles.commentsTxt}>{item?.ic_contents}</Text>}
              </View>
            </View>
          ))}
          <View style={styles.profileComment2} />
          <Text style={styles.commentTitleText}>{t('newCommentWrite', '신규 댓글 작성')}</Text>
          <DabadaInput style={styles.input} maxLength={1000} placeholder={t('msg.pleaseInputComment', '댓글을 작성해 주십시오.')} onChangeText={setCommentContents} returnKeyType="default" multiline={true} numberOfLines={3} hasMarginBottom={true} />
          <DabadaButton theme={'secondary'} hasMarginBottom={false} title={t('button.commentSend', '댓글 저장')} onPress={onSubmitComment} />
        </ScrollView>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  paddingBlock: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row2: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  iTxt: {
    lineHeight: 16,
    fontSize: 14,
    fontWeight: 'bold',
    marginHorizontal: 3,
    color: '#898989',
  },
  commentTitleText: {
    lineHeight: 16,
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 3,
    color: '#898989',
    marginLeft: 20,
    marginTop: 10,
  },
  buttons: {
    marginRight: -16,
    padding: 12,
    width: 100,
    fontSize: 10,
  },
  iconBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    justifyContent: 'flex-end',
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 16,
  },
  head2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    height: 60,
  },
  profile2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 14,
  },
  profileComment2: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#dfdfdf',
    borderBottomColor: '#dfdfdf',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20,
  },
  profileComment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
    marginVertical: 4,
  },
  commentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 1,
    marginLeft: 25,
    marginRight: 20,
    marginBottom: 5,
  },
  bold: {fontSize: 18, fontWeight: 'bold', color: '#606060'},
  hour: {
    paddingRight: 16,
  },
  nickname: {
    lineHeight: 16,
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  text: {
    color: '#606060',
    fontSize: 12,
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
  spinnerWrapper: {
    marginTop: 64,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  review: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingTop: 5,
  },
  input: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    textAlignVertical: 'top',
    paddingBottom: 2,
    height: 60,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfdfdf',
    color: '#606060',
    marginLeft: 20,
    marginRight: 20,
  },
  delArea: {
    width: 35,
    flexDirection: 'row',
  },
  commentsTxt: {
    color: '#757575',
    fontSize: 12,
    lineHeight: 16,
    marginRight: 20,
  },
  commentsTxtInput: {
    backgroundColor: 'transparent',
    paddingHorizontal: 5,
    textAlignVertical: 'top',
    paddingBottom: 2,
    height: 60,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#dfdfdf',
    color: '#606060',
    marginLeft: 0,
    marginRight: 20,
    fontSize: 12,
    width: '90%',
  },
});

export default Information;
