import React, { useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import 'chartjs-adapter-luxon'; // replace momentjs by luxon in ChartJS
import { SettingsContext } from '../models/SettingsContext';

function toGraphData(positions) {
  return positions.map(pos => ({
    x: pos.timestamp,
    y: pos.coords.altitude,
  }));
}

const TrackGraph = ({ positions }) => {
  const graphRef = useRef(null);
  const [settings] = useContext(SettingsContext);

  useEffect(() => {
    new Chart(graphRef.current, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Altitude',
            data: toGraphData(positions),
            fill: false,
            borderColor: settings.trackColor,
          },
        ],
      },
      options: {
        animation: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                minUnit: 'second',
                displayFormats: {
                  second: 'HH:mm:ss',
                  minute: 'HH:mm',
                },
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: 'Meters',
              },
            },
          ],
        },
      },
    });
  });

  return <canvas ref={graphRef} />;
};

TrackGraph.propTypes = {
  positions: PropTypes.array.isRequired,
};

export default TrackGraph;
