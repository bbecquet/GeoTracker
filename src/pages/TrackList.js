import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import TrackSummary from '../components/TrackSummary.js';
import Page from '../components/Page.js';
import settingsIcon from '../imgs/settings.svg';
import aboutIcon from '../imgs/information.svg';
import './TrackList.css';
import { getTrackList, createTrack } from '../models/trackStorage';

class TrackList extends Component {
    state = {
        tracks: [],
        status: 'LOADING',
    };

    static propTypes = {
        history: PropTypes.object.isRequired,
    }

    componentDidMount() {
        this.loadTrackList();
    }

    loadTrackList() {
        return getTrackList()
        .then(tracks => {
            tracks.sort((t1, t2) => t2.createdAt - t1.createdAt);
            this.setState({ tracks, status: 'READY' });
        });
    }

    addTrack = () => {
        createTrack()
        .then(newTrack => {
            this.props.history.push(`/tracks/${newTrack.id}/tracking`)
        });
    }

    getTrackCount() {
        if(!this.state.status === 'LOADING') { return 'Loading tracks…'; }
        switch(this.state.tracks.length) {
            case 0:
                return <div>
                    <p>No track yet.</p>
                    <p>Make sure your GPS is enabled and press "+" to start a new track.</p>
                </div>;
            case 1:
                return <p>1 track</p>;
            default:
                return <p>{`${this.state.tracks.length} tracks`}</p>;
        }
    }

    renderList() {
        if(!this.state.status === 'LOADING') { return null; }
        return <ul>
            {this.state.tracks.map(track =>
                <li key={track.id}>
                    <Link to={`/tracks/${track.id}`}>
                        <TrackSummary track={track} />
                    </Link>
                </li>
            )}
        </ul>;
    }

    render() {
        return (
            <Page
                title="Your tracks"
                actions={[
                    { icon: aboutIcon, navTo: '/about' },
                    { icon: settingsIcon, navTo: '/settings' },
                ]}
            >
                <div className="padding">
                    <div className="trackList">
                        {this.getTrackCount()}
                        {this.renderList()}
                    </div>
                </div>
                <button
                    className="mainAction"
                    onClick={this.addTrack}
                >
                    +
                </button>
            </Page>
        );
    }
}

export default withRouter(TrackList);
