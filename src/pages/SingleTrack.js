import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import TrackSummary from '../components/TrackSummary';
import TrackStats from '../components/TrackStats';
import TrackMap from '../components/TrackMap';
import { exportTrackAsGpx } from '../models/trackUtils';
import { mapTileDefs } from '../models/settings';
import PageHeader from '../components/PageHeader';
import deleteIcon from '../imgs/delete.svg';
import exportIcon from '../imgs/file-export.svg';

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
        settings: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.props.trackStore.getTrack(parseInt(this.props.params.trackId, 10))
        .then(track => {
            this.props.trackStore.getTrackPositions(track.id)
            .then(positions => {
                this.setState({ track, positions });
            });
        });
    }

    deleteTrack() {
        // if(!confirm('Are you sure you want to delete this track?')) { return; }
        this.props.trackStore.deleteTrack(parseInt(this.props.params.trackId, 10))
        .then(() => { this.props.router.push('/tracks'); });
    }

    exportTrack() {
        exportTrackAsGpx(this.state.track, this.state.positions)
    }

    render() {
        const settings = this.props.settings;
        const track = this.state.track;
        const useImperialSystem = settings.lengthUnit === 'imperial';

        return (<div>
            <PageHeader
                title="Track"
                backPath="/tracks"
                rightChild={
                    <div>
                        <button onClick={() => { this.deleteTrack(); }}>
                            <img src={deleteIcon} alt="" />
                        </button>
                        <button onClick={() => { this.exportTrack(); }}>
                            <img src={exportIcon} alt="" />&nbsp;Export
                        </button>
                    </div>
                }
            />
            {track ? <main>
                <div className="padding">
                    <TrackSummary track={track} />
                    <TrackStats {...this.state} imperialSystem={useImperialSystem} />
                </div>
                <div className="mapContainer">
                    <TrackMap
                        initialPositions={this.state.positions}
                        backgroundTileDef={mapTileDefs[settings.mapTiles]}
                        imperialSystem={useImperialSystem}
                    />
                </div>
            </main> : <main>
                <div className="padding">Loading…</div>
            </main>}
        </div>);
    }
}

export default withRouter(SingleTrack);
