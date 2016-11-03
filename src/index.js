import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRedirect, Redirect, browserHistory } from 'react-router';
import TrackList from './pages/TrackList.js';
import SingleTrack from './pages/SingleTrack.js';
import TrackingView from './pages/TrackingView.js';
import SettingsView from './pages/SettingsView.js';
import trackStorage from './models/trackStorage.js';

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
            <Redirect path="*" to="/"/>
        </Route>
    </Router>,
    document.getElementById('root')
);
