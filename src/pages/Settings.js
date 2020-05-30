import React, { useContext } from 'react';
import { mapTileDefs } from '../models/settings';
import Page from '../components/Page';
import MapBackgroundChooser from '../components/MapBackgroundChooser';
import Length from '../components/Length';
import { clearTrackDatabase } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';

const TitleDesc = ({ title, desc }) =>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
        <div className="text-subtitle" style={{ marginRight: '1em', flexShrink: 0 }}>{title}</div>
        {desc && <div className="text-caption">{desc}</div>}
    </div>;

const Settings = () => {
    const [settings, dispatch] = useContext(SettingsContext);

    const changeSetting = (key, value) => dispatch({
        type: 'SETTING_CHANGE',
        payload: { key, value },
    });

    const handleChangeGps = e => {
        changeSetting('gps.simulatePositions', e.target.checked);
    }

    const handleChangeUnit = e => {
        changeSetting('lengthUnit', e.target.value);
    }

    const handleChangeAccuracy = e => {
        changeSetting('maxAccuracy', parseInt(e.target.value, 10));
    }

    const changeMapTiles = newTilesKey => {
        changeSetting('mapTiles', newTilesKey);
    }

    const handleResetDatabase = () => {
        if (!confirm('This will delete all your tracks. Are you sure?')) { return; }
        clearTrackDatabase()
            .then(() => { alert('Database cleared'); })
            .catch(event => { alert('Error: ' + event); });
    }

    const maxAccuracy = parseInt(settings.maxAccuracy, 10);
    const imperialSystem = settings.lengthUnit === 'imperial';

    return <Page
        title="Settings"
        backPath="/tracks"
    >
        <fieldset>
            <legend>Display</legend>
            <div className="padding">
                <div className="setting">
                    <TitleDesc title="Length units" desc="For distances and map scale" />
                    <div>
                        <label>
                            <input
                                name="lengthUnit"
                                value="metric"
                                type="radio"
                                checked={!imperialSystem}
                                onChange={handleChangeUnit}
                            />
                            Metric
                        </label>
                        <label>
                            <input
                                name="lengthUnit"
                                value="imperial"
                                type="radio"
                                checked={imperialSystem}
                                onChange={handleChangeUnit}
                            />
                            Imperial
                        </label>
                    </div>
                </div>
                <div className="setting">
                    <TitleDesc title="Map background style" />
                    <MapBackgroundChooser
                        activeMapTiles={settings.mapTiles}
                        mapTiles={mapTileDefs}
                        changeMapTiles={changeMapTiles}
                    />
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>GPS</legend>
            <div className="padding">
                <div className="setting">
                    <TitleDesc title="Accuracy limit" desc="Bad accuracy positions will be ignored" />
                    <input type="range"
                        min={10} max={500} step={10}
                        value={maxAccuracy}
                        onChange={handleChangeAccuracy}
                    />&nbsp;
                    <Length
                        meters={maxAccuracy}
                        imperialSystem={imperialSystem}
                    />
                </div>
                <div className="setting">
                    <TitleDesc title="Fake GPS" desc="For easy indoor debugging" />
                    <label>
                        <input
                            type="checkbox"
                            checked={settings['gps.simulatePositions']}
                            onChange={handleChangeGps}
                        />
                        Use fake GPS positions
                    </label>
                </div>
            </div>
        </fieldset>
        <fieldset>
            <legend>Data</legend>
            <div className="padding">
                <div className="setting">
                    <TitleDesc title="Reset database" desc="Will remove all tracks" />
                    <button onClick={handleResetDatabase}>Reset database</button>
                </div>
            </div>
        </fieldset>
    </Page>;
}

export default Settings;
