import React, { Component, PropTypes } from 'react';

class GpsStatus extends Component {
  static propTypes = {
    position: PropTypes.object,
  }

  render() {
    if (!this.props.position) {
        return <div>Not working</div>;
    }

    const {
        longitude,
        latitude,
    } = this.props.position.coords;

    return <div>
        {latitude} / {longitude}
    </div>;
  }
}

export default GpsStatus;
