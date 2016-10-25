import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import TrackSummary from '../components/TrackSummary.js';
import PageHeader from '../components/PageHeader.js';
import settingsIcon from '../imgs/settings.svg';

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
        this.props.trackStore.getTrackList(tracks => {
            this.setState({ tracks });
            if(done) { done(); }
        });
    }

    addTrack() {
        this.props.trackStore.createTrack(
            newTrack => {
                this.refreshTrackList(() => {
                    this.props.router.push(`/tracks/${newTrack.id}/tracking`)
                });
            },
            () => {
                console.error('Error creating new track');
            }
        );
    }

    getTrackCount(tracks) {
        if(!tracks) { return 'Loading tracks…'; }
        switch(tracks.length) {
            case 0: return 'No track yet';
            case 1: return '1 track';
            default: return `${tracks.length} tracks`;
        }
    }

    renderList(tracks) {
        return <ul>
            {tracks.reverse().map(track =>
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
                        <button onClick={() => { this.props.router.push('/settings') }}>
                            <img src={settingsIcon} alt="" />
                        </button> }
                />
                <main>
                    <div className="trackList padding">
                        <p>{this.getTrackCount(this.state.tracks)}</p>
                        {this.state.tracks && this.renderList(this.state.tracks)}
                    </div>
                    <button
                        className="mainAction"
                        onClick={() => {this.addTrack()}}
                    >
                        New track
                    </button>
                </main>
            </div>
        );
    }
}

export default withRouter(TrackList);
