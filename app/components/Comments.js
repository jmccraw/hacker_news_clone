import React from 'react';
import queryString from 'query-string';
import Loading from './Loading';
import { PostListItem, PostMetaInfo } from './PostsList';
import useFetchComments from '../hooks/useFetchComments';

function Comment({ by, text, time }) {
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


export default function Comments({ location }) {
  const { id: commentId } = queryString.parse( location.search );
  const [comments, error, loading] = useFetchComments( commentId );
  const { by, id, time, kids, title, url, posts } = comments;

  return (
    <>
      {loading && <Loading text="Fetching post" />}

      {error && <p className="error-message">{error}</p>}

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
    </>
  );
}
