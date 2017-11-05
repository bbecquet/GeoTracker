import React, { Component, PropTypes } from 'react';
import { mapTileDefs, mapSettingsToProps } from '../models/settings';
import PageHeader from '../components/PageHeader';
import MapBackgroundChooser from '../components/MapBackgroundChooser';
import Length from '../components/Length';
import { clearTrackDatabase } from '../models/trackStorage';
import { connect } from 'react-redux';

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

        return <div>
            <PageHeader
                title="Settings"
                backPath="/tracks"
            />
            <main>
                <fieldset>
                    <legend>Display</legend>
                    <div className="padding">
                        <div className="setting">
                            Length units:&nbsp;
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
                            <p className="helpMsg">For distances and map scale.</p>
                        </div>
                        <div className="setting">
                            Map background style
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
                            <p>Accuracy limit</p>
                            <input type="range"
                                min={10} max={500} step={10}
                                value={maxAccuracy}
                                onChange={e => { this.handleChangeAccuracy(e); }}
                            />&nbsp;
                            <Length
                                meters={maxAccuracy}
                                imperialSystem={imperialSystem}
                            />
                            <p className="helpMsg">Positions with accuracy beyond this value won't be recorded.</p>
                        </div>
                        <label>
                            <input
                                type="checkbox"
                                checked={settings['gps.simulatePositions']}
                                onChange={e => { this.handleChangeGps(e); }}
                            />
                            Use fake GPS positions
                        </label>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>Data</legend>
                    <div className="padding">
                        <label>
                            <button onClick={() => { this.handleResetDatabase(); }}>Reset database</button>
                        </label>
                        <p className="helpMsg">Will remove all tracks.</p>
                    </div>
                </fieldset>
            </main>
        </div>;
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
