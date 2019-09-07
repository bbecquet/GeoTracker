import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TrackMap from './TrackMap';

class MapBackgroundChooser extends Component {
    static propTypes = {
        activeMapTiles: PropTypes.string.isRequired,
        mapTiles: PropTypes.object.isRequired,
        changeMapTiles: PropTypes.func.isRequired,
    }

    handleChangeStyle(e) {
        this.props.changeMapTiles(e.target.value);
    }

    render() {
        const activeMapTileDef = this.props.mapTiles[this.props.activeMapTiles];

        return <div>
            <select
                onChange={e => { this.handleChangeStyle(e) }}
                value={this.props.activeMapTiles}
            >
                {Object.keys(this.props.mapTiles).map(mapTilesKey =>
                    <option
                        key={mapTilesKey}
                        value={mapTilesKey}
                    >
                        {this.props.mapTiles[mapTilesKey].name}
                    </option>
                )}
            </select>
            <div style={{ height: '200px', margin: '0.5em 0' }}>
                <TrackMap backgroundTileDef={activeMapTileDef} ></TrackMap>
            </div>
        </div>;
    }
}

export default MapBackgroundChooser;
