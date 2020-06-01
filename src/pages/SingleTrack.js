import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import TrackSummary from '../components/TrackSummary';
import TrackStats from '../components/TrackStats';
import TrackMap from '../components/TrackMap';
import { exportTrackAsGpx } from '../models/trackUtils';
import Page from '../components/Page';
import deleteIcon from '../imgs/delete.svg';
import exportIcon from '../imgs/file-export.svg';
import { getTrack, getTrackPositions, deleteTrack } from '../models/trackStorage';
import { withRouter } from 'react-router-dom';
import { SettingsContext } from '../models/SettingsContext';
import TrackGraph from '../components/TrackGraph';

const SingleTrack = ({ match, history }) => {
    const [settings] = useContext(SettingsContext);
    const [track, setTrack] = useState(null);
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        getTrack(parseInt(match.params.trackId, 10)).then(track => {
            getTrackPositions(track.id).then(positions => {
                setTrack(track);
                setPositions(positions);
            });
        });
    }, []);

    const onDelete = () => {
        if(!confirm('Are you sure you want to delete this track?')) { return; }
        deleteTrack(parseInt(track.id, 10))
        .then(() => { history.push('/tracks'); });
    }

    const onExport = () => {
        exportTrackAsGpx(track, positions);
    }

    return (
        <Page
            title="Track"
            backPath="/tracks"
            actions={[
                { icon: deleteIcon, onClick: onDelete },
                { icon: exportIcon, text: 'Export', onClick: onExport },
            ]}
        >
        {track ? <>
            <div className="padding">
                <TrackSummary track={track} />
                <TrackStats positions={positions} imperialSystem={settings.lengthUnit === 'imperial'} />
            </div>
            <div className="mapContainer">
                <TrackMap positions={positions} />
            </div>
            <div className="graphContainer">
                <TrackGraph positions={positions} />
            </div>
        </> : <div className="padding">Loading…</div>}
    </Page>);
}

SingleTrack.propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
}

export default withRouter(SingleTrack);
