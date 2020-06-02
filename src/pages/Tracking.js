import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tracker from '../models/tracker';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import GpsStatus from '../components/GpsStatus';
import stopIcon from '../imgs/stop.svg';
import { addPositionToTrack } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';

let positions = [];

const Tracking = () => {
    const { trackId } = useParams();
    const [settings] = useContext(SettingsContext);
    const [lastPosition, setLastPosition] = useState(null);

    const isValidAccuracy = position => position && position.coords.accuracy <= parseInt(settings.maxAccuracy, 10);

    const onNewPosition = onNewPosition => {
        if (isValidAccuracy(onNewPosition)) {
            // @TODO manage track position by upstream state/context 
            positions.push(onNewPosition);
            addPositionToTrack(parseInt(trackId, 10), onNewPosition);
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
            <TrackMap positions={positions.slice()} follow />
        </div>
    </Page>);
}

export default Tracking;
