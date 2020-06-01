import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tracker from '../models/tracker';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import stopIcon from '../imgs/stop.svg';
import { addPositionToTrack } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';

let positions = [];

const Tracking = ({ match }) => {
    const trackId = parseInt(match.params.trackId, 10);
    const [settings] = useContext(SettingsContext);
    const [lastPosition, setLastPosition] = useState(null);

    const isValidAccuracy = position => position && position.coords.accuracy <= parseInt(settings.maxAccuracy, 10);

    const onNewPosition = onNewPosition => {
        if (isValidAccuracy(onNewPosition)) {
            // @TODO manage track position by upstream state/context 
            positions.push(onNewPosition);
            addPositionToTrack(trackId, onNewPosition);
        }
        setLastPosition(onNewPosition);
    };

    useEffect(() => {
        positions = [];
        console.log('Lauching GPS…');
        const tracker = new Tracker(settings['gps.simulatePositions']);
        tracker.start(onNewPosition);

        return () => {
            if (tracker) {
                tracker.stop();
                console.log('GPS stopped.');
            }
        };
    }, []);

    return (<Page
        title="Tracking…"
        actions={[{ icon: stopIcon, text: 'Stop', navTo: `/tracks/${trackId}` }]}
    >
        <GpsStatus
            position={lastPosition}
            validAccuracy={isValidAccuracy(lastPosition)}
            imperialSystem={settings.lengthUnit === 'imperial'}
        />
        <div className="mapContainer">
            <TrackMap positions={positions.slice()} />
        </div>
    </Page>);
}

Tracking.propTypes = {
    match: PropTypes.object.isRequired,
}

export default Tracking;
