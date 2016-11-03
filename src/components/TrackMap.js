import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import _ from 'lodash';
import './TrackMap.css';
import '../../node_modules/leaflet/dist/images/layers.png';
import '../../node_modules/leaflet/dist/leaflet.css';
import arrowIcon from '../imgs/arrow.svg';
import { getSetting } from '../models/settings';

class TrackMap extends Component {
    static propTypes = {
        backgroundTileDef: PropTypes.object.isRequired,
        initialPositions: PropTypes.array,
        newPosition: PropTypes.object,
    }

    static defaultProps = {
        initialPositions: [],
    }

    positionToLatLng(p) {
        return [p.coords.latitude, p.coords.longitude];
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

    addNewPosition(newPosition) {
        const newCoord = this.positionToLatLng(newPosition);
        this.polyline.addLatLng(newCoord);
        this.map.setView(newCoord);
        this.positionMarker
            .setLatLng(newCoord)
            .setRotationAngle(newPosition.coords.heading)
            .addTo(this.map);
    }

    componentDidMount() {
        this.initMap();

        this.positionMarker = L.marker(this.map.getCenter(), {
            icon: L.icon({
                iconUrl: arrowIcon,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            }),
            rotationAngle: 0,
            rotationOrigin: 'center center',
        });

        const coords = this.props.initialPositions.map(this.positionToLatLng);
        this.polyline = L.polyline(coords, {
            // TODO: style
        }).addTo(this.map);
        if(coords.length) {
            this.map.fitBounds(L.latLngBounds(coords));
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.newPosition &&
            (!this.props.newPosition || nextProps.newPosition.timestamp !== this.props.newPosition.timestamp)) {
            this.addNewPosition(nextProps.newPosition);
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
