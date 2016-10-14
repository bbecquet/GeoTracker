import React, { Component } from 'react';
import GpsStatus from './GpsStatus.js';
import Tracker from './tracker.js';

class TrackingView extends Component {
  constructor() {
    super();
    this.state = { position: null };
  }

  componentDidMount() {
    console.log('Lauching GPS…');
    this.tracker = new Tracker();
    this.tracker.start(
        position => this.onNewPosition(position),

    );
  }

  componentWillUnmount() {
    if (this.tracker) {
      this.tracker.stop();
      console.log('GPS stopped.');
    }
  }

  onNewPosition(onNewPosition) {
     this.setState({ position: onNewPosition });
  }

  onError() {

  }

  render() {
    return <div>
        <GpsStatus {...this.state} />
        {/* @TODO: Map */}
    </div>;
  }
}

export default TrackingView;
