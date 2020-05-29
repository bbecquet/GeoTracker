import React from 'react';
import PropTypes from 'prop-types';
import './TrackSummary.css';

const TrackSummary = ({ track }) =>
    <div className="trackSummary">
        <div>{new Intl.DateTimeFormat(undefined,
            {year: "numeric", month: "numeric", day: "numeric",
            hour: "numeric", minute: "numeric", second: "numeric",
            hour12: false}).format(track.createdAt)}</div>
        <span className="trackSummary-name">{track.name || 'No name'}</span>
    </div>

TrackSummary.propTypes = {
    track: PropTypes.object.isRequired,
};

export default TrackSummary;
