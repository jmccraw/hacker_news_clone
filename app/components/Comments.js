import React from 'react';
import queryString from 'query-string';
import { ThemeConsumer } from '../contexts/theme';
import { fetchComments, fetchItem } from '../utils/api';
import Loading from './Loading';
import { PostListItem, PostMetaInfo } from './PostsList';

function Comment({ by, id, text, time, ...restProps }) {
  return (
    <div className="comment">
      <PostMetaInfo
        by={by}
        time={time}
      />
      <p dangerouslySetInnerHTML={{__html: text}} />
    </div>
  );
}

export default class Comments extends React.Component {
  state = {
    comments: {},
    error: null,
    loading: false
  };

  componentDidMount() {
    const { id } = queryString.parse( this.props.location.search );

    fetchItem( id )
      .then( data => {
        window.console.log( 'POST', data );

        this.setState({
          comments: {
            ...data
          },
          error: null,
          loading: false
        });

        this.getPostComments();
      } )
      .catch( ({ message }) => {
        this.setState({
          error: message,
          loading: false
        });
      } );
  }

  /**
   * Get the comments related to this post
   */
  getPostComments() {
    fetchComments( this.state.comments.kids )
      .then( postComments => {
        window.console.log( 'COMMENTS: ', postComments );

        this.setState(({ comments }) => ({
          comments: {
            ...comments,
            posts: postComments
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
    const { comments, error, loading } = this.state;
    const { by, id, time, kids, title, url, posts } = comments;

    return (
      <>
        {loading && <Loading text="Fetching post" />}

        {error && <p className="error-message">{error}</p>}
        <ThemeConsumer>
          {({ theme }) => (
            <>
              {! loading && title && <>
                <PostListItem
                  title={title}
                  url={url}
                  header={true}
                />
                <PostMetaInfo
                  by={by}
                  time={time}
                  id={id}
                  kids={kids}
                />
              </>}

              {posts && posts.map( post => (
                <Comment
                  key={post.id}
                  {...post}
                />
              ))}
            </>
          )}
        </ThemeConsumer>
      </>
    );
  }
}