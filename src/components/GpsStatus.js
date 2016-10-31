import React, { Component, PropTypes } from 'react';
import './GpsStatus.css';

class GpsStatus extends Component {
    static propTypes = {
        position: PropTypes.object,
    }

    render() {
        if (!this.props.position) {
            return <div className="gpsStatus gpsStatus--inactive" />;
        }

        return <div className="gpsStatus gpsStatus--active" />;
    }
}

export default GpsStatus;
