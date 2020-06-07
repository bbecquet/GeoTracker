import { useContext, useEffect } from 'react';
import { SettingsContext } from '../models/SettingsContext';

const ThemeManager = ({ children }) => {
  const [settings] = useContext(SettingsContext);
  const theme = settings.theme;

  useEffect(() => {
    document.body.classList.toggle('color-scheme-light', theme === 'light'),
      document.body.classList.toggle('color-scheme-dark', theme === 'dark');
  }, [theme]);

  return children;
};

export default ThemeManager;
