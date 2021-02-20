import React from 'react';
import { fetchMainPosts } from '../utils/api';
import Loading from './Loading';
import PostsList from './PostsList';


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
