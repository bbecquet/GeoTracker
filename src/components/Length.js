import React from 'react';
import PropTypes from 'prop-types';

const metersToFeet = meters => meters * 3.28;

function formatImperial(meters) {
    const feet = metersToFeet(meters);
    const miles = Math.floor(feet / 5280);
    const feetRemain = feet % 5280;
    return `${miles > 0 ? miles + '\u00a0mi\u00a0' : ''}${Math.round(feetRemain)}\u00a0ft`;
}

function formatMetric(meters) {
    if (meters > 1000) {
        return `${Math.floor(meters / 1000)}.${Math.round(meters % 1000 / 100)}\u00a0km`;
    }
    return `${Math.round(meters)}\u00a0m`;
}

const Length = ({ meters, imperialSystem }) =>
    <span>
        {imperialSystem ? formatImperial(meters) : formatMetric(meters)}
    </span>;

Length.propTypes = {
    meters: PropTypes.number.isRequired,
    imperialSystem: PropTypes.bool,
}

export default Length;
