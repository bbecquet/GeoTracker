import React, { Component, PropTypes } from 'react';
import TrackMap from './TrackMap.js';

class MapView extends Component {
  static propTypes = {
    trackStore: PropTypes.array.isRequired,
  }

  render() {
    const track = this.props.trackStore[this.props.params.trackId];

    return <div>
        <TrackMap track={track} />
    </div>;
  }
}

export default MapView;
