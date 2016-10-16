import React, { Component, PropTypes } from 'react';
import GpsStatus from './GpsStatus.js';
import Tracker from './tracker.js';
import { withRouter } from 'react-router';

class TrackingView extends Component {
  constructor() {
    super();
    this.state = { position: null };
  }

  static propTypes = {
    trackStore: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10), track => {
      this.setState({ track });
    });
  }

  componentDidMount() {
    console.log('Lauching GPS…');
    this.tracker = new Tracker(true);
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

  render() {
    const track = this.state.track;

    return (<div>
        <GpsStatus {...this.state} />
        {/* @TODO: Map */}
        <button onClick={() => { this.props.router.push(`/tracks/${track.id}`) }}>Stop</button>
    </div>);
  }
}

export default withRouter(TrackingView);
