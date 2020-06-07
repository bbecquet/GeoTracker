import React from "react";
import PropTypes from "prop-types";
import { getLength, getDuration } from "../models/trackUtils";
import Length from "./Length";
import Duration from "./Duration";
import "./TrackStats.css";

const TrackStats = ({ positions, imperialSystem }) => (
  <div className="trackStats">
    <div>{`${positions.length} points`}</div>
    <div>
      <Length meters={getLength(positions)} imperialSystem={imperialSystem} />
    </div>
    <div>
      <Duration milliseconds={getDuration(positions)} />
    </div>
  </div>
);

TrackStats.propTypes = {
  positions: PropTypes.array.isRequired,
  imperialSystem: PropTypes.bool,
};

export default TrackStats;
