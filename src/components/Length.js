import React, { Component, PropTypes } from 'react';

class Length extends Component {
    static propTypes = {
        meters: PropTypes.number.isRequired,
        imperialSystem: PropTypes.bool,
    }

    metersToFeet(meters) {
        return meters * 3.28;
    }

    formatImperial(meters) {
        const feet = this.metersToFeet(meters);
        const miles = Math.floor(feet / 5280);
        const feetRemain = feet % 5280;
        return `${miles > 0 ? miles + ' mi ' : ''}${Math.round(feetRemain)} ft`;
    }

    formatMetric(meters) {
        if (meters > 1000) {
            return `${Math.floor(meters / 1000)}.${Math.round(meters % 1000 / 100)} km`;
        }
        return `${Math.round(meters)} m`;
    }

    render() {
        return <span>
            {this.props.imperialSystem ?
                this.formatImperial(this.props.meters) :
                this.formatMetric(this.props.meters)}
        </span>;
    }
}

export default Length;
