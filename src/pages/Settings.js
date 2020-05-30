import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mapTileDefs, mapSettingsToProps } from '../models/settings';
import Page from '../components/Page';
import MapBackgroundChooser from '../components/MapBackgroundChooser';
import Length from '../components/Length';
import { clearTrackDatabase } from '../models/trackStorage';
import { connect } from 'react-redux';

const TitleDesc = ({ title, desc }) =>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5em' }}>
        <div className="text-subtitle" style={{ marginRight: '1em', flexShrink: 0 }}>{title}</div>
        {desc && <div className="text-caption">{desc}</div>}
    </div>;

class Settings extends Component {
    static propTypes = {
        settings: PropTypes.object.isRequired,
        changeSetting: PropTypes.func.isRequired,
    }

    handleChangeGps(e) {
        this.props.changeSetting('gps.simulatePositions', e.target.checked);
    }

    handleChangeUnit(e) {
        this.props.changeSetting('lengthUnit', e.target.value);
    }

    handleChangeAccuracy(e) {
        this.props.changeSetting('maxAccuracy', parseInt(e.target.value, 10));
    }

    handleResetDatabase() {
        if (!confirm('This will delete all your tracks. Are you sure?')) { return; }
        clearTrackDatabase()
            .then(() => { alert('Database cleared'); })
            .catch(event => { alert('Error: ' + event); });
    }

    changeMapTiles(newTilesKey) {
        this.props.changeSetting('mapTiles', newTilesKey);
    }

    render() {
        const settings = this.props.settings;
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
                                    onChange={e => { this.handleChangeUnit(e); }}
                                />
                                Metric
                            </label>
                            <label>
                                <input
                                    name="lengthUnit"
                                    value="imperial"
                                    type="radio"
                                    checked={imperialSystem}
                                    onChange={e => { this.handleChangeUnit(e); }}
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
                            changeMapTiles={newStyleKey => this.changeMapTiles(newStyleKey)}
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
                            onChange={e => { this.handleChangeAccuracy(e); }}
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
                                onChange={e => { this.handleChangeGps(e); }}
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
                        <button onClick={() => { this.handleResetDatabase(); }}>Reset database</button>
                    </div>
                </div>
            </fieldset>
        </Page>;
    }
}

function mapDispatchToProps(dispatch) {
    return {
        changeSetting: (key, value) => dispatch({
            type: 'SETTING_CHANGE',
            key,
            value,
        }),
    }
}

export default connect(mapSettingsToProps, mapDispatchToProps)(Settings);
