import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Length from './Length';
import './GpsStatus.css';
import classnames from 'classnames';

class GpsStatus extends Component {
    static propTypes = {
        position: PropTypes.object,
        validAccuracy: PropTypes.bool,
        imperialSystem: PropTypes.bool
    }

    render() {
        const coords = this.props.position && this.props.position.coords;

        return <div className={classnames('gpsStatus padding', {
            'gpsStatus--active': this.props.position,
            'gpsStatus--invalidAccuracy': !this.props.validAccuracy,
        })}>
            <div className="gpsStatus-accuracy">
                Accuracy: {coords
                    ? <Length meters={coords.accuracy} imperialSystem={this.props.imperialSystem} />
                    : '-'}
            </div>
            <div className="gpsStatus-indicator" />
        </div>;
    }
}

export default GpsStatus;
