import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ThemeContext from '../contexts/theme';
import PropTypes from 'prop-types';
import { getFormattedDate } from '../utils/date';

export function PostMetaInfo({ by, time, id, kids }) {
  const theme = useContext( ThemeContext );

  return (
    <p className={`meta-info-${theme}`}>
      <span>by <Link
          to={{
            pathname: '/user',
            search: `?id=${by}`
          }}
        >
          {by}
        </Link>
      </span>
      <span> on {getFormattedDate( time )} </span>
      {id && kids && <span>with <Link
          to={{
            pathname: '/post',
            search: `?id=${id}`
          }}
        >
          {! kids ? 0 : kids.length - 1}
        </Link> comments
      </span>}
    </p>
  );
}

PostMetaInfo.propTypes = {
  by: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  id: PropTypes.number,
  kids: PropTypes.array
};

export function PostListItem({ title, url, header = false }) {
  return (
    <>
      {header === true
        ? <h1 className="header"><a className="link" href={url}>{title}</a></h1>
        : <a className="link" href={url}>{title}</a>
      }
    </>
  );
}

PostListItem.propTypes = {
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  header: PropTypes.bool
};

export function PostsList({ posts }) {
  return (
    <ul className="space-around">
      {posts.map( post => {
        const { by, id, kids, time, title, url } = post;

        return (
          <li className="post" key={id}>
            <PostListItem
              title={title}
              url={url}
            />
            <PostMetaInfo
              by={by}
              time={time}
              id={id}
              kids={kids}
            />
          </li>
        );
      })}
    </ul>
  );
}

PostsList.propTypes = {
  posts: PropTypes.array.isRequired
};
