import _ from 'lodash';

const defaults = {
    lengthUnit: 'metric',
    mapTiles: 'osm',
    maxAccuracy: 50,
}

function readSettings() {
    const settings = { ...defaults };
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        settings[key] = localStorage.getItem(key);
    }
    return settings;
}

function saveSetting(key, value) {
    localStorage.setItem(key, value);
}

export function reducer(state = readSettings(), action) {
    switch (action.type) {
        case 'SETTING_CHANGE':
            saveSetting(action.key, action.value);
            return {
                ...state,
                [action.key]: action.value,
            };
        default:
            return state;
    }
}

export function mapSettingsToProps(settings) {
    return _.mapValues(settings, value => {
        if (value === 'true') { return true; }
        if (value === 'false') { return false; }
        return value;
    });
}

export const mapTileDefs = {
    osm: {
        name: 'OpenStreetMap',
        url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }
    },
    hotosm: {
        name: 'Humanitarian OpenStreetMap',
        url: 'http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors. Tiles courtesy of Humanitarian OpenStreetMap Team'
        }
    }
};
