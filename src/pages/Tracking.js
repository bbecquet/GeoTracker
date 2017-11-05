import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { mapTileDefs, mapSettingsToProps } from '../models/settings';
import Tracker from '../models/tracker';
import PageHeader from '../components/PageHeader';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import { getLocationName } from '../models/locator';
import stopIcon from '../imgs/stop.svg';
import { getTrack, updateTrack, addPositionToTrack } from '../models/trackStorage';
import { connect } from 'react-redux';

class Tracking extends Component {
    state = {
        lastPosition: null,
    };

    static propTypes = {
        settings: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.maxAccuracy = parseInt(this.props.settings.maxAccuracy, 10);

        getTrack(parseInt(this.props.match.params.trackId, 10))
        .then(track => { this.setState({ track }); });
    }

    componentDidMount() {
        console.log('Lauching GPS…');
        this.tracker = new Tracker(this.props.settings['gps.simulatePositions']);
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

                updateTrack(updatedTrack)
                .then(() => {
                    this.setState({ track: updatedTrack });
                });
            });
        }

        if(validAccuracy && this.state.track) {
            addPositionToTrack(this.state.track.id, newPosition);
        }

        this.setState({
            lastPosition: newPosition,
            validAccuracy
        });
    }

    render() {
        const settings = this.props.settings;
        const track = this.state.track;
        const useImperialSystem = settings.lengthUnit === 'imperial';

        return (<div>
            <PageHeader
                title="Tracking…"
                rightChild={
                    <Link to={`/tracks/${track.id}`}>
                        <img src={stopIcon} alt="" />&nbsp;Stop
                    </Link>
                }
            />
            <main>
                <GpsStatus
                    position={this.state.lastPosition}
                    validAccuracy={this.state.validAccuracy}
                    imperialSystem={useImperialSystem}
                />
                <div className="mapContainer">
                    <TrackMap
                        newPosition={this.state.lastPosition}
                        validAccuracy={this.state.validAccuracy}
                        backgroundTileDef={mapTileDefs[settings.mapTiles]}
                        imperialSystem={useImperialSystem}
                    />
                </div>
            </main>
        </div>);
    }
}

export default connect(mapSettingsToProps)(Tracking);
