import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import TrackSummary from '../components/TrackSummary.js';
import PageHeader from '../components/PageHeader.js';
import settingsIcon from '../imgs/settings.svg';
import aboutIcon from '../imgs/information.svg';
import './TrackList.css';
import _ from 'lodash';

class TrackList extends Component {
    constructor() {
        super();
        this.state = { tracks: null };
    }

    static propTypes = {
        trackStore: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.refreshTrackList();
    }

    refreshTrackList(done) {
        this.props.trackStore.getTrackList()
        .then(tracks => {
            tracks.sort((t1, t2) => t2.createdAt - t1.createdAt);
            this.setState({ tracks });
            if(done) { done(); }
        });
    }

    addTrack() {
        this.props.trackStore.createTrack()
        .then(newTrack => {
            this.refreshTrackList(() => {
                this.props.router.push(`/tracks/${newTrack.id}/tracking`)
            });
        });
    }

    getTrackCount(tracks) {
        if(!tracks) { return 'Loading tracks…'; }
        switch(tracks.length) {
            case 0:
                return <div>
                    <p>No track yet.</p>
                    <p>Make sure your GPS is enabled and press "+" to start a new track.</p>
                </div>;
            case 1:
                return <p>1 track</p>;
            default:
                return <p>{`${tracks.length} tracks`}</p>;
        }
    }

    renderList(tracks) {
        return <ul>
            {tracks.map(track =>
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
                            {this.getTrackCount(this.state.tracks)}
                            {this.state.tracks && this.renderList(this.state.tracks)}
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

export default withRouter(TrackList);
