import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
// TODO: find how to import that from node_modules
import './images/layers.png';
import './leaflet.css';
import { getSetting } from '../models/settings';
import _ from 'lodash';

class MapBackgroundChooser extends Component {
    static propTypes = {
        activeMapTiles: PropTypes.string.isRequired,
        mapTiles: PropTypes.object.isRequired,
        changeMapTiles: PropTypes.func.isRequired,
    }

    componentDidMount() {
        this.map = L.map(this.mapElement, {
            center: [48.85, 2.35],
            zoom: 12,
            scrollWheelZoom: false,
        });
        this.setLayer(this.props.activeMapTiles);
    }

    componentWillReceiveProps(nextProps) {
        this.setLayer(nextProps.activeMapTiles);
    }

    componentWillUnmount() {
        this.map.remove();
    }

    setLayer(mapTileKey) {
        if (this.bgLayer) {
            this.map.removeLayer(this.bgLayer);
        }
        const activeMapTileDef = this.props.mapTiles[mapTileKey];
        this.bgLayer = L.tileLayer(activeMapTileDef.url, activeMapTileDef.options);
        this.map.addLayer(this.bgLayer);
    }

    handleChangeStyle(e) {
        this.props.changeMapTiles(e.target.value);
    }

    render() {
        return <div>
            <select onChange={e => { this.handleChangeStyle(e) }}>
                {_.keys(this.props.mapTiles).map(mapTilesKey =>
                    <option key={mapTilesKey} value={mapTilesKey}>
                        {this.props.mapTiles[mapTilesKey].name}
                    </option>
                )}
            </select>
            <div style={{ height: '200px', margin: '0.5em 0' }}>
                <div className="map" ref={m => this.mapElement = m} />
            </div>
        </div>;
    }
}

export default MapBackgroundChooser;
