import idb from 'idb';

/**
Implements an indexedDB-based repository for persistent storage
of tracks accross sessions.
Provides methods to list/add/delete tracks and positions.
*/
const trackStorage = function() {
    let db = null;

    const openDBPromise = idb.open('geotracker', 1, createDB);

    function createDB(upgradeDB) {
        console.log('Creating track store...');
        upgradeDB.createObjectStore('tracks', { keyPath: 'id', autoIncrement: true });
        console.log('Creating position store...');
        const positionStore = upgradeDB.createObjectStore('positions', { keyPath: 'id' });
        console.log('Creating position index...');
        positionStore.createIndex('positionIdx', 'trackId', { unique: false });
        console.log('Database ready.');
    }

    function openDB(success) {
        if(db != null) {
            success();
            return;
        }
        const request = window.indexedDB.open('geotracker', 1);
        request.onupgradeneeded = function(evt) {
            console.log('Creating track store...');
            evt.currentTarget.result.createObjectStore(
                'tracks', { keyPath: 'id', autoIncrement: true }
            );
            console.log('Creating position store...');
            const positionStore = evt.currentTarget.result.createObjectStore(
                'positions', { keyPath: 'id' }
            );
            console.log('Creating position index...');
            positionStore.createIndex(
                'positionIdx', 'trackId', { unique: false }
            );
            console.log('Database ready.')
        };
        request.onerror = function(event) {
            alert('Error opening DB: '+request.errorCode);
        };
        request.onsuccess = function(event) {
            db = request.result;
            db.onerror = function(event) {
                // Generic error handler for the whole DB
                console.error("DB error: " + event.target.errorCode);
            };
            success();
        };
    };

    const publicMethods = {
        createTrack() {
            const newTrack = {
                name: null,
                createdAt: Date.now(),
            };

            return openDBPromise.then(db => {
                return db.transaction('tracks', 'readwrite')
                    .objectStore('tracks')
                    .add(newTrack)
                    .then(newTrackId => {
                        newTrack.id = newTrackId;
                        return newTrack;
                    });
            });
        },

        updateTrack(updatedTrack) {
            return openDBPromise.then(db => {
                return db.transaction('tracks', 'readwrite')
                    .objectStore('tracks')
                    .put(updatedTrack);
            });
        },

        addPosition(trackId, position) {
            const newPosition = {
                ...position,
                trackId,
                // generate a numerical Id based on timestamp and trackId for range selection
                id: Number(trackId) * (1e16) + position.timestamp,
            };

            return openDBPromise.then(db => {
                return db.transaction('positions', 'readwrite')
                    .objectStore('positions')
                    .add(newPosition);
            });
        },

        deleteTrack(trackId, success, error) {
            openDB(function() {
                const transaction = db.transaction(['tracks', 'positions'], 'readwrite');
                // first delete positions, then track if succesful
                const positionRequest = transaction
                .objectStore('positions')
                .delete(IDBKeyRange.bound(Number(trackId) * (1e16), (Number(trackId)+1) * (1e16), false, true));

                positionRequest.onsuccess = event => {
                    transaction
                    .objectStore('tracks')
                    .delete(Number(trackId));
                }

                transaction.oncomplete = event => { success(); };
            });
        },

        getTrackList() {
            return openDBPromise.then(db => {
                return db
                    .transaction('tracks', 'readonly')
                    .objectStore('tracks')
                    .getAll();
            });
        },

        getTrack(trackId) {
            return openDBPromise.then(db => {
                return db
                    .transaction('tracks', 'readonly')
                    .objectStore('tracks')
                    .get(trackId);
            });
        },

        getTrackPositions(trackId) {
            return openDBPromise.then(db => {
                return db
                    .transaction('positions', 'readonly')
                    .objectStore('positions')
                    .index('positionIdx')
                    .getAll(IDBKeyRange.only(Number(trackId)))
                    .then(positions => {
                        return positions.sort((a, b) => a.timestamp - b.timestamp);
                    });
            });
        },

        clearDatabase(success, error) {
            const request = indexedDB.deleteDatabase('geotracker');
            request.onSuccess = success;
            request.onError = error;
        },
    };

    return publicMethods;
};

export default trackStorage;
