import React, { Component, PropTypes } from 'react';
import TrackSummary from './TrackSummary.js';
import TrackStats from './TrackStats.js';
import { Link, withRouter } from 'react-router';

class SingleTrack extends Component {
  constructor() {
    super();
    this.state = { track: null };
  }

  static propTypes = {
    trackStore: PropTypes.object.isRequired,
  }

  componentWillMount() {
    this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10), track => {
      this.setState({ track });
    });
  }

  deleteTrack() {
    // if(!confirm('Are you sure you want to delete this track?')) { return; }
    this.props.trackStore.deleteTrack(parseInt(this.props.params.trackId, 10), () => {
      this.props.router.push('/tracks');
    });
  }

  render() {
    const track = this.state.track;

    if (!track) {
      return (<div>Loading...</div>);
    }

    return (<div>
        <TrackSummary track={track} />
        <TrackStats track={track} />
        <Link to={`/tracks/${track.id}/tracking`}>Resume</Link>
        <button onClick={() => { this.deleteTrack() }}>Delete</button>
        <Link to={`/tracks/${track.id}/map`}>See on map</Link>
    </div>);
  }
}

export default withRouter(SingleTrack);
