import React from 'react';
import queryString from 'query-string';
import { fetchUser, fetchPosts } from '../utils/api';
import { ThemeConsumer } from '../contexts/theme';
import Loading from './Loading';
import PostsList from './PostsList';

function UserProfile({ name, dateCreated, karma, about }) {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <>
          <h1 className="header">{name}</h1>
          <p className={`meta-info-${theme}`}>
            joined <strong>{new Date( dateCreated ).toUTCString()}</strong> and has <strong>{karma}</strong> karma
          </p>
          {about && <p>{about}</p>}
        </>
      )}
    </ThemeConsumer>
  );
}

export default class User extends React.Component {
  state = {
    user: {},
    error: null,
    loading: true
  };

  componentDidMount() {
    const { id } = queryString.parse( this.props.location.search );

    fetchUser( id )
      .then( data => {
        this.setState(({ user }) => ({
          user: {
            created: data.created,
            id: data.id,
            karma: data.karma,
            about: data.about,
            submitted: data.submitted.slice( 0, 50 )
          },
          error: null,
          loading: false
        }));

        this.getUserPosts();
      } )
      .catch( ({ message }) => {
        this.setState({
          error: message,
          loading: false
        });
      } );
  }

  /**
   * Get the posts this user has made in the past
   */
  getUserPosts() {
    fetchPosts( this.state.user.submitted )
      .then( oldPosts => {
        this.setState(({ user }) => ({
          user: {
            ...user,
            posts: oldPosts
          }
        }));
      } )
      .catch( ({ message }) => {
        this.setState({
          error: message,
          loading: false
        });
      });
  }

  render() {
    const { user, error, loading } = this.state;
    const { id, about, created, karma, posts } = user;

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
}
