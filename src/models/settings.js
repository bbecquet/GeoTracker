export function setSetting(key, value) {
    localStorage.setItem(key, value);
}

export function getSetting(key) {
    const value = localStorage.getItem(key);
    if (value === 'true') { return true; }
    if (value === 'false') { return false; }
    return value;
}
