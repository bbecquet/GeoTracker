import React, { Component, PropTypes } from 'react';
import { getLength } from '../models/trackUtils';
import Length from './Length';
import { getSetting } from '../models/settings';
import moment from 'moment';
import _ from 'lodash';

class Track extends Component {
    static propTypes = {
        track: PropTypes.object.isRequired,
        positions: PropTypes.array.isRequired,
    }

    render() {
        const { positions } = this.props;
        const duration = _.last(positions).timestamp - _.first(positions).timestamp;

        return (
            <div className="trackStats">
                <p>{`${positions.length} points`}</p>
                <p>Distance: <Length
                    meters={getLength(positions)}
                    imperialSystem={getSetting('lengthUnit') === 'imperial'}
                /></p>
                <p>Duration: {moment.duration(duration).humanize()}</p>
            </div>
        );
    }
}

export default Track;
