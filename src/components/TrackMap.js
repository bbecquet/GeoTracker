import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import './TrackMap.css';
import '../../node_modules/leaflet/dist/images/layers.png';
import '../../node_modules/leaflet/dist/leaflet.css';
import { getSetting } from '../models/settings';

class TrackMap extends Component {
    static propTypes = {
        backgroundTileDef: PropTypes.object.isRequired,
        positions: PropTypes.array,
    }

    static defaultProps = {
        positions: [],
    }

    positionsToLatLng() {
        return this.props.positions.map(p => [p.coords.latitude, p.coords.longitude]);
    }

    setLayer(backgroundTileDef) {
        if (this.bgLayer) {
            this.map.removeLayer(this.bgLayer);
        }
        this.bgLayer = L.tileLayer(backgroundTileDef.url, backgroundTileDef.options);
        this.map.addLayer(this.bgLayer);
    }

    componentDidMount() {
        this.map = L.map(this.mapElement, {
            // TODO: put map options in global settings?
            center: [48.85, 2.35],
            zoom: 18,
            zoomControl: false,
        });
        this.setLayer(this.props.backgroundTileDef);
        const useImperialScale = getSetting('lengthUnit') === 'imperial';
        L.control.scale({
            imperial: useImperialScale,
            metric: !useImperialScale,
        }).addTo(this.map);

        const coords = this.positionsToLatLng();
        this.polyline = L.polyline(coords, {
            // TODO: style
        }).addTo(this.map);
        if(coords.length) {
            this.map.fitBounds(L.latLngBounds(coords));
        }
    }

    componentWillReceiveProps(nextProps) {
        const newCoords = this.positionsToLatLng();
        // TODO:PERFS: When only the last point is new, just use Polyline.addLatLng
        if (newCoords.length) {
            this.polyline.setLatLngs(newCoords);
            this.map.setView(newCoords[newCoords.length - 1]);
        }
        if (nextProps.backgroundTileDef !== this.props.backgroundTileDef) {
            this.setLayer(nextProps.backgroundTileDef);
        }
    }

    componentWillUnmount() {
        this.map.remove();
    }

    render() {
        // As it doesn't depend on any props or state,
        // it won't get re-rendered
        return <div className="map" ref={m => this.mapElement = m} />;
    }
}

export default TrackMap;
