// Coordinates used to simulate GPS positions in fake mode
import fakeCoords from './fakeGpsCoords.json';
const fakeFrequency = 1000;

class Tracker {
    constructor(useFakePosition) {
        this.fake = useFakePosition;
        this.fakeIndex = -1;
        this.fakeHandler = null;
        this.trackingHandler = null;
    }

    _genOnePosition (onUpdate) {
        console.log('Generating fake position');
        this.fakeIndex = (this.fakeIndex < fakeCoords.length - 1) ? this.fakeIndex + 10 : 0;
        const fakeLngLat = fakeCoords[this.fakeIndex];
        const fakePos = {
            timestamp: Date.now(),
            coords: {
                latitude: fakeLngLat[1],
                longitude: fakeLngLat[0],
                accuracy: Math.random() * 50,
                altitude: Math.random() * 100 + 400,
                altitudeAccuracy: null,
                heading: Math.random() * 360,
                speed: Math.random() * 10 + 5
            }
        };
        onUpdate(fakePos);
    }

    _fakeStart(onUpdate) {
        this.fakeHandler = window.setInterval(() => {
            this._genOnePosition(onUpdate);
        }, fakeFrequency);
    }

    _fakeStop() {
        window.clearInterval(this.fakeHandler);
    }

    _cloneNativePosition(position) {
        return {
            timestamp: position.timestamp,
            coords: {
                 latitude: position.coords.latitude,
                 longitude: position.coords.longitude,
                 accuracy: position.coords.accuracy,
                 altitude: position.coords.altitude,
                 altitudeAccuracy: position.coords.altitudeAccuracy,
                 speed: position.coords.speed,
                 heading: position.coords.heading,
            }
        };
    }

    start(onUpdate, onError) {
        console.log('Start tracking position...');
        if (this.fake) {
            this._fakeStart(onUpdate);
        } else {
            this.trackingHandler = navigator.geolocation.watchPosition(
                position => {
                    // clone the position object, because the native one cannot be added to IndexedDB
                    onUpdate(this._cloneNativePosition(position));
                },
                onError,
                {
                    enableHighAccuracy: true,
                    timeout: 60000,
                    maximumAge: 0
                }
            );
        }
    }

    stop() {
        console.log('Stop tracking position.');
        if (this.fake) {
            this._fakeStop();
        } else {
            navigator.geolocation.clearWatch(this.trackingHandler);
        }
    }
}

export default Tracker;
