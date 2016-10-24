import React, { Component, PropTypes } from 'react';
import { getSetting, setSetting } from '../models/settings';
import PageHeader from '../components/PageHeader';

class SettingsView extends Component {
    static propTypes = {
        trackStore: PropTypes.object.isRequired,
    }

    handleChangeGps(e) {
        setSetting('gps.simulatePositions', e.target.checked);
        this.forceUpdate();
    }

    handleChangeUnit(e) {
        setSetting('lengthUnit', e.target.value);
        this.forceUpdate();
    }

    render() {
        return <div>
            <PageHeader
                title="Settings"
                backPath="/tracks"
            />
            <main>
                <fieldset>
                    <legend>Length system</legend>
                    <div className="padding">
                        <label>
                            <input
                                name="lengthUnit"
                                value="metric"
                                type="radio"
                                checked={getSetting('lengthUnit') === 'metric'}
                                onChange={e => { this.handleChangeUnit(e); }}
                            />
                            Metric
                        </label>
                        <label>
                            <input
                                name="lengthUnit"
                                value="imperial"
                                type="radio"
                                checked={getSetting('lengthUnit') === 'imperial'}
                                onChange={e => { this.handleChangeUnit(e); }}
                            />
                            Imperial
                        </label>
                    </div>
                </fieldset>
                <fieldset>
                    <legend>GPS</legend>
                    <div className="padding">
                        <label>
                            <input
                                type="checkbox"
                                checked={getSetting('gps.simulatePositions')}
                                onChange={e => { this.handleChangeGps(e); }}
                            />
                            Use fake GPS positions
                        </label>
                    </div>
                </fieldset>
            </main>
        </div>;
    }
}

export default SettingsView;
