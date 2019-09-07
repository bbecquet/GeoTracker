import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './TrackSummary.css';

const TrackSummary = ({track}) => {
    return (
        <div className="trackSummary">
            <div>{moment(track.createdAt).format('LLL')}</div>
            <span className="trackSummary-name">{track.name || 'No name'}</span>
        </div>
    );
}

TrackSummary.propTypes = {
    track: PropTypes.object.isRequired,
};

export default TrackSummary;
