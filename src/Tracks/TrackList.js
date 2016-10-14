import React, { Component, PropTypes } from 'react';
import TrackSummary from './TrackSummary.js';
import { Link } from 'react-router';

class TrackList extends Component {
  static propTypes = {
    trackStore: PropTypes.array.isRequired,
    newTrack: PropTypes.func,
  }

  render() {
    return (
      <div>
        <div>
          <h2>Your tracks</h2>
          {this.props.trackStore.map((track, index) =>
            <Link to={`/tracks/${index}`} key={index}>
                <TrackSummary track={track} />
            </Link>
          )}
        </div>
        <button onClick={this.props.newTrack}>New track</button>
      </div>
    );
  }
}

export default TrackList;
