import React, { Component, PropTypes } from 'react';
import TrackSummary from './TrackSummary.js';
import TrackStats from './TrackStats.js';
import { Link, withRouter } from 'react-router';
import TrackMap from '../Map/TrackMap.js';

class SingleTrack extends Component {
  constructor() {
    super();
    this.state = {
      track: null,
      positions: [],
    };
  }

  static propTypes = {
    trackStore: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10), track => {
      this.props.trackStore.getTrackPositions(track.id, positions => {
        this.setState({ track, positions });
      });
    });
  }

  backToTrackList() {
    this.props.router.push('/tracks');
  }

  deleteTrack() {
    // if(!confirm('Are you sure you want to delete this track?')) { return; }
    this.props.trackStore.deleteTrack(parseInt(this.props.params.trackId, 10), () => {
        this.backToTrackList();
    });
  }

  render() {
    const track = this.state.track;

    if (!track) {
      return (<div>Loading...</div>);
    }

    return (<div>
        <header>
            <button onClick={() => { this.backToTrackList(); }}>{'<'}</button>
            Track
        </header>
        <main>
            <TrackSummary track={track} />
            <TrackStats {...this.state} />
            <div className="mapContainer">
              <TrackMap positions={this.state.positions} />
            </div>
            <div>
                <Link to={`/tracks/${track.id}/tracking`}>Resume</Link>
                <button onClick={() => { this.deleteTrack(); }}>Delete</button>
            </div>
        </main>
    </div>);
  }
}

export default withRouter(SingleTrack);
