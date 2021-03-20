import { useEffect, useReducer, useCallback } from 'react';
import { fetchComments, fetchItem } from '../utils/api';

function commentsReducer( state, action ) {
  switch ( action.type ) {
    case 'fetch':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'success':
      return {
        comments: action.comments,
        loading: false,
        error: null
      };
    case 'error':
      return {
        ...state,
        loading: false,
        error: action.message
      }
    default:
      throw new Error( 'This action type not supported by User Reducer' );
  }
}

export default function useFetchComments( id ) {
  const [state, dispatch] = useReducer(
    commentsReducer,
    {
      comments: {},
      error: null,
      loading: false
    }
  );

  const fetchCommentData = ( commentId ) => {
    return fetchItem( commentId )
      .catch( ({ message }) => {
        dispatch({ type: 'error', message });
      } );
  };

  const fetchCommentChildren = ( kids ) => {
    return fetchComments( kids )
      .catch( ({ message }) => {
        dispatch({ type: 'error', message });
      });
  };

  const fetchUserCommentData = useCallback( async () => {
    const comments = await fetchCommentData( id );
    const kids = comments.kids;
    const commentPosts = await fetchCommentChildren( kids );

    dispatch({
      type: 'success',
      comments: {
        ...comments,
        posts: commentPosts
      }
    });
  }, [ id ] );

  /**
   * Promise all for both to finish fetching what we desire
   */
  useEffect( () => {
    dispatch({ type: 'fetch' });

    fetchUserCommentData();
  }, [ fetchUserCommentData ] );

  const { comments, error, loading } = state;

  return [
   comments, error, loading
  ];
}
