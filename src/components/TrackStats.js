import React, { Component, PropTypes } from 'react';
import { getLength } from '../models/trackUtils';

class Track extends Component {
    static propTypes = {
        track: PropTypes.object.isRequired,
        positions: PropTypes.array.isRequired,
    }

    render() {
        const { positions } = this.props;

        return (
            <div>
                <p>{`${positions.length} points`}</p>
                <p>Distance {`${getLength(positions)}m`}</p>
            </div>
        );
    }
}

export default Track;
