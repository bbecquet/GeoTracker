import React, { Component, PropTypes } from 'react';
import { getLength } from '../models/trackUtils';
import Length from './Length';
import moment from 'moment';
import _ from 'lodash';
import './TrackStats.css';

class TrackStats extends Component {
    static propTypes = {
        track: PropTypes.object.isRequired,
        positions: PropTypes.array.isRequired,
        imperialSystem: PropTypes.bool,
    }

    render() {
        const { positions, imperialSystem } = this.props;
        const duration = _.last(positions).timestamp - _.first(positions).timestamp;

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
