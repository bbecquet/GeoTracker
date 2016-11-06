const defaults = {
    lengthUnit: 'metric',
    mapTiles: 'osm',
    maxAccuracy: 30,
}

export function setSetting(key, value) {
    localStorage.setItem(key, value);
}

export function getSetting(key) {
    const value = localStorage.getItem(key) || defaults[key];
    if (value === 'true') { return true; }
    if (value === 'false') { return false; }
    return value;
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
}

export function getMapStyle() {
    return mapTileDefs[getSetting('mapTiles')];
}
