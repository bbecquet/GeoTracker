import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import TrackSummary from '../components/TrackSummary.js';
import PageHeader from '../components/PageHeader.js';

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

    renderList(tracks) {
        if(!tracks) { return 'Loading tracks'; }

        if(tracks.length === 0) { return 'No track yet'; }

        return <ul className="trackList">
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
                    rightChild={ <button onClick={() => { this.props.router.push('/settings') }}>⚙</button> }
                />
                <main>
                    {this.renderList(this.state.tracks)}
                    <div>
                        <button
                            className="mainAction"
                            onClick={() => {this.addTrack()}}
                        >
                            New track
                        </button>
                    </div>
                </main>
            </div>
        );
    }
}

export default withRouter(TrackList);
