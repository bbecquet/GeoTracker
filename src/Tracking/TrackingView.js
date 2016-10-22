import React, { Component, PropTypes } from 'react';
import GpsStatus from './GpsStatus.js';
import Tracker from './tracker.js';
import TrackMap from '../Map/TrackMap.js';
import { withRouter } from 'react-router';

class TrackingView extends Component {
    constructor() {
        super();
        this.state = {
            lastPosition: null,
            positions: [],
        };
    }

    static propTypes = {
        trackStore: PropTypes.object.isRequired,
    }

    componentWillMount() {
        // TODO: implement a method on store to get both in one round
        this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10), track => {
            this.props.trackStore.getTrackPositions(track.id, positions => {
                this.setState({ track, positions });
            });
        });
    }

    componentDidMount() {
        console.log('Lauching GPS…');
        this.tracker = new Tracker(true);
        this.tracker.start(position => this.onNewPosition(position));
    }

    componentWillUnmount() {
        if (this.tracker) {
            this.tracker.stop();
            console.log('GPS stopped.');
        }
    }

    onNewPosition(newPosition) {
        if(this.state.track && this.state.positions) {
            this.props.trackStore.addPosition(this.state.track.id, newPosition, () => {
                // TODO:PERFS: less costly operation, maybe just push
                this.setState({
                    positions: this.state.positions.concat(newPosition),
                });
            });
        }
        this.setState({ lastPosition: newPosition });
    }

    render() {
        const track = this.state.track;

        return (<div>
            <GpsStatus position={this.state.lastPosition} />
            <div className="mapContainer">
                <TrackMap positions={this.state.positions} />
            </div>
            <button onClick={() => { this.props.router.push(`/tracks/${track.id}`) }}>Stop</button>
        </div>);
    }
}

export default withRouter(TrackingView);
