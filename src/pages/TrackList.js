import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import TrackSummary from '../components/TrackSummary.js';
import PageHeader from '../components/PageHeader.js';
import settingsIcon from '../imgs/settings.svg';
import aboutIcon from '../imgs/information.svg';
import './TrackList.css';
import _ from 'lodash';
import { connect } from 'react-redux';

class TrackList extends Component {
    static propTypes = {
        trackStore: PropTypes.object.isRequired,
        tracks: PropTypes.object.isRequired,
        loadTracks: PropTypes.func.isRequired,
        addTrack: PropTypes.func.isRequired,
    }

    componentWillMount() {
        this.loadTrackList();
    }

    loadTrackList() {
        return this.props.trackStore.getTrackList()
        .then(tracks => {
            tracks.sort((t1, t2) => t2.createdAt - t1.createdAt);
            this.props.loadTracks(tracks);
        });
    }

    addTrack() {
        this.props.trackStore.createTrack()
        .then(newTrack => {
            this.props.addTrack(newTrack);
            this.props.router.push(`/tracks/${newTrack.id}/tracking`)
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
            <div>
                <PageHeader
                    title="Your tracks"
                    rightChild={
                        <div>
                            <button onClick={() => { this.props.router.push('/about') }}>
                                <img src={aboutIcon} alt="" />
                            </button>
                            <button onClick={() => { this.props.router.push('/settings') }}>
                                <img src={settingsIcon} alt="" />
                            </button>
                        </div>
                    }
                />
                <main>
                    <div className="padding">
                        <div className="trackList">
                            {this.getTrackCount()}
                            {this.renderList()}
                        </div>
                    </div>
                    <button
                        className="mainAction"
                        onClick={() => {this.addTrack()}}
                    >
                        +
                    </button>
                </main>
            </div>
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

export default connect(null, mapDispatchToProps)(withRouter(TrackList));
