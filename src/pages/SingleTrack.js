import React, { Component, PropTypes } from 'react';
import TrackSummary from '../components/TrackSummary';
import TrackStats from '../components/TrackStats';
import TrackMap from '../components/TrackMap';
import { exportTrackAsGpx } from '../models/trackUtils';
import { mapTileDefs, mapSettingsToProps } from '../models/settings';
import PageHeader from '../components/PageHeader';
import deleteIcon from '../imgs/delete.svg';
import exportIcon from '../imgs/file-export.svg';
import { getTrack, getTrackPositions, deleteTrack } from '../models/trackStorage';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class SingleTrack extends Component {
    state = {
        track: null,
        positions: [],
    };

    static propTypes = {
        match: PropTypes.object,
        settings: PropTypes.object.isRequired,
    }

    componentWillMount() {
        getTrack(parseInt(this.props.match.params.trackId, 10))
        .then(track => {
            getTrackPositions(track.id)
            .then(positions => {
                this.setState({ track, positions });
            });
        });
    }

    deleteTrack() {
        if(!confirm('Are you sure you want to delete this track?')) { return; }
        deleteTrack(parseInt(this.props.match.params.trackId, 10))
        .then(() => { this.props.history.push('/tracks'); });
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

export default connect(mapSettingsToProps)(withRouter(SingleTrack));
