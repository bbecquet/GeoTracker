import React from 'react';
import PropTypes from 'prop-types';
import TrackMap from './TrackMap';

const MapBackgroundChooser = ({ activeMapTiles, mapTiles, changeMapTiles }) =>
    <div>
        <select
            onChange={e => { changeMapTiles(e.target.value) }}
            value={activeMapTiles}
        >
            {Object.keys(mapTiles).map(mapTilesKey =>
                <option
                    key={mapTilesKey}
                    value={mapTilesKey}
                >
                    {mapTiles[mapTilesKey].name}
                </option>
            )}
        </select>
        <div style={{ height: '200px', margin: '0.5em 0' }}>
            <TrackMap backgroundTileDef={mapTiles[activeMapTiles]} />
        </div>
    </div>;

MapBackgroundChooser.propTypes = {
    activeMapTiles: PropTypes.string.isRequired,
    mapTiles: PropTypes.object.isRequired,
    changeMapTiles: PropTypes.func.isRequired,
}

export default MapBackgroundChooser;
