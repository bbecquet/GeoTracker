import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router-dom';
import TrackSummary from '../components/TrackSummary.js';
import Page from '../components/Page.js';
import settingsIcon from '../imgs/settings.svg';
import aboutIcon from '../imgs/information.svg';
import './TrackList.css';
import { connect } from 'react-redux';
import { getTrackList, createTrack } from '../models/trackStorage';
import { mapSettingsToProps } from '../models/settings';

class TrackList extends Component {
    static propTypes = {
        tracks: PropTypes.object.isRequired,
        loadTracks: PropTypes.func.isRequired,
        addTrack: PropTypes.func.isRequired,
        history: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.loadTrackList();
    }

    loadTrackList() {
        return getTrackList()
        .then(tracks => {
            tracks.sort((t1, t2) => t2.createdAt - t1.createdAt);
            this.props.loadTracks(tracks);
        });
    }

    addTrack = () => {
        createTrack()
        .then(newTrack => {
            this.props.addTrack(newTrack);
            this.props.history.push(`/tracks/${newTrack.id}/tracking`)
        });
    }

    getTrackCount() {
        if(!this.props.tracks.trackList) { return 'Loading tracks…'; }
        switch(this.props.tracks.trackList.length) {
            case 0:
                return <div>
                    <p>No track yet.</p>
                    <p>Make sure your GPS is enabled and press "+" to start a new track.</p>
                </div>;
            case 1:
                return <p>1 track</p>;
            default:
                return <p>{`${this.props.tracks.trackList.length} tracks`}</p>;
        }
    }

    renderList() {
        if(!this.props.tracks.trackList) { return null; }
        return <ul>
            {this.props.tracks.trackList.map(track =>
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
                    { icon: aboutIcon, to: '/about' },
                    { icon: settingsIcon, to: '/settings' },
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

function mapDispatchToProps(dispatch) {
    return {
        loadTracks: tracks => dispatch({
            type: 'TRACKS_LOAD_LIST',
            tracks,
        }),
        addTrack: track => dispatch({
            type: 'TRACKS_NEW',
            track,
        })
    }
}

export default connect(mapSettingsToProps, mapDispatchToProps)(withRouter(TrackList));
