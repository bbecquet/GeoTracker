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

    render() {
        return <div>
            <PageHeader
                title="Settings"
                backPath="/tracks"
            />
            <main>
                <fieldset className="padding">
                    <legend>GPS</legend>
                    <label>
                        <input
                            type="checkbox"
                            checked={getSetting('gps.simulatePositions')}
                            onChange={e => { this.handleChangeGps(e); }}
                        />
                        Use fake GPS positions
                    </label>
                </fieldset>
            </main>
        </div>;
    }
}

export default SettingsView;
