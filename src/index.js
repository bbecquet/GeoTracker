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
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import { reducer as tracksReducer } from './models/trackUtils';
import { SettingsContextProvider } from "./models/SettingsContext";

import swURL from "file-loader?name=sw.js!babel-loader!./sw";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(swURL)
    .then(function(reg) {
        // registration worked
        console.log('Registration succeeded. Scope is ' + reg.scope);
    }).catch(function(error) {
        // registration failed
        console.log('Registration failed with ' + error);
    });
}

const store = createStore(combineReducers({
    tracks: tracksReducer,
}));

ReactDOM.render(
    <SettingsContextProvider>
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/" exact component={App} />
                    <Route path="/tracks" exact component={TrackList} />
                    <Route path="/tracks/:trackId" exact component={SingleTrack} />
                    <Route path="/tracks/:trackId/tracking" exact component={Tracking} />
                    <Route path="/settings" component={Settings} />
                    <Route path="/about" component={About} />
                </Switch>
            </Router>
        </Provider>
    </SettingsContextProvider>,
    document.getElementById('root')
);
