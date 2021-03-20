import React, { useContext } from 'react';
import queryString from 'query-string';
import ThemeContext from '../contexts/theme';
import Loading from './Loading';
import { PostsList } from './PostsList';
import { getFormattedDate } from '../utils/date';
import useFetchUser from '../hooks/useFetchUser';

function UserProfile({ name, dateCreated, karma, about }) {
  const theme = useContext( ThemeContext );

  return (
    <>
      <h1 className="header">{name}</h1>
      <p className={`meta-info-${theme}`}>
        joined <strong>{getFormattedDate( dateCreated )}</strong> and has <strong>{karma}</strong> karma
      </p>
      {about && <p dangerouslySetInnerHTML={{__html: about}} />}
    </>
  );
}

export default function User({ location }) {
  const { id: userId } = queryString.parse( location.search );
  const [user, error, loading] = useFetchUser( userId );
  const { about, id, created, karma, posts } = user;

  return (
    <>
      {! loading && <UserProfile
        name={id}
        dateCreated={created}
        karma={karma}
        about={about}
      />}

      {error && <p className="error-message">{error}</p>}

      {loading && <Loading text="Fetching user profile" />}

      {user.posts && (
        <>
          <h2>Posts</h2>
          <PostsList posts={posts} />
        </>
      )}
    </>
  );
}
