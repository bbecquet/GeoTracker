import React from 'react';
import PropTypes from 'prop-types';
import { getLength } from '../models/trackUtils';
import Length from './Length';
import moment from 'moment';
import './TrackStats.css';

const TrackStats = ({ positions, imperialSystem }) => {
    const duration = positions.length === 0
        ? 0
        : positions[positions.length - 1].timestamp - positions[0].timestamp;

    return (
        <div className="trackStats">
            <div>{`${positions.length} points`}</div>
            <div><Length
                meters={getLength(positions)}
                imperialSystem={imperialSystem}
            /></div>
            <div>{moment.duration(duration).humanize()}</div>
        </div>
    );
}

TrackStats.propTypes = {
    positions: PropTypes.array.isRequired,
    imperialSystem: PropTypes.bool,
}

export default TrackStats;
