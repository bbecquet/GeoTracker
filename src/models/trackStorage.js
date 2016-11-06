import idb from 'idb';

/**
Implements an indexedDB-based repository for persistent storage
of tracks accross sessions.
Provides methods to list/add/delete tracks and positions.
*/
const trackStorage = function() {
    let db = null;

    const dbPromise = idb.open('geotracker', 1, upgradeDB => {
        // TODO: create/upgradedb
        // upgradeDB.createObjectStore('geotracker');
    });

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
        createTrack(success, error) {
            const newTrack = {
                name: null,
                createdAt: Date.now(),
            };

            openDB(function() {
                const transaction = db.transaction(['tracks'], 'readwrite');
                transaction.oncomplete = function(event) {
                    success(newTrack);
                };

                const trackStore = transaction.objectStore('tracks');
                const request = trackStore.add(newTrack);
                request.onsuccess = function(event) {
                    const newTrackId = event.target.result;
                    newTrack.id = newTrackId;
                };
            });
        },

        updateTrack(updatedTrack, success, error) {
            openDB(function() {
                const transaction = db.transaction(['tracks'], 'readwrite');
                transaction.oncomplete = function(event) {
                    success(updatedTrack);
                };

                const trackStore = transaction.objectStore('tracks');
                trackStore.put(updatedTrack);
            });
        },

        addPosition(trackId, position, success, error) {
            openDB(function() {
                const transaction = db.transaction(['positions'], 'readwrite');
                transaction.oncomplete = function(event) {
                    success(position.id);
                };

                const trackStore = transaction.objectStore('positions');
                position.trackId = trackId;
                // generate a numerical Id based on timestamp and trackId for range selection
                position.id = Number(trackId) * (1e16) + position.timestamp;
                trackStore.add(position);
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
            return dbPromise.then(db => {
                return db
                    .transaction('tracks', 'readonly')
                    .objectStore('tracks')
                    .getAll();
            });
        },

        getTrack(trackId) {
            return dbPromise.then(db => {
                return db
                    .transaction('tracks', 'readonly')
                    .objectStore('tracks')
                    .get(trackId);
            });
        },

        getTrackPositions(trackId, success, error) {
            openDB(function() {
                const positions = [];
                const positionStore = db.transaction(['positions'], 'readonly').objectStore('positions');
                const positionIdx = positionStore.index('positionIdx');
                const request = positionIdx.openCursor(IDBKeyRange.only(Number(trackId)));
                request.onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        positions.push(cursor.value);
                        cursor.continue();
                    } else {
                        // sort by time stamp (useless?)
                        positions.sort(function(a, b) { return (a.timestamp - b.timestamp); });
                        success(positions);
                    }
                };
                request.onerror = function() {
                    console.error(request.errorCode);
                }
            });
        },

        close() {
            if(db != null) {
                db.close();
                db = null;
            }
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
