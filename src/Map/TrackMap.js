import React, { Component, PropTypes } from 'react';
import L from 'leaflet';
import './TrackMap.css';
// TODO: find how to import that from node_modules
import './images/layers.png';
import './leaflet.css';

class TrackMap extends Component {
  static propTypes = {
    track: PropTypes.object.isRequired,
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
  }

  // TODO: convert props changes to Leaflet instructions
  // shouldComponentUpdate() {}

  componentWillUnmount() {
    this.map.remove();
  }

  render() {
    return <div className="map" ref={m => this.mapElement = m} />;
  }
}

export default TrackMap;
