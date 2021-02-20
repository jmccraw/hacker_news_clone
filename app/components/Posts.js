import React from 'react';
import { Link } from 'react-router-dom';
import { fetchMainPosts } from '../utils/api';
import Loading from './Loading';
import { ThemeConsumer } from '../contexts/theme';
import PropTypes from 'prop-types';

function PostsList({ posts }) {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <ul className="space-around">
          {posts.map( post => {
            const { by, id, kids, time, title, url } = post;

            return (
              <li className="post" key={id}>
                <a
                  className="link"
                  href={url}
                >
                  {title}
                </a>
                <p className={`meta-info-${theme}`}>
                  <span>by <Link
                      to={{
                        pathname: '/user',
                        search: `?id=${id}`
                      }}
                    >
                      {by}
                    </Link>
                  </span>
                  <span> on {new Date(time).toUTCString()} </span>
                  <span>with <Link
                      to={{
                        pathname: '/post',
                        search: `?id=${id}`
                      }}
                    >
                      {! kids ? 0 : kids.length - 1}
                    </Link> comments
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </ThemeConsumer>
  );
}

export default class Posts extends React.Component {
  state = {
    query: 'top',
    posts: {},
    error: null
  };

  /**
   * When the component mounts, fetch the API information we need
   */
  componentDidMount() {
    this.triggerQuerySwitch();
  }

  componentDidUpdate( prevProps ) {
    if ( prevProps.match.path !== this.props.match.path ) {
      this.triggerQuerySwitch();
    }
  }

  triggerQuerySwitch() {
    const match = this.props.match.path;

    if ( '/' === match ) {
      this.updatePostList( 'top' );
    } else if ( '/new' === match ) {
      this.updatePostList( 'new' );
    }
  }

  updatePostList( query ) {
    this.setState({
      query,
      error: null
    });

    if ( ! this.state.posts[query] ) {
      fetchMainPosts( query )
        .then( data => {
          window.console.log( data );
          this.setState(({ posts }) => ({
            posts: {
              ...posts,
              [query]: data
            }
          }));
        } )
        .catch( () => {
          console.warn( `Error fetching posts: ${error}` );

          this.setState({
            error: 'There was an error fetching the posts'
          });
        });
    }
  }

  isLoading = () => {
    const { query, posts, error } = this.state;

    return ! posts[query] && error === null;
  }

  render() {
    const { query, posts, error } = this.state;

    return (
      <article className="posts">
        {this.isLoading() && <Loading text="Fetching posts" />}

        {error && <p className="center-text error">{error}</p>}

        {posts[query] && <PostsList posts={posts[query]} />}
      </article>
    );
  }
}
