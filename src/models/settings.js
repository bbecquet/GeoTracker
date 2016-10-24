const defaults = {
    lengthUnit: 'metric',
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
