import React, { Component, PropTypes } from 'react';
import { withRouter } from 'react-router';
import { getSetting, setSetting } from './settings';

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
            <header>
                <button onClick={() => { this.props.router.push('/tracks'); }}>{'<'}</button>
                Settings
            </header>
            <main>
                <fieldset>
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

export default withRouter(SettingsView);
