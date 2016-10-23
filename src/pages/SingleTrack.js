import React, { Component, PropTypes } from 'react';
import { Link, withRouter } from 'react-router';
import TrackSummary from '../components/TrackSummary';
import TrackStats from '../components/TrackStats';
import TrackMap from '../components/TrackMap';
import { exportTrackAsGpx } from '../models/trackUtils';
import PageHeader from '../components/PageHeader';

class SingleTrack extends Component {
    constructor() {
        super();
        this.state = {
            track: null,
            positions: [],
        };
    }

    static propTypes = {
        trackStore: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10), track => {
            this.props.trackStore.getTrackPositions(track.id, positions => {
                this.setState({ track, positions });
            });
        });
    }

    deleteTrack() {
        // if(!confirm('Are you sure you want to delete this track?')) { return; }
        this.props.trackStore.deleteTrack(parseInt(this.props.params.trackId, 10), () => {
            this.props.router.push('/tracks');
        });
    }

    exportTrack() {
        exportTrackAsGpx(this.state.track, this.state.positions)
    }

    render() {
        const track = this.state.track;

        if (!track) {
            return (<div>Loading...</div>);
        }

        return (<div>
            <PageHeader
                title="Track"
                backPath="/tracks"
                rightChild={
                    <div>
                        <button onClick={() => { this.deleteTrack(); }}>🗑</button>
                        |
                        <button onClick={() => { this.exportTrack(); }}>Export</button>
                    </div>
                }
            />
            <main>
                <TrackSummary track={track} />
                <TrackStats {...this.state} />
                <div className="mapContainer">
                    <TrackMap positions={this.state.positions} />
                </div>
                <div>
                    <Link to={`/tracks/${track.id}/tracking`}>Resume</Link>
                </div>
            </main>
        </div>);
    }
}

export default withRouter(SingleTrack);
