import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import TrackList from './Tracks/TrackList.js';
import SingleTrack from './Tracks/SingleTrack.js';
import MapView from './Map/MapView.js';
import TrackingView from './Tracking/TrackingView.js';
import trackStorage from './Tracks/trackStorage.js';

const trackStore = new trackStorage();

const createElement = function (Component, props) {
  return <Component trackStore={trackStore} {...props} />
};

ReactDOM.render(
  <Router history={browserHistory} createElement={createElement}>
    <Route path="/" component={App}>
      <IndexRedirect to="/tracks" />
      <Route path="tracks" component={TrackList} />
      <Route path="tracks/:trackId" component={SingleTrack}></Route>
      <Route path="tracks/:trackId/map" component={MapView}></Route>
      <Route path="tracks/:trackId/tracking" component={TrackingView}></Route>
    </Route>
  </Router>,
  // <Route path="settings" component={About}/>
  // <Route path="*" component={NoMatch}/>, redirect to home
  document.getElementById('root')
);