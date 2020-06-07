function toUrlParams(obj) {
  return Object.keys(obj)
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&');
}

function getName(address) {
  if (!address) {
    return null;
  }

  return (
    address.city_district ||
    address.city ||
    address.town ||
    address.county ||
    null
  );
}

export function getLocationName(position) {
  const coords = position.coords;
  const query = toUrlParams({
    lat: coords.latitude,
    lon: coords.longitude,
    format: 'json',
    json_callback: 'jsonpCallback',
  });

  return new Promise((resolve, reject) => {
    try {
      window.jsonpCallback = json => {
        resolve(getName(json.address));
      };

      const script = document.createElement('script');
      script.src = `https://nominatim.openstreetmap.org/reverse?${query}`;
      document.body.appendChild(script);
    } catch {
      reject('Error georeferencing the track');
    }
  });
}
