import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import TrackList from './pages/TrackList.js';
import SingleTrack from './pages/SingleTrack.js';
import Tracking from './pages/Tracking.js';
import Settings from './pages/Settings.js';
import About from './pages/About.js';
import { SettingsContextProvider } from './models/SettingsContext';
import ThemeManager from './components/ThemeManager';

import swURL from 'file-loader?name=sw.js!babel-loader!./sw';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register(swURL)
    .then(function (reg) {
      // registration worked
      console.log('Registration succeeded. Scope is ' + reg.scope);
    })
    .catch(function (error) {
      // registration failed
      console.log('Registration failed with ' + error);
    });
}

ReactDOM.render(
  <SettingsContextProvider>
    <ThemeManager>
      <Router>
        <Switch>
          <Route path="/" exact>
            <App />
          </Route>
          <Route path="/tracks" exact>
            <TrackList />
          </Route>
          <Route path="/tracks/:trackId" exact>
            <SingleTrack />
          </Route>
          <Route path="/tracks/:trackId/tracking" exact>
            <Tracking />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/about">
            <About />
          </Route>
        </Switch>
      </Router>
    </ThemeManager>
  </SettingsContextProvider>,
  document.getElementById('root')
);
