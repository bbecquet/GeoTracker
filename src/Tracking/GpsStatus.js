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

        const {
            longitude,
            latitude,
        } = this.props.position.coords;

        return <div className="gpsStatus gpsStatus--active">
            {`${latitude}/${longitude}`}
        </div>;
    }
}

export default GpsStatus;
