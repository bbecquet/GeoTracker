import React, { Component, PropTypes } from 'react';
import TrackSummary from './TrackSummary.js';
import TrackStats from './TrackStats.js';
import { Link } from 'react-router';

class SingleTrack extends Component {
  static propTypes = {
    trackStore: PropTypes.array.isRequired,
  }

  deleteTrack() {

  }

  exportTrack() {

  }

  render() {
    const trackId = this.props.params.trackId;
    const track = this.props.trackStore[trackId];

    return <div>
        <TrackSummary track={track} />
        <TrackStats track={track} />
        <Link to={`/tracks/${trackId}/tracking`}>Resume</Link>
        <button onClick={this.deleteTrack}>Delete</button>
        <button onClick={this.exportTrack}>Export</button>
        <Link to={`/tracks/${trackId}/map`}>See on map</Link>
    </div>;
  }
}

export default SingleTrack;
