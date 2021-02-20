import React from 'react';
import queryString from 'query-string';

export default class User extends React.Component {
  state = {
    id: '',
    karma: 0
  };

  componentDidMount() {

  }

  render() {
    return (
      <article className="user">
        <h1>User</h1>
      </article>
    );
  }
}
