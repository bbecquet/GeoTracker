import React from 'react';
import PropTypes from 'prop-types';
import { getLength, getDuration } from '../models/trackUtils';
import Length from './Length';
import './TrackStats.css';

const zero2Pad = s => s.length >= 2 ? s : '0' + s;

function formatDuration(duration) {
	const seconds = Math.abs(Math.ceil(duration / 1000))
	const h = (seconds - seconds % 3600) / 3600;
    const m = (seconds - seconds % 60) / 60 % 60;
    const s = seconds % 60;
    if (h > 0) {
        return `${h}h${zero2Pad(m)}m`;
    }
    if (m > 0) {
        return `${zero2Pad(m)}m${zero2Pad(s)}s`;
    }
    return `${zero2Pad(s)}s`;
}

const TrackStats = ({ positions, imperialSystem }) =>
    <div className="trackStats">
        <div>{`${positions.length} points`}</div>
        <div><Length
            meters={getLength(positions)}
            imperialSystem={imperialSystem}
        /></div>
        <div>{formatDuration(getDuration(positions))}</div>
    </div>

TrackStats.propTypes = {
    positions: PropTypes.array.isRequired,
    imperialSystem: PropTypes.bool,
}

export default TrackStats;
