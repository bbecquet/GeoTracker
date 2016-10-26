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

    handleResetDatabase() {
        if (!confirm('This will delete all your tracks. Are you sure?')) { return; }
        this.props.trackStore.clearDatabase(() => {
            alert('Database cleared');
        }, event => {
            alert('Error');
        });
    }

    render() {
        return <div>
            <PageHeader
                title="Settings"
                backPath="/tracks"
            />
            <main>
                <fieldset>
                    <legend>Display</legend>
                    <div className="padding">
                        Length units:&nbsp;
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
                        <p className="helpMsg">For distances and map scale.</p>
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
                <fieldset>
                    <legend>Debugging</legend>
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
