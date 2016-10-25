import React, { PropTypes } from 'react';
import moment from 'moment';

const TrackSummary = ({track}) => {
    return (
        <div className="trackSummary">
            <div>{moment(track.createdAt).format('LLL')}</div>
            {track.name}
        </div>
    );
}

TrackSummary.propTypes = {
    track: PropTypes.object.isRequired,
};

export default TrackSummary;
