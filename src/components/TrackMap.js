import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import _ from 'lodash';
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

    positionToLatLng(p) {
        return [p.coords.latitude, p.coords.longitude];
    }

    positionsToLatLng(positions) {
        return positions.map(this.positionToLatLng);
    }

    setLayer(backgroundTileDef) {
        if (this.bgLayer) {
            this.map.removeLayer(this.bgLayer);
        }
        this.bgLayer = L.tileLayer(backgroundTileDef.url, backgroundTileDef.options);
        this.map.addLayer(this.bgLayer);
    }

    initMap() {
        const useImperialScale = getSetting('lengthUnit') === 'imperial';

        this.map = L.map(this.mapElement, {
            // TODO: put map options in global settings?
            center: [48.85, 2.35],
            zoom: 18,
            attributionControl: false,  // TODO: move it to an 'about' screen
            zoomControl: false,
            boxZoom: false,
        })
            .addControl(L.control.zoom({ position: 'bottomright' }))
            .addControl(L.control.scale({
                imperial: useImperialScale,
                metric: !useImperialScale,
            }));

        this.setLayer(this.props.backgroundTileDef);
    }

    componentDidMount() {
        this.initMap();

        const coords = this.positionsToLatLng(this.props.positions);
        this.polyline = L.polyline(coords, {
            // TODO: style
        }).addTo(this.map);
        if(coords.length) {
            this.map.fitBounds(L.latLngBounds(coords));
        }
    }

    addNewPosition(position) {
        const newCoord = this.positionToLatLng(position);
        this.polyline.addLatLng(newCoord);
        this.map.setView(newCoord);
    }

    isSameWithNewPoint(newPositions) {
        // TODO: real test
        return newPositions.length === this.props.positions.length + 1;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.positions && nextProps.positions.length) {
            if (this.isSameWithNewPoint(nextProps.positions)) {
                this.addNewPosition(_.last(nextProps.positions));
            } else {
                const newCoords = this.positionsToLatLng(nextProps.positions);
                this.polyline.setLatLngs(newCoords);
                this.map.setView(_.last(newCoords));
            }
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
