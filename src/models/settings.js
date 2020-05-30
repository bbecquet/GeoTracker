
const defaults = {
    lengthUnit: 'metric',
    mapTiles: 'osm',
    trackColor: 'blue',
    trackWeight: 3,
    maxAccuracy: 50,
}

export function readSettings() {
    const settings = { ...defaults };
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        settings[key] = value === 'true' ? true : (value === 'false' ? false : value);
    }
    return settings;
}

function saveSetting(key, value) {
    localStorage.setItem(key, value);
}

export function reducer(state, { type, payload }) {
    switch (type) {
        case 'SETTING_CHANGE':
            saveSetting(payload.key, payload.value);
            return {
                ...state,
                [payload.key]: payload.value,
            };
        default:
            return state;
    }
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
        name: 'Humanitarian OSM',
        url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        options: {
            attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors. Tiles courtesy of Humanitarian OpenStreetMap Team',
            maxZoom: 17,
        },
    },
    tonerLite: {
        name: 'Toner lite',
        url: 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
        options: {
            attribution: 'Map data &copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors. Tiles by <a href="http://stamen.com/">Stamen design</a>.',
            subdomains: 'abcd',
            maxZoom: 17,
        },
    },
    topo: {
        name: 'OpenTopoMap',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        options: {
            attribution: 'Map data &copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors. Style &copy; <a href="https://opentopomap.org">OpenTopoMap</a>.',
            maxZoom: 17,
        },
    },
};
