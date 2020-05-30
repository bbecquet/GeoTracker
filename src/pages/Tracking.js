import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { mapTileDefs } from '../models/settings';
import Tracker from '../models/tracker';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import { getLocationName } from '../models/locator';
import stopIcon from '../imgs/stop.svg';
import { getTrack, updateTrack, addPositionToTrack } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';

const Tracking = ({ match }) => {
    const [settings] = useContext(SettingsContext);
    const [track, setTrack] = useState(null);
    const [lastPosition, setLastPosition] = useState(null);
    const [validAccuracy, setValidAccuracy] = useState(false);
    let tracker = null;
    let triedToLocate = false;

    useEffect(() => {
        console.log('Lauching GPS…');
        tracker = new Tracker(settings['gps.simulatePositions']);
        tracker.start(onNewPosition);            
        getTrack(parseInt(match.params.trackId, 10)).then(setTrack);

        return () => {
            tracker.stop();
            console.log('GPS stopped.');
        };
    }, []);

    const onNewPosition = newPosition => {
        const validAccuracy = newPosition.coords.accuracy <= parseInt(settings.maxAccuracy, 10);

        if (validAccuracy && track && !track.name && !triedToLocate) {
            triedToLocate = true;
            getLocationName(newPosition, locationName => {
                const updatedTrack = { track, name: locationName };
                updateTrack(updatedTrack).then(() => { setTrack(updatedTrack) });
            });
        }

        if (validAccuracy && track) {
            addPositionToTrack(track.id, newPosition);
        }

        setLastPosition(newPosition);
        setValidAccuracy(validAccuracy);
    }

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

Tracking.propTypes = {
    match: PropTypes.object.isRequired,
}

export default Tracking;
