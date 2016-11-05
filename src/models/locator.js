
function toUrlParams(obj) {
    return Object
        .keys(obj)
        .map(key => `${key}=${encodeURIComponent(obj[key])}`)
        .join('&');
}

function getName(address) {
    if(!address) { return null; }

    return address.city_district
        || address.city
        || address.town
        || address.county
        || null;
}

export function getLocationName(position, onSuccess) {
    const coords = position.coords;
    const query = toUrlParams({
        lat: coords.latitude,
        lon: coords.longitude,
        format: 'json',
        json_callback: 'jsonpCallback',
    });

    window.jsonpCallback = json => {
        onSuccess(getName(json.address));
    }

    const script = document.createElement('script');
    script.src = `http://nominatim.openstreetmap.org/reverse?${query}`;
    document.body.appendChild(script);
}
