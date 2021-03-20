import React, { useState, useEffect, useReducer, useRef } from 'react';
import { fetchMainPosts } from '../utils/api';
import Loading from './Loading';
import { PostsList } from './PostsList';

function postsReducer( state, action ) {
  switch ( action.type ) {
    case 'success':
      return {
        ...state,
        [action.query]: action.data,
        error: null
      };
    case 'error':
      return {
        ...state,
        error: 'There was an error fetching the posts'
      };
    default:
      throw new Error( 'Action type not supported on this Posts component' );
  }
}

const initialState = {
  top: null,
  new: null,
  error: null
};

export default function Posts({ match }) {
  const [query, setQuery] = useState( '/' === match.path ? 'top' : '/new' === match.path ? 'new' : '' );
  const [state, dispatch] = useReducer( postsReducer, initialState );
  const fetchedPostLists = useRef( [] );

  useEffect( () => {
    const path = match.path;

    setQuery( query => {
      if ( '/' === path && 'top' !== query ) {
        return 'top';
      } else if ( '/new' === path && 'new' !== query ) {
        return 'new';
      }

      return query;
    } );
  }, [ match ] );

  /**
   * Fetch the API information we need
   */
  useEffect( () => {
    if ( ! fetchedPostLists.current.includes( query ) ) {
      fetchMainPosts( query )
        .then( data => {
          window.console.log( data );
          fetchedPostLists.current.push( query );
          dispatch({ type: 'success', query, data });
        } )
        .catch( ( error ) => {
          console.warn( `Error fetching posts: ${error}` );

          dispatch({ type: 'error' });
        });
    }
  }, [ query, fetchedPostLists ] );

  const { error } = state;

  const isLoading = () => ! state[query] && error === null;

  return (
    <article className="posts">
      {isLoading() && <Loading text="Fetching posts" />}

      {error && <p className="center-text error">{error}</p>}

      {state[query] && <PostsList posts={state[query]} />}
    </article>
  );
}
