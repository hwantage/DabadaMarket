import {useCallback, useEffect, useState} from 'react';
import {commentProps, getComments} from '../utils/informations';

export default function useComments(i_id: string) {
  const [comments, setComments] = useState<commentProps[] | undefined>(undefined);

  useEffect(() => {
    getComments(i_id).then(_comments => {
      setComments(_comments);
    });
  }, [i_id]);

  const onAddComment = useCallback(
    (comment: commentProps) => {
      setComments(comments?.concat(comment));
    },
    [comments],
  );

  const onRemoveComment = useCallback(
    (id: string) => {
      setComments(comments?.filter(info => info.ic_id !== id));
    },
    [comments],
  );

  const onUpdateComment = useCallback(
    (id: string, commentInfo: commentProps) => {
      // id가 일치하는 상품 찾아서 내용 변경
      const nextComment = comments?.map((info: commentProps) =>
        info.ic_id === id
          ? {
              //...p,
              ...commentInfo,
            }
          : info,
      );
      setComments(nextComment);
    },
    [comments],
  );
  return {
    comments,
    onAddComment,
    onUpdateComment,
    onRemoveComment,
  };
}
