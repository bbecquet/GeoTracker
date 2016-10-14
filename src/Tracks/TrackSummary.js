import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class Track extends Component {
  static propTypes = {
    track: PropTypes.object.isRequired,
  }

  render() {
    const {
      name,
      createdAt,
    } = this.props.track;

    return (
      <div className="track">
        <div>{moment(createdAt).format('LLL')}</div>
        {name}
      </div>
    );
  }
}

export default Track;
