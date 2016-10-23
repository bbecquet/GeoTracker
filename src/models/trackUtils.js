import createGpx from 'gps-to-gpx';
import { saveAs } from 'file-saver';
import L from 'leaflet';

export function exportTrackAsGpx(track, positions) {
    const wayPoints = positions.map(p => {
        return {
            latitude: p.coords.latitude,
            longitude: p.coords.longitude,
        };
    });
    const gpx = createGpx(wayPoints);
    const blob = new Blob([gpx], {type: 'application/xml;charset=utf-8'});
    saveAs(blob, 'test.gpx');
}

export function getLength(positions) {
    return positions.map(p => L.latLng(p.coords.latitude, p.coords.longitude))
        .reduce((distance, ll, index, latLngs) => {
            if (index === 0) { return 0; }
            return distance + ll.distanceTo(latLngs[index - 1]);
        }, 0);
}
