import React, { createContext, useReducer } from "react";
import { readSettings, reducer as settingsReducer } from "./settings";
import PropTypes from "prop-types";

export const SettingsContext = createContext();

export const SettingsContextProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, readSettings());

  return (
    <SettingsContext.Provider value={[settings, dispatch]}>
      {children}
    </SettingsContext.Provider>
  );
};

SettingsContextProvider.propTypes = {
  children: PropTypes.node,
};
