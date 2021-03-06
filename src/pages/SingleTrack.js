import React, { useState, useContext, useEffect } from 'react';
import TrackSummary from '../components/TrackSummary';
import TrackStats from '../components/TrackStats';
import TrackMap from '../components/TrackMap';
import { exportTrackAsGpx } from '../models/trackUtils';
import Page from '../components/Page';
import deleteIcon from '../imgs/delete.svg';
import exportIcon from '../imgs/file-export.svg';
import {
  getTrack,
  getTrackPositions,
  deleteTrack,
} from '../models/trackStorage';
import { useParams, useHistory } from 'react-router-dom';
import { SettingsContext } from '../models/SettingsContext';
import TrackGraph from '../components/TrackGraph';

const SingleTrack = () => {
  const history = useHistory();
  const { trackId } = useParams();
  const [settings] = useContext(SettingsContext);
  const [track, setTrack] = useState(null);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    getTrack(parseInt(trackId, 10)).then(track => {
      getTrackPositions(track.id).then(positions => {
        setTrack(track);
        setPositions(positions);
      });
    });
  }, []);

  const onDelete = () => {
    if (!confirm('Are you sure you want to delete this track?')) {
      return;
    }
    deleteTrack(parseInt(track.id, 10)).then(() => {
      history.push('/tracks');
    });
  };

  const onExport = () => {
    exportTrackAsGpx(track, positions);
  };

  return (
    <Page
      title="Track"
      backPath="/tracks"
      actions={[
        { icon: deleteIcon, onClick: onDelete },
        { icon: exportIcon, text: 'Export', onClick: onExport },
      ]}
    >
      {track ? (
        <>
          <div className="padding">
            <TrackSummary track={track} className="padding-v-s" />
            <TrackStats
              positions={positions}
              imperialSystem={settings.lengthUnit === 'imperial'}
            />
          </div>
          <div className="mapContainer">
            <TrackMap positions={positions} fit />
          </div>
          <div className="graphContainer">
            <TrackGraph positions={positions} />
          </div>
        </>
      ) : (
        <div className="padding">Loading…</div>
      )}
    </Page>
  );
};

export default SingleTrack;
