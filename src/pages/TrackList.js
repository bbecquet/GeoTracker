import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import TrackSummary from '../components/TrackSummary.js';
import Page from '../components/Page.js';
import settingsIcon from '../imgs/settings.svg';
import aboutIcon from '../imgs/information.svg';
import './TrackList.css';
import { getTrackList, createTrack } from '../models/trackStorage';

const TrackList = ({ history }) => {
    const [tracks, setTracks] = useState([]);
    const [status, setStatus] = useState('LOADING');

    useEffect(() => {
        getTrackList().then(tracks => {
            tracks.sort((t1, t2) => t2.createdAt - t1.createdAt);
            setTracks(tracks);
            setStatus('READY');
        });
    }, []);

    const addTrack = () => {
        createTrack()
        .then(newTrack => {
            history.push(`/tracks/${newTrack.id}/tracking`)
        });
    }

    const getTrackCount = () => {
        if (status === 'LOADING') { return 'Loading tracks…'; }
        switch (tracks.length) {
            case 0:
                return <div>
                    <p>No track yet.</p>
                    <p>Make sure your GPS is enabled and press "+" to start a new track.</p>
                </div>;
            case 1:
                return <p>1 track</p>;
            default:
                return <p>{`${tracks.length} tracks`}</p>;
        }
    }

    return (
        <Page
            title="Your tracks"
            actions={[
                { icon: aboutIcon, navTo: '/about' },
                { icon: settingsIcon, navTo: '/settings' },
            ]}
        >
            <div className="padding trackList">
                {getTrackCount()}
                {status !== 'LOADING' && <ul>
                    {tracks.map(track =>
                        <li key={track.id}>
                            <Link to={`/tracks/${track.id}`}>
                                <TrackSummary track={track} />
                            </Link>
                        </li>
                    )}
                </ul>}
            </div>
            <button className="mainAction" onClick={addTrack}>+</button>
        </Page>
    );
}

TrackList.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(TrackList);
