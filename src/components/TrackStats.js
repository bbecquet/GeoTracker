import React, { Component, PropTypes } from 'react';
import { getLength } from '../models/trackUtils';
import Length from './Length';
import { getSetting } from '../models/settings';

class Track extends Component {
    static propTypes = {
        track: PropTypes.object.isRequired,
        positions: PropTypes.array.isRequired,
    }

    render() {
        const { positions } = this.props;

        return (
            <div className="trackStats">
                <p>{`${positions.length} points`}</p>
                <p>Distance <Length
                    meters={getLength(positions)}
                    imperialSystem={getSetting('lengthUnit') === 'imperial'}
                /></p>
            </div>
        );
    }
}

export default Track;
