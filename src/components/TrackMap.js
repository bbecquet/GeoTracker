import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import './TrackMap.css';
import '../../node_modules/leaflet/dist/images/layers.png';
import '../../node_modules/leaflet/dist/leaflet.css';
import arrowIcon from '../imgs/arrow.svg';

const positionToLatLng = p => [p.coords.latitude, p.coords.longitude];

let map, bgLayer, positionMarker, polyline;
const setLayer = backgroundTileDef => {
    if (bgLayer) {
        map.removeLayer(bgLayer);
    }
    bgLayer = L.tileLayer(backgroundTileDef.url, backgroundTileDef.options);
    map.addLayer(bgLayer);
}

const addNewPosition = newPosition => {
    const newCoord = positionToLatLng(newPosition);
    polyline.addLatLng(newCoord);
    map.setView(newCoord);
    positionMarker
        .setLatLng(newCoord)
        .setRotationAngle(newPosition.coords.heading)
        .addTo(map);
}

const TrackMap = ({ backgroundTileDef, initialPositions, newPosition, validAccuracy, imperialSystem }) => {
    const mapElement = useRef(null);

    useEffect(() => {
        initMap();
        positionMarker = L.marker(map.getCenter(), {
            icon: L.icon({
                iconUrl: arrowIcon,
                iconSize: [24, 24],
                iconAnchor: [12, 12],
            }),
            rotationAngle: 0,
            rotationOrigin: 'center center',
        });

        const coords = initialPositions.map(positionToLatLng);
        polyline = L.polyline(coords, {
            // TODO: style
        }).addTo(map);
        if (coords.length) {
            map.fitBounds(L.latLngBounds(coords));
        }

        return () => { map.remove(); }
    }, []);

    const initMap = () => {
        const useImperialScale = imperialSystem;

        map = L.map(mapElement.current, {
            // TODO: put map options in global settings?
            center: [48.85, 2.35],
            zoom: 18,
            attributionControl: false,
            zoomControl: false,
            boxZoom: false,
        })
            .addControl(L.control.zoom({ position: 'bottomright' }))
            .addControl(L.control.scale({
                imperial: useImperialScale,
                metric: !useImperialScale,
            }));

        setLayer(backgroundTileDef);
    }

    useEffect(() => {
        setLayer(backgroundTileDef);
    }, [backgroundTileDef]);

    useEffect(() => {
        if (newPosition && validAccuracy) {
            addNewPosition(newPosition);
        }
    }, [newPosition, validAccuracy]);

    // Simple placeholder for a Leaflet map, won't get re-rendered
    return <div className="map" ref={mapElement} />;
}

TrackMap.propTypes = {
    backgroundTileDef: PropTypes.object.isRequired,
    initialPositions: PropTypes.array,
    newPosition: PropTypes.object,
    validAccuracy: PropTypes.bool,
    imperialSystem: PropTypes.bool,
}

TrackMap.defaultProps = {
    initialPositions: [],
}

export default TrackMap;
