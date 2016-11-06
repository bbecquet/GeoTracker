import React, { Component, PropTypes } from 'react';
import Length from './Length';
import { getSetting } from '../models/settings';
import './GpsStatus.css';
import classnames from 'classnames';

class GpsStatus extends Component {
    static propTypes = {
        position: PropTypes.object,
        validAccuracy: PropTypes.bool,
    }

    render() {
        const coords = this.props.position && this.props.position.coords;

        return <div className={classnames('gpsStatus padding', {
            'gpsStatus--active': this.props.position,
            'gpsStatus--invalidAccuracy': !this.props.validAccuracy,
        })}>
            <div className="gpsStatus-accuracy">
                Accuracy: {coords
                    ? <Length meters={coords.accuracy} imperialSystem={getSetting('lengthUnit') === 'imperial'} />
                    : '-'}
            </div>
            <div className="gpsStatus-indicator" />
        </div>;
    }
}

export default GpsStatus;
