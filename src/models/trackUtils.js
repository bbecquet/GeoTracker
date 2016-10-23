import createGpx from 'gps-to-gpx';
import { saveAs } from 'file-saver';

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
