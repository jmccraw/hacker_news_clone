import 'regenerator-runtime/runtime';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loading from './components/Loading';
import Nav from './components/Nav';
import Posts from './components/Posts';
import Comments from './components/Comments';
import User from './components/User';
import { ThemeProvider } from './contexts/theme';
import './index.css';

function App() {
  const [theme, setTheme] = useState( 'light' );

  const toggleTheme = () => {
    setTheme( theme => theme === 'light' ? 'dark' : 'light' );
  };

  return (
    <Router>
      <ThemeProvider value={theme}>
        <div className={theme}>
          <div className="container">
            <Nav toggleTheme={toggleTheme} />

            <React.Suspense fallback={<Loading />}>
              <Switch>
                <Route exact path="/" component={Posts} />
                <Route path="/new" component={Posts} />
                <Route path="/user" component={User} />
                <Route path="/post" component={Comments} />
                <Route render={() => <h1>404</h1>} />
              </Switch>
            </React.Suspense>
          </div>
        </div>
      </ThemeProvider>
    </Router>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById( 'app' )
);
