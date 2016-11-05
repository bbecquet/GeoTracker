import React, { PropTypes } from 'react';
import moment from 'moment';

const TrackSummary = ({track}) => {
    return (
        <div className="trackSummary">
            <div>{moment(track.createdAt).format('LLL')}</div>
            <i style={{ color: '#888' }}>{track.name || 'No name'}</i>
        </div>
    );
}

TrackSummary.propTypes = {
    track: PropTypes.object.isRequired,
};

export default TrackSummary;
