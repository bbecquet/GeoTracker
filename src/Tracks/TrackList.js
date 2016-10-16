import React, { Component, PropTypes } from 'react';
import TrackSummary from './TrackSummary.js';
import { Link } from 'react-router';

class TrackList extends Component {
  constructor() {
    super();
    this.state = { tracks: null };
  }

  static propTypes = {
    trackStore: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.refreshTrackList();
  }

  refreshTrackList() {
    this.props.trackStore.getTrackList(tracks => {
      this.setState({ tracks });
    });
  }

  addTrack() {
    this.props.trackStore.createTrack(
      track => {
        this.refreshTrackList();
    	},
      () => {
    		console.error('Error creating new track');
      }
    );
  }

  renderList(tracks) {
    if(!tracks) { return 'Loading tracks'; }

    if(tracks.length === 0) { return 'No track yet'; }

    return tracks.reverse().map(track =>
      <Link to={`/tracks/${track.id}`} key={track.id}>
        <TrackSummary track={track} />
      </Link>
    )
  }

  render() {
    return (
      <div>
        <h2>Your tracks</h2>
        <div>
          {this.renderList(this.state.tracks)}
        </div>
        <button onClick={() => {this.addTrack()}}>New track</button>
      </div>
    );
  }
}

export default TrackList;
