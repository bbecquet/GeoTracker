import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Tracker from '../models/tracker';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import Setting from '../components/Setting';
import stopIcon from '../imgs/stop.svg';
import { getTrack, updateTrack, addPositionToTrack } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';
import { getLocationName } from '../models/locator';

let positions = [];

const Tracking = () => {
    const history = useHistory();
    const trackId = parseInt(useParams().trackId, 10);
    const [settings] = useContext(SettingsContext);
    const [lastPosition, setLastPosition] = useState(null);
    const [mapFollow, setMapFollow] = useState(true);

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

    const onClose = () => {
        const goBack = () => history.replace(`/tracks/${trackId}`);
        if (positions.length === 0) {
            goBack();
            return;
        }
        getLocationName(positions[0]).then(name => {
            getTrack(trackId)
                .then(track => ({ ...track, id: trackId, name }))
                .then(updateTrack)
                .then(goBack)
        }).catch(goBack);
    }

    return (<Page
        title="Tracking…"
        actions={[{ icon: stopIcon, text: 'Stop', onClick: onClose }]}
    >
        <GpsStatus
            position={lastPosition}
            validAccuracy={isValidAccuracy(lastPosition)}
            imperialSystem={settings.lengthUnit === 'imperial'}
        />
        <div className="mapContainer">
            <TrackMap followPosition={mapFollow} positions={positions.slice()} />
        </div>
        <div className="padding">
            <Setting asLabel title="Center on position">
                <input
                    type="checkbox"
                    checked={mapFollow}
                    onChange={e => setMapFollow(e.target.checked)}
                />
            </Setting>
        </div>
    </Page>);
}

export default Tracking;
