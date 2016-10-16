import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import './TrackMap.css';
// TODO: find how to import that from node_modules
import './images/layers.png';
import './leaflet.css';

class TrackMap extends Component {
  static propTypes = {
    positions: PropTypes.array.isRequired,
  }

  static defaultProps = {
    positions: [],
  }

  positionsToLatLng() {
    return this.props.positions.map(p => [p.coords.latitude, p.coords.longitude]);
  }

  componentDidMount() {
    this.map = L.map(this.mapElement, {
        // TODO: put map options in global settings?
        center: [48.85, 2.35],
        zoom: 10,
        layers: [
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }),
        ],
    });
    const coords = this.positionsToLatLng();
    this.polyline = L.polyline(coords).addTo(this.map);
    if(coords.length) {
      this.map.fitBounds(L.latLngBounds(coords));
    }
  }

  componentWillReceiveProps(nextProps) {
    const newCoords = this.positionsToLatLng();
    // TODO:PERFS: When only the last point is new, just use Polyline.addLatLng
    if(newCoords.length) {
      this.polyline.setLatLngs(newCoords);
      this.map.setView(newCoords[newCoords.length - 1]);
    }
  }

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div className="map" ref={m => this.mapElement = m} />;
  }
}

export default TrackMap;
