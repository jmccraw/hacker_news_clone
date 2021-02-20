import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeConsumer } from '../contexts/theme';
import PropTypes from 'prop-types';

export default function PostsList({ posts }) {
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
                        search: `?id=${by}`
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

PostsList.propTypes = {
  posts: PropTypes.array.isRequired
};
