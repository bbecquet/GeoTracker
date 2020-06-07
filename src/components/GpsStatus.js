import React from 'react';
import PropTypes from 'prop-types';
import Length from './Length';
import './GpsStatus.css';
import classnames from 'classnames';

const GpsStatus = ({ position, validAccuracy, imperialSystem }) => {
  const coords = position && position.coords;

  return (
    <div
      className={classnames('gpsStatus padding', {
        'gpsStatus--active': position,
        'gpsStatus--invalidAccuracy': !validAccuracy,
      })}
    >
      <div className="gpsStatus-accuracy">
        Accuracy:{' '}
        {coords ? (
          <Length meters={coords.accuracy} imperialSystem={imperialSystem} />
        ) : (
          '-'
        )}
      </div>
      <div className="gpsStatus-indicator" />
    </div>
  );
};

GpsStatus.propTypes = {
  position: PropTypes.object,
  validAccuracy: PropTypes.bool,
  imperialSystem: PropTypes.bool,
};

export default GpsStatus;
