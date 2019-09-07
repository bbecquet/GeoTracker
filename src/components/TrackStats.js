import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getLength } from '../models/trackUtils';
import Length from './Length';
import moment from 'moment';
import './TrackStats.css';

class TrackStats extends Component {
    static propTypes = {
        track: PropTypes.object.isRequired,
        positions: PropTypes.array.isRequired,
        imperialSystem: PropTypes.bool,
    }

    render() {
        const { positions, imperialSystem } = this.props;
        const duration = positions.length === 0
            ? 0
            : positions[positions.length - 1].timestamp - positions[0].timestamp;

        return (
            <div className="trackStats">
                <div>{`${positions.length} points`}</div>
                <div><Length
                    meters={getLength(positions)}
                    imperialSystem={imperialSystem}
                /></div>
                <div>{moment.duration(duration).humanize()}</div>
            </div>
        );
    }
}

export default TrackStats;
