import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRedirect, browserHistory } from 'react-router';
import TrackList from './Tracks/TrackList.js';
import SingleTrack from './Tracks/SingleTrack.js';
import TrackingView from './Tracking/TrackingView.js';
import trackStorage from './Tracks/trackStorage.js';
import SettingsView from './Settings/SettingsView.js';

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
            <Route path="tracks/:trackId/tracking" component={TrackingView}></Route>
            <Route path="settings" component={SettingsView}/>
        </Route>
    </Router>,
    // <Route path="*" component={NoMatch}/>, redirect to home
    document.getElementById('root')
);
