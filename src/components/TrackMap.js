import React, { useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet-rotatedmarker";
import "./TrackMap.css";
import "../../node_modules/leaflet/dist/images/layers.png";
import "../../node_modules/leaflet/dist/leaflet.css";
import arrowIcon from "../imgs/arrow.svg";
import { SettingsContext } from "../models/SettingsContext";
import { mapTileDefs } from "../models/settings";

const positionToLatLng = p => [p.coords.latitude, p.coords.longitude];

let map, bgLayer, positionMarker, polyline, scale;

const setLayer = backgroundTileDef => {
  if (bgLayer) {
    map.removeLayer(bgLayer);
  }
  bgLayer = L.tileLayer(backgroundTileDef.url, backgroundTileDef.options);
  map.addLayer(bgLayer);
};

const getPositionMarker = () => {
  return (positionMarker =
    positionMarker ||
    L.marker(map.getCenter(), {
      icon: L.icon({
        iconUrl: arrowIcon,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
      rotationAngle: 0,
      rotationOrigin: "center center",
    }));
};

const TrackMap = ({ positions, fit, followPosition }) => {
  const mapElement = useRef(null);
  const [settings] = useContext(SettingsContext);
  const imperialSystem = settings.lengthUnit === "imperial";
  const backgroundTileDef = mapTileDefs[settings.mapTiles];
  const trackColor = settings.trackColor;
  // const trackWeight = parseInt(settings.trackWeight, 10);

  useEffect(() => {
    console.log(backgroundTileDef);
    map = L.map(mapElement.current, {
      // TODO: put map options in global settings?
      center: [48.85, 2.35],
      zoom: backgroundTileDef.options.maxZoom || 18,
      attributionControl: false,
      zoomControl: false,
      boxZoom: false,
    }).addControl(L.control.zoom({ position: "bottomright" }));
    polyline = L.polyline([], { color: trackColor }).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    setLayer(backgroundTileDef);
  }, [backgroundTileDef]);

  useEffect(() => {
    if (scale) {
      scale.remove();
    }
    scale = L.control.scale({
      imperial: imperialSystem,
      metric: !imperialSystem,
    });
    map.addControl(scale);
  }, [imperialSystem]);

  useEffect(() => {
    const coords = positions.map(positionToLatLng);
    polyline.setLatLngs(coords);

    const lastCoords = coords[coords.length - 1];
    if (lastCoords) {
      getPositionMarker()
        .setLatLng(lastCoords)
        .setRotationAngle(positions[positions.length - 1].coords.heading)
        .addTo(map);
    }
    if (lastCoords && followPosition) {
      map.setView(lastCoords);
    }
  }, [positions, followPosition]);

  useEffect(() => {
    if (fit) {
      getPositionMarker().remove();
      if (positions.length > 0) {
        map.fitBounds(L.latLngBounds(polyline.getLatLngs()));
      }
    }
  }, [positions, fit]);

  useEffect(() => {
    polyline.setStyle({ color: trackColor /*, weight: trackWeight */ });
  }, [trackColor /*, trackWeight */]);

  // Simple placeholder for a Leaflet map, won't get re-rendered
  return <div className="map" ref={mapElement} />;
};

TrackMap.propTypes = {
  positions: PropTypes.array,
  fit: PropTypes.bool,
  followPosition: PropTypes.bool,
};

TrackMap.defaultProps = {
  positions: [],
};

export default TrackMap;
