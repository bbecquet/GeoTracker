import React from "react";
import PropTypes from "prop-types";

const zero2Pad = x => {
  const s = x.toString();
  return s.length >= 2 ? s : "0" + s;
};

function formatDuration(duration) {
  const seconds = Math.abs(Math.ceil(duration / 1000));
  const h = (seconds - (seconds % 3600)) / 3600;
  const m = ((seconds - (seconds % 60)) / 60) % 60;
  const s = seconds % 60;
  if (h > 0) {
    return `${h}\u00a0h\u00a0${zero2Pad(m)}\u00a0m`;
  }
  if (m > 0) {
    return `${m}\u00a0m\u00a0${zero2Pad(s)}\u00a0s`;
  }
  return `${s}\u00a0s`;
}

const Duration = ({ milliseconds }) => (
  <span>{formatDuration(milliseconds)}</span>
);

Duration.propTypes = {
  milliseconds: PropTypes.number.isRequired,
};

export default Duration;
