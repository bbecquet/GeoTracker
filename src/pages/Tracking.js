import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { getSetting, getMapStyle } from '../models/settings';
import Tracker from '../models/tracker';
import PageHeader from '../components/PageHeader';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';

class Tracking extends Component {
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
        this.tracker = new Tracker(getSetting('gps.simulatePositions'));
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
            <PageHeader
                title="Tracking…"
                rightChild={
                    <button onClick={() => { this.props.router.push(`/tracks/${track.id}`) }}>
                        ⏹ Stop
                    </button>
                }
            />
            <main>
                <GpsStatus position={this.state.lastPosition} />
                <div className="mapContainer">
                    <TrackMap
                        newPosition={this.state.lastPosition}
                        backgroundTileDef={getMapStyle()}
                    />
                </div>
            </main>
        </div>);
    }
}

export default withRouter(Tracking);
