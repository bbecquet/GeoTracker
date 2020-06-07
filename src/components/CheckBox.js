import React from "react";
import "./CheckBox.css";

const CheckBox = props => (
  <div className="checkbox">
    <input {...props} />
    <div className="checkbox-check" />
  </div>
);

export default CheckBox;
