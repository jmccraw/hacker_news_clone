import React from 'react';
import queryString from 'query-string';

export default class Post extends React.Component {
  state = {
    id: ''
  };

  componentDidMount() {

  }

  render() {
    return (
      <article className="post">
        <h1>Post</h1>
      </article>
    );
  }
}