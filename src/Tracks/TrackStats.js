import React, { Component, PropTypes } from 'react';
// import moment from 'moment';

class Track extends Component {
    static propTypes = {
        track: PropTypes.object.isRequired,
        positions: PropTypes.array.isRequired,
    }

    render() {
        const { positions } = this.props;

        return (
            <div>
                {`${positions.length} points`}
            </div>
        );
    }
}

export default Track;
