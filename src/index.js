import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, IndexRedirect, Redirect, browserHistory } from 'react-router';
import TrackList from './pages/TrackList.js';
import SingleTrack from './pages/SingleTrack.js';
import Tracking from './pages/Tracking.js';
import Settings from './pages/Settings.js';
import About from './pages/About.js';
import trackStorage from './models/trackStorage.js';
import { createStore, combineReducers } from 'redux';
import { Provider, connect } from 'react-redux';
import { reducer as settingsReducer, mapSettingsToProps } from './models/settings';
import { reducer as tracksReducer } from './models/trackUtils';

import swURL from "file?name=sw.js!babel!./sw";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swURL)
    .then(function(reg) {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
};

const trackStore = new trackStorage();

const store = createStore(combineReducers({
    settings: settingsReducer,
    tracks: tracksReducer,
}));

const createElement = function (Component, props) {
    const ReduxComponent = connect(mapSettingsToProps)(Component);
    return <ReduxComponent trackStore={trackStore} {...props} />
};

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory} createElement={createElement}>
            <Route path="/" component={App}>
                <IndexRedirect to="/tracks" />
                <Route path="tracks" component={TrackList} />
                <Route path="tracks/:trackId" component={SingleTrack}></Route>
                <Route path="tracks/:trackId/tracking" component={Tracking}></Route>
                <Route path="settings" component={Settings}/>
                <Route path="about" component={About}/>
                <Redirect path="*" to="/"/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);
