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
    this.props.trackStore.addTrack(
      track => {
        this.refreshTrackList();
    	},
      () => {
    		console.error('Error creating new track');
      }
    );
  }

  render() {
    const tracks = this.state.tracks;

    return (
      <div>
        <h2>Your tracks</h2>
        <div>
          {!tracks
            ? 'Loading tracks…'
            : tracks.length === 0
              ? 'No track yet'
              : tracks.map(track =>
                <Link to={`/tracks/${track.id}`} key={track.id}>
                  <TrackSummary track={track} />
                </Link>
              )
          }
        </div>
        <button onClick={() => {this.addTrack()}}>New track</button>
      </div>
    );
  }
}

export default TrackList;
