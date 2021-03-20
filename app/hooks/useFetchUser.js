import { useEffect, useReducer, useCallback } from 'react';
import { fetchUser, fetchPosts } from '../utils/api';

function userReducer( state, action ) {
  switch ( action.type ) {
    case 'fetch':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'success':
      return {
        user: {
          created: action.created,
          id: action.id,
          karma: action.karma,
          about: action.about,
          submitted: action.submitted,
          posts: action.posts
        },
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

export default function useFetchUser( id ) {
  const [state, dispatch] = useReducer(
    userReducer,
    {
      user: {},
      error: null,
      loading: false
    }
  );

  const fetchUserData = ( userId ) => {
    return fetchUser( userId )
      .catch( ({ message }) => {
        dispatch({ type: 'error', message });
      } );
  };

  const fetchUserPostData = ( submitted ) => {
    return fetchPosts( submitted )
      .catch( ({ message }) => {
        dispatch({ type: 'error', message });
      });
  };

  const fetchUserProfile = useCallback( async () => {
    const userId = await fetchUserData( id );
    const submitted = userId.submitted.slice( 0, 50 );
    const userPosts = await fetchUserPostData( submitted );

    dispatch({
      type: 'success',
      created: userId.created,
      id: userId.id,
      karma: userId.karma,
      about: userId.about,
      submitted,
      posts: userPosts
    });
  }, [ id ] );

  /**
   * Promise all for both to finish fetching what we desire
   */
  useEffect( () => {
    dispatch({ type: 'fetch' });

    fetchUserProfile();
  }, [ fetchUserProfile ] );

  const { user, error, loading } = state;

  return [
   user, error, loading
  ];
}
