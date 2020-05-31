import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tracker from '../models/tracker';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import { getLocationName } from '../models/locator';
import stopIcon from '../imgs/stop.svg';
import { getTrack, updateTrack, addPositionToTrack } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';

const Tracking = ({ match }) => {
    const trackId = parseInt(match.params.trackId, 10);
    const [settings] = useContext(SettingsContext);
    const [lastPosition, setLastPosition] = useState(null);
    const [validAccuracy, setValidAccuracy] = useState(false);
    let tracker = null;
    let triedToLocate = false;

    useEffect(() => {
        console.log('Lauching GPS…');
        tracker = new Tracker(settings['gps.simulatePositions']);
        tracker.start(onNewPosition);

        return () => {
            if (tracker) {
                tracker.stop();
                console.log('GPS stopped.');
            }
        };
    }, []);

    const onNewPosition = newPosition => {
        const validAccuracy = newPosition.coords.accuracy <= parseInt(settings.maxAccuracy, 10);

        // if (validAccuracy && track && !track.name && !triedToLocate) {
        //     triedToLocate = true;
        //     getLocationName(newPosition, locationName => {
        //         const updatedTrack = { track, name: locationName };
        //         updateTrack(updatedTrack).then(() => { setTrack(updatedTrack) });
        //     });
        // }

        if (validAccuracy) {
            addPositionToTrack(trackId, newPosition);
        }

        setLastPosition(newPosition);
        setValidAccuracy(validAccuracy);
    }

    return (<Page
        title="Tracking…"
        actions={[{ icon: stopIcon, text: 'Stop', navTo: `/tracks/${trackId}` }]}
    >
        <GpsStatus
            position={lastPosition}
            validAccuracy={validAccuracy}
            imperialSystem={settings.lengthUnit === 'imperial'}
        />
        <div className="mapContainer">
            <TrackMap newPosition={lastPosition} validAccuracy={validAccuracy} />
        </div>
    </Page>);
}

Tracking.propTypes = {
    match: PropTypes.object.isRequired,
}

export default Tracking;
