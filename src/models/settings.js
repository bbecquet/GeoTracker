
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
    const result = {};
    for (let [key, value] of Object.entries(settings)) {
        result[key] = value === 'true'
            ? true
            : (value === 'false' ? false : value);
    }
    return result;
}

export const mapTileDefs = {
    osm: {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
        },
    },
    hotosm: {
        name: 'Humanitarian OpenStreetMap',
        url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors. Tiles courtesy of Humanitarian OpenStreetMap Team',
            maxZoom: 17,
        },
    },
    topo: {
        name: 'OpenTopoMap',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        options: {
            attribution: 'Map data &copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors. Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a>.',
            maxZoom: 17,
        }
    },
};
