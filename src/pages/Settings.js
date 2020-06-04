import React, { useContext, useState, useEffect } from 'react';
import { mapTileDefs } from '../models/settings';
import Page from '../components/Page';
import TrackMap from '../components/TrackMap';
import Length from '../components/Length';
import Setting from '../components/Setting';
import { clearTrackDatabase, getTrackList } from '../models/trackStorage';
import { SettingsContext } from '../models/SettingsContext';
import fakeCoords from '../models/fakeGpsCoords.json';

const fakeTrack = fakeCoords.map(([ longitude, latitude ]) => ({ coords: { latitude, longitude }}));

const Settings = () => {
    const [settings, dispatch] = useContext(SettingsContext);
    const [nbTracks, setNbTracks] = useState(0);

    useEffect(() => {
        getTrackList().then(tracks => { setNbTracks(tracks.length); });
    }, []);

    const changeSetting = (key, value) => dispatch({
        type: 'SETTING_CHANGE',
        payload: { key, value },
    });

    const handleChangeGps = e => changeSetting('gps.simulatePositions', e.target.checked);
    const handleChangeUnit = e => changeSetting('lengthUnit', e.target.checked ? 'imperial' : 'metric');
    const handleChangeAccuracy = e => changeSetting('maxAccuracy', parseInt(e.target.value, 10));
    const changeMapTiles = e => changeSetting('mapTiles', e.target.value);
    const changeTrackColor = e => changeSetting('trackColor', e.target.value);
    const changeTrackWeight = e => changeSetting('trackWeight', parseInt(e.target.value, 10));

    const handleResetDatabase = () => {
        if (!confirm('This will delete all your tracks. Are you sure?')) { return; }
        clearTrackDatabase()
            .then(() => { setNbTracks(0); })
            .catch(event => { alert('Error: ' + event); });
    }

    const trackWeight = parseInt(settings.trackWeight, 10);
    const maxAccuracy = parseInt(settings.maxAccuracy, 10);
    const imperialSystem = settings.lengthUnit === 'imperial';

    return <Page title="Settings" backPath="/tracks">
        <fieldset>
            <legend>Display</legend>
            <ul className="padding-h-m">
                <li>
                    <div style={{ height: '200px', margin: '0.5em 0' }}>
                        <TrackMap positions={fakeTrack} fit />
                    </div>
                    <Setting title="Map tiles" desc="Background style for map views" className="padding-v-m">
                        <select onChange={changeMapTiles} value={settings.mapTiles}>
                            {Object.keys(mapTileDefs).map(mapTilesKey =>
                                <option key={mapTilesKey} value={mapTilesKey}>
                                    {mapTileDefs[mapTilesKey].name}
                                </option>
                            )}
                        </select>
                    </Setting>
                </li>
                <li>
                    <Setting title="Track color" desc="Color of the track line" className="padding-v-m">
                        <select onChange={changeTrackColor} value={settings.trackColor}>
                            {['blue', 'red', 'green', 'purple'].map(trackColor =>
                                <option key={trackColor} value={trackColor}>
                                    {trackColor}
                                </option>
                            )}
                        </select>
                    </Setting>
                </li>
                {/* <li>
                    <Setting title="Track weight" desc="Witdh of the track line">
                        <div>
                            <div className="u-block u-right">{trackWeight}</div>
                            <input type="range"
                                min={1} max={10} step={1}
                                value={trackWeight}
                                onChange={changeTrackWeight}
                            />
                        </div>
                    </Setting>
                </li> */}
                <li>
                    <Setting asLabel title="Use imperial system" desc="For distances and map scale" className="padding-v-m">
                        <input
                            name="lengthUnit"
                            type="checkbox"
                            checked={imperialSystem}
                            onChange={handleChangeUnit}
                        />
                    </Setting>
                </li>
            </ul>
        </fieldset>
        <fieldset>
            <legend>GPS</legend>
            <ul className="padding-h-m">
                <li>
                    <Setting title="Accuracy limit" desc="Bad accuracy positions will be ignored" className="padding-v-m">
                        <div>
                            <Length
                                className="u-block u-right" 
                                meters={maxAccuracy}
                                imperialSystem={imperialSystem}
                            />
                            <input type="range"
                                min={10} max={500} step={10}
                                value={maxAccuracy}
                                onChange={handleChangeAccuracy}
                            />
                        </div>
                    </Setting>
                </li>
                <li>
                    <Setting asLabel title="Use fake GPS positions" desc="For easy indoor debugging" className="padding-v-m">
                        <input
                            type="checkbox"
                            checked={settings['gps.simulatePositions']}
                            onChange={handleChangeGps}
                        />
                    </Setting>
                </li>
            </ul>
        </fieldset>
        <fieldset>
            <legend>Data</legend>
            <ul className="padding-h-m">
                <li>
                    <Setting title="Reset database" desc="Will remove all tracks" className="padding-v-m">
                        <button onClick={handleResetDatabase} disabled={nbTracks === 0}>
                            {nbTracks ? 'Reset database' : 'No recorded tracks'}
                        </button>
                    </Setting>
                </li>
            </ul>
        </fieldset>
    </Page>;
}

export default Settings;
