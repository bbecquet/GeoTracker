import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mapTileDefs, mapSettingsToProps } from '../models/settings';
import Tracker from '../models/tracker';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import { getLocationName } from '../models/locator';
import stopIcon from '../imgs/stop.svg';
import { getTrack, updateTrack, addPositionToTrack } from '../models/trackStorage';
import { connect } from 'react-redux';

class Tracking extends Component {
    state = {
        lastPosition: null,
        track: null,
    };

    static propTypes = {
        settings: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
    }

    componentDidMount() {
        console.log('Lauching GPS…');
        
        getTrack(parseInt(this.props.match.params.trackId, 10))
            .then(track => { this.setState({ track }); });

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
        const validAccuracy = newPosition.coords.accuracy <= parseInt(this.props.settings.maxAccuracy, 10);

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
        const { track, lastPosition, validAccuracy } = this.state;
        const useImperialSystem = settings.lengthUnit === 'imperial';

        return (<Page
            title="Tracking…"
            actions={track ? [{ icon: stopIcon, text: 'Stop', navTo: `/tracks/${track.id}`}] : []}
        >
            <GpsStatus
                position={lastPosition}
                validAccuracy={validAccuracy}
                imperialSystem={useImperialSystem}
            />
            <div className="mapContainer">
                <TrackMap
                    newPosition={lastPosition}
                    validAccuracy={validAccuracy}
                    backgroundTileDef={mapTileDefs[settings.mapTiles]}
                    imperialSystem={useImperialSystem}
                />
            </div>
        </Page>);
    }
}

export default connect(mapSettingsToProps)(Tracking);
