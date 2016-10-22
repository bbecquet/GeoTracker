import React, { Component, PropTypes } from 'react';
import TrackSummary from './TrackSummary.js';
import { Link, withRouter } from 'react-router';

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
                <li>
                    <Link to={`/tracks/${track.id}`} key={track.id}>
                        <TrackSummary track={track} />
                    </Link>
                </li>
            )}
        </ul>;
    }

    render() {
        return (
            <div>
                <header>Your tracks</header>
                <main>
                    {this.renderList(this.state.tracks)}
                    <div>
                        <button onClick={() => {this.addTrack()}}>New track</button>
                    </div>
                </main>
            </div>
        );
    }
}

export default withRouter(TrackList);
