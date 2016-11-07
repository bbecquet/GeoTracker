import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { getSetting, getMapStyle } from '../models/settings';
import Tracker from '../models/tracker';
import PageHeader from '../components/PageHeader';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import { getLocationName } from '../models/locator';

class Tracking extends Component {
    constructor() {
        super();
        this.state = {
            lastPosition: null,
        };
    }

    static propTypes = {
        trackStore: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.maxAccuracy = parseInt(getSetting('maxAccuracy'), 10);

        this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10))
        .then(track => { this.setState({ track }); });
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
        const validAccuracy = newPosition.coords.accuracy <= this.maxAccuracy;

        if(validAccuracy && this.state.track && !this.state.track.name && !this.triedToLocate) {
            this.triedToLocate = true;
            getLocationName(newPosition, locationName => {
                const updatedTrack = {
                    ...this.state.track,
                    name: locationName,
                };

                this.props.trackStore.updateTrack(updatedTrack)
                .then(() => {
                    this.setState({ track: updatedTrack });
                });
            });
        }

        if(validAccuracy && this.state.track) {
            this.props.trackStore.addPosition(this.state.track.id, newPosition);
        }

        this.setState({
            lastPosition: newPosition,
            validAccuracy
        });
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
                <GpsStatus
                    position={this.state.lastPosition}
                    validAccuracy={this.state.validAccuracy}
                />
                <div className="mapContainer">
                    <TrackMap
                        newPosition={this.state.lastPosition}
                        validAccuracy={this.state.validAccuracy}
                        backgroundTileDef={getMapStyle()}
                    />
                </div>
            </main>
        </div>);
    }
}

export default withRouter(Tracking);
